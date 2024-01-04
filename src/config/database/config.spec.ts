import { DataBaseConfigService } from './config.service';
import { ConfigService } from '@nestjs/config';

describe('DataBaseConfigService', () => {

  let service: DataBaseConfigService;
  let configService: ConfigService;

  beforeEach(() => {
    configService = new ConfigService({database: 'db'}); 
    service = new DataBaseConfigService(configService);
  });

  it('should create TypeOrm options from config', () => {
    expect(service.createTypeOrmOptions()).toEqual('db');
  });

//   it('should throw error if config missing', () => {
//     configService = new ConfigService({});
//     service = new DataBaseConfigService(configService);
//     expect(() => service.createTypeOrmOptions()).toThrow();
//   });

});
