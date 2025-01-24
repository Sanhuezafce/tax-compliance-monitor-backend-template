// src/risk/risk.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { TaxpayerRiskData, HistoricalRiskData } from '../types/risk';
import type { TaxpayerInfo } from '../types/taxpayer';
import { Taxpayer } from '../database/schemas/taxpayer.schema';
import { Model } from 'mongoose'; 


@Injectable()
export class RiskService {
  constructor(
    // The taxpayer should be private for encapsulation purposes
    @InjectModel(Taxpayer.name) private readonly taxpayerModel: Model<Taxpayer>,
  ) {}

  // getTaxPayerRisk: str -> Promise<TaxPayerRiskData>
  // Returns the taxPayerRisk from the object
  async getTaxpayerRisk(taxpayerId: string): Promise<TaxpayerRiskData | null> {
    try {
      // Query the database to find the taxpayer by ID
      const taxpayer = await this.taxpayerModel.findOne({ id: taxpayerId }).populate('riskProfile'); 

      if (!taxpayer) {
        return null; // Return null if the taxpayer is not found
      }

      // Map the result to match the TaxpayerRiskData structure
      const taxpayerRiskData: TaxpayerRiskData = {
        taxpayer: {
          id: taxpayer.id,
          name: taxpayer.name,
          taxTypes: taxpayer.taxTypes,
        },
        riskProfile: taxpayer.riskProfile, // Assuming 'riskProfile' is already part of the taxpayer schema
        history: taxpayer.history, // Assuming 'history' is part of the taxpayer schema (if applicable)
      };

      return taxpayerRiskData;
    } catch (error) {
      console.error('Error fetching taxpayer risk data:', error);
      throw new Error('Failed to fetch taxpayer risk data');
    }
  }
}

  async getRiskHistory(): Promise<HistoricalRiskData[] | null> {
    // TODO: Implement service method
    return null;
  }

  async getAllTaxpayers(): Promise<TaxpayerInfo[]> {
    // TODO: Implement service method
    return [];
  }
}
