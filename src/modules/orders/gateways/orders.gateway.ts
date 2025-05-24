import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

// This decorator marks the class as a WebSocket gateway
// allowing it to handle ws connections and events
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'order-status',
})
export class OrdersGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  // injects socket.io server instance into the class
  @WebSocketServer() server: Server;

  afterInit() {
    Logger.log('Initialized websocket gateway for orders status.');
  }

  handleConnection(client: any) {
    Logger.log(`Client id: ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    Logger.log(`Cliend id:${client.id} disconnected`);
  }

  //emits an event for a status update of an order
  statusUpdate(orderId: string, status: string) {
    const shortOrderId = orderId.split('-')[0];
    this.server.emit('order-status', { orderId: shortOrderId, status });
  }

  //emits an event for a newly created order
  notifyOfCreation() {
    this.server.emit('created-order');
  }
}
