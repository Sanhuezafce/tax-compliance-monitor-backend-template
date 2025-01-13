// src/risk/risk.controller.ts
import { Controller, Get } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get('taxpayers')
  async getAllTaxpayers() {
    // TODO: Implement controller method
    return 'Not implemented';
  }

  @Get(':taxpayerId')
  async getTaxpayerRisk() {
    // TODO: Implement controller method
    return 'Not implemented';
  }

  @Get(':taxpayerId/history')
  async getRiskHistory() {
    // TODO: Implement controller method
    return 'Not implemented';
  }
}
