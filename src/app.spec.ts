import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppModule } from './app.module';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return hello message', () => {
      const hello = 'Hello World';
      jest.spyOn(service, 'getHello').mockReturnValue(hello);

      const result = controller.getHello();

      expect(result.result).toBe(hello);
    });

    it('should return 200 status code', () => {
      const result = controller.getHello();

      expect(result.code).toBe(200);
    });

    it('should return "nice" message', () => {
      const result = controller.getHello();

      expect(result.message).toBe('nice');
    });
  });
});

describe('AppModule', () => {
  let appModule: AppModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    appModule = module.get<AppModule>(AppModule);
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });
});
