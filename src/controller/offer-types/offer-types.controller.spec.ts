import { Test, TestingModule } from '@nestjs/testing';
import { OfferTypesController } from './offer-types.controller';

describe('OfferTypesController', () => {
  let controller: OfferTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferTypesController],
    }).compile();

    controller = module.get<OfferTypesController>(OfferTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
