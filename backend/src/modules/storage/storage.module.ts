import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';

@Module({
  providers: [StorageService],
  exports: [StorageService], // <-- This line exposes the service to other modules
})
export class StorageModule {}