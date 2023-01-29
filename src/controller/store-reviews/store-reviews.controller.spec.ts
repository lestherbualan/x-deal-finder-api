import { Test, TestingModule } from '@nestjs/testing';
import { StoreReviewsController } from './store-reviews.controller';

describe('StoreReviewsController', () => {
  let controller: StoreReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreReviewsController],
    }).compile();

    controller = module.get<StoreReviewsController>(StoreReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
