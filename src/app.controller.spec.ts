import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from './modules/v1/hello/hello.controller';
import { HelloService } from './modules/v1/hello/hello.service';

describe('HelloController (v1)', () => {
  let controller: HelloController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
      providers: [HelloService],
    }).compile();

    controller = app.get<HelloController>(HelloController);
  });

  describe('GET /v1/hello', () => {
    it('should return "Hello World v1!"', () => {
      expect(controller.getHello()).toBe('Hello World v1!');
    });
  });
});
