import { Test, TestingModule } from '@nestjs/testing';
import { StoreReviewsService } from './store-reviews.service';

describe('StoreReviewsService', () => {
  let service: StoreReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreReviewsService],
    }).compile();

    service = module.get<StoreReviewsService>(StoreReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
