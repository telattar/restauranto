import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { createFakeRestaurant } from '../src/modules/restaurants/factories/restaurants.factory';
import { faker } from '@faker-js/faker/.';
import { createFakeProduct } from '../src/modules/products/factories/product.factory';
import { ORDERS_STATUS } from '../src/modules/orders/constants/orders.constants';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Restaurants API', () => {
    let restaurantId: string;
    it('should get all restaurants', async () => {
      const response = await request(server).get('/restaurants');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('restaurants');
      expect(Array.isArray(response.body.restaurants)).toBeTruthy();
      restaurantId = response.body.restaurants[0].id;
    });

    it('should get restaurant by id', async () => {
      const response = await request(server).get(`/restaurants/${restaurantId}`);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('restaurant');
      expect(response.body.restaurant.id).toBe(restaurantId);
    });

    it('should create a restaurant', async () => {
      const { name, description } = createFakeRestaurant();
      const response = await request(server).post('/restaurants').send({ name, description });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('createdRestaurant');
      expect(response.body.createdRestaurant.name).toBe(name);
      expect(response.body.createdRestaurant.description).toBe(description);
    });

    it('should update a restaurant', async () => {
      const updatedData = { name: faker.person.fullName() };
      const response = await request(server).patch(`/restaurants/${restaurantId}`).send(updatedData);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('updatedRestaurant');
      expect(response.body.updatedRestaurant.name).toBe(updatedData.name);
    });

    it('should delete a restaurant', async () => {
      const { name, description } = createFakeRestaurant();
      const restaurantToDelete = await request(server).post('/restaurants').send({ name, description });
      const { id } = restaurantToDelete.body.createdRestaurant;

      const response = await request(server).delete(`/restaurants/${id}`);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });
  });

  describe('Products API', () => {
    let productId: string;

    it('should create a product', async () => {
      const { id: restaurantId } = (await request(server).get('/restaurants')).body.restaurants[0];
      const { name, price } = createFakeProduct();
      const response = await request(server).post('/products').send({
        name,
        restaurantId,
        price,
      });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('createdProduct');
      expect(response.body.createdProduct).toHaveProperty('id');
      productId = response.body.createdProduct.id;
    });

    it('should get all products', async () => {
      const response = await request(server).get('/products');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('products');
      expect(Array.isArray(response.body.products)).toBeTruthy();
    });

    it('should get product by id', async () => {
      const response = await request(server).get(`/products/${productId}`);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('product');
      expect(response.body.product.id).toBe(productId);
    });

    it('should update a product', async () => {
      const updatedData = { price: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }) };
      const response = await request(server).patch(`/products/${productId}`).send(updatedData);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('updatedProduct');
      expect(response.body.updatedProduct.price).toBe(updatedData.price);
    });

    it('should delete a product', async () => {
      const response = await request(server).delete(`/products/${productId}`);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });
  });

  describe('Ordering API', () => {
    let orderId: string;

    it('should create an order', async () => {
      const { id: restaurantId } = (await request(server).get('/restaurants')).body.restaurants[0];
      const { id: productId } = (await request(server).get('/products')).body.products[0];
      const response = await request(server)
        .post('/orders')
        .send({
          restaurantId,
          orderProducts: [{ productId, quantity: 2 }],
        });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('createdOrder');
      expect(response.body.createdOrder).toHaveProperty('id');
      orderId = response.body.createdOrder.id;
    });

    it('should get all orders', async () => {
      const response = await request(server).get('/orders');
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBeTruthy();
    });

    it('should get order by id', async () => {
      const response = await request(server).get(`/orders/${orderId}`);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('order');
    });

    it('should update an order', async () => {
      const updatedData = { status: ORDERS_STATUS.DELIVERED };
      const response = await request(server).patch(`/orders/${orderId}`).send(updatedData);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('updatedOrder');
      expect(response.body.updatedOrder.status).toBe(updatedData.status);
    });
  });

  describe('error handling', () => {
    it('should return not found for non-existent routes', async () => {
      const response = await request(server).get('/some-wierd-route');
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return bad request for invalid UUIDs', async () => {
      const response = await request(server).get('/restaurants/bla-bla-bla');
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should throw an error for invalid data', async () => {
      const response = await request(server).post('/products').send({
        invalidField: 'bla bla',
      });
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toHaveProperty('message');
    });
  });
});
