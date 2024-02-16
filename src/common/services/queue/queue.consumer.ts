import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TRANSCODE_QUEUE } from 'src/common/constansts';

@Processor(TRANSCODE_QUEUE)
export class QueueConsumer {
  private readonly logger = new Logger(QueueConsumer.name);

  @Process()
  async transcode(job: Job<{ fileNamee: string }>) {
    this.logger.log(`Transcoding message: ${job.id}`);
    this.logger.debug('Data:', job.data);

    const { fileNamee } = job.data;

    // Resto de tu lógica de transcodificación aquí...

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 8000));

    this.logger.log(`Transcoding complete for job: ${fileNamee}`);
  }
}
