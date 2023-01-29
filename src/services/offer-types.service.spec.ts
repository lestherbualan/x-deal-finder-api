import { Test, TestingModule } from '@nestjs/testing';
import { OfferTypesService } from './offer-types.service';

describe('OfferTypesService', () => {
  let service: OfferTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferTypesService],
    }).compile();

    service = module.get<OfferTypesService>(OfferTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
