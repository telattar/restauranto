import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

// making this a global module to avoid injecting the service in each module
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
