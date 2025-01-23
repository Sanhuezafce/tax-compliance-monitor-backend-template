// src/risk/risk.service.spec.ts

// Use the following test and mongoose imports to test the RiskService class:
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RiskService } from './risk.service';
//import { Taxpayer } from '../database/schemas/taxpayer.schema';
import { mockTaxpayerData, mockTaxpayerHistory } from './test/mock-data';

describe('RiskService', () => {
  let service : RiskService;

  const mockModel = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiskService],
    })
    .overrideProvider(getModelToken('Taxpayer'))
    .useValue(mockModel)
    .compile();
    service = module.get<RiskService>(RiskService); // Get service

  });

  it('should be defined', () => {
    expect(service).toBeDefined();  // The service should be non Null after beforeEach
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTaxpayerRisk', () => {
    it('should return taxpayer risk data', async () => {
      // Get info from mockData
      const taxpayerId = mockTaxpayerData.taxpayer.id; 
      const taxpayerRiskData = mockTaxpayerData.riskProfile; 
  
      // Mock the response of findOne method
      mockModel.findOne.mockResolvedValueOnce({
        ...mockTaxpayerData.taxpayer, // The taxpayer data
        riskProfile: taxpayerRiskData, // The riskProfile data
      });
  
      // Call the service method
      const result = await service.getTaxpayerRisk(taxpayerId);
  
      // Validate the response
      expect(result).toEqual(taxpayerRiskData); // Test body of result
      expect(mockModel.findOne).toHaveBeenCalledWith({ id: taxpayerId }); // Test Id
      expect(mockModel.findOne).toHaveBeenCalledTimes(1); // Test call
    });
  
    it('should return null when taxpayer not found', async () => {
      const taxpayerNullId = "";
      
      // Mock the case where no taxpayer is found
      mockModel.findOne.mockResolvedValueOnce(null);
  
      // Call the service method
      const result = await service.getTaxpayerRisk(taxpayerNullId);
  
      // Validate the result
      expect(result).toBeNull(); // Ensure null is returned when no taxpayer is found
      expect(mockModel.findOne).toHaveBeenCalledWith({ id: taxpayerNullId });
    });
  });

  describe('getRiskHistory', () => {
    it('should return taxpayer history', async () => {
      // Get info from mockData
      const taxpayerId = mockTaxpayerData.taxpayer.id; 
      const taxpayerHistory = mockTaxpayerData.history; 
 
      // Mock the response of findOne method
      mockModel.findOne.mockResolvedValueOnce({
        ...mockTaxpayerData.taxpayer, // The taxpayer data
        history: taxpayerHistory, // The riskProfile data
    });
      
      // Call the service method
      const result = await service.getRiskHistory(taxpayerId);
  
    });
    it('should return null when no history found', async () => {
      const taxpayerNullId = "";
      
      // Mock the case where no taxpayer is found
      mockModel.findOne.mockResolvedValueOnce(null);
  
      // Call the service method
      const result = await service.getTaxpayerRisk(taxpayerNullId);
  
      // Validate the result
      expect(result).toBeNull(); // Ensure null is returned when no taxpayer is found
      expect(mockModel.findOne).toHaveBeenCalledWith({ id: taxpayerNullId });
    });
  });

  describe('getAllTaxpayers', () => {
    it('should return all taxpayers basic info', async () => {
      // Mock data for multiple taxpayers
      const aTaxpayer = mockTaxpayerData
      const taxpayers = [aTaxpayer,aTaxpayer]; // We add it twice to simulate multiple taxpayers
  
      // Mock the response of the model find method to return the taxpayers data
      mockModel.find.mockResolvedValueOnce(taxpayers);
  
      // Call the service method
      const result = await service.getAllTaxpayers();
  
      // Validate the response
      expect(result).toEqual(taxpayers); // Ensure taxpayers data is returned
      expect(mockModel.find).toHaveBeenCalledTimes(1); // Ensure `find` was called once
    });
  });
});
