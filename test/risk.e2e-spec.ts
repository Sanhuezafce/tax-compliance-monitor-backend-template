// test/risk.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from './../src/app.module';

// I will use mockTaxpayerData instead of the variables that read directly the dict for now
import { mockTaxpayerData } from './../src/risk/test/mock-data'
import request from 'supertest'

describe('RiskController (e2e)', () => {
  let app: INestApplication;
  const mockModel = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  // Existing before and after logic is a proposal but can be modified
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken('Taxpayer'))
      .useValue(mockModel)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await Promise.all([
      app.close(),
      new Promise((resolve) => setTimeout(resolve, 500)), // Allow cleanup
    ]);
  });
  // As we are testing API calls we will be using async funcs
  describe('/api/risk/taxpayers (GET)', () => {
    it('should return list of taxpayers', async () => {
      // Mock the `find` method to return all taxpayers from the mock data
      mockModel.find.mockResolvedValueOnce([mockTaxpayerData.taxpayer]);
  
      // Await the API request, we use getHttpServer to adapt what supertest expect with the NestJS structure
      const response = await request(app.getHttpServer()).get('/api/risk/taxpayers');

  
      // Validate the response
      expect(response.status).toBe(200); //Testing response
      expect(response.body).toEqual([mockTaxpayerData.taxpayer]); // We use toEqual instead of toBe, because we are testing Arrays
      expect(mockModel.find).toHaveBeenCalledTimes(1); // Testing call
    });
  });

  describe('/api/risk/:taxpayerId (GET)', () => {
    it('should return taxpayer risk data', async () => {
      // We use the info provided in mockData
      const taxpayerId = mockTaxpayerData.taxpayer.id;
      const taxpayerRiskData = mockTaxpayerData.riskProfile

      // We do the request
      // We use backtick for the syntax ${}
      const response = await request(app.getHttpServer()).get(`/api/risk/${taxpayerId}`)

      // Same validation as before
      expect(response.status).toBe(200); // Test response status
      expect(response.body).toEqual(taxpayerRiskData); // Test return value
      expect(mockModel.findOne).toHaveBeenCalledWith({ id: taxpayerId }); // Test the call was made with the given parameter
    });

    it('should return 404 for non-existent taxpayer', () => {
      // We use an empty string to simulate a non existing id
      const taxpayerNonId = "";

      // The data should be null
      mockModel.findOne.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer()).get(`/api/risk/${taxpayerNonId}`);

      // Validate that a 404 status is returned
      expect(response.status).toBe(404);  
      expect(response.body).toEqual({ message: 'Taxpayer not found' }); // Displayed message when not found
      expect(mockModel.findOne).toHaveBeenCalledWith({ id: nonExistentTaxpayerId });  // Test parameter
    });
  });
  // Similar test as above, we change the return data and, it assumesthe taxpayer exists
  describe('/api/risk/:taxpayerId/history (GET)', () => {
    it('should return taxpayer history', () => {
      // We use the info provided in mockData
      const taxpayerId = mockTaxpayerData.taxpayer.id;
      const taxpayerHistory = mockTaxpayerData.history;

      // We do the request
      // We use backtick for the syntax ${}
      const response = await request(app.getHttpServer()).get(`/api/risk/${taxpayerId}/history`)

      // Same validation as before
      expect(response.status).toBe(200); // Test response status
      expect(response.body).toEqual(taxpayerHistory); // Test return value
      expect(mockModel.findOne).toHaveBeenCalledWith({ id: taxpayerId }); // Test the call was made with the given parameter
    });
    // We repeat the same condition as above, to ensure the call works either way
    // There should be a way to convert this to a function to modularize this segment but right now, ill leave it like this
    it('should return 404 for non-existent taxpayer', () => {
      // We use an empty string to simulate a non existing id
      const taxpayerNonId = "";

      // The data should be null
      mockModel.findOne.mockResolvedValueOnce(null);

      const response = await request(app.getHttpServer()).get(`/api/risk/${taxpayerId}/history`)

      // Validate that a 404 status is returned
      expect(response.status).toBe(404);  
      expect(response.body).toEqual({ message: 'Taxpayer not found' }); // Displayed message when not found
      expect(mockModel.findOne).toHaveBeenCalledWith({ id: nonExistentTaxpayerId });  // Test parameter
    });
  });
});
