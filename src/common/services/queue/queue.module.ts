import { Module } from '@nestjs/common';
import { QueueConsumer } from './queue.consumer';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TRANSCODE_QUEUE } from 'src/common/constansts';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: TRANSCODE_QUEUE,
    }),
  ],
  controllers: [],
  providers: [QueueConsumer],
  exports: [QueueConsumer, BullModule],
})
export class QueueModule {}
