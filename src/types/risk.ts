// src/types/risk.ts
import type { ComplianceStatus, RiskEventType, RiskTrend } from './common';
import type { TaxpayerInfo } from './taxpayer';

export interface TaxTypeRisk {
  score: number;
  exposure: number;
  lastFiled: string;
  nextDue: string;
  status: ComplianceStatus;
}

export interface RiskScore {
  score: number;
  previousScore?: number;
  trend: RiskTrend;
  exposure: number;
}

export interface RiskProfile {
  overall: RiskScore;
  components: {
    vat: TaxTypeRisk;
    incomeTax: TaxTypeRisk;
  };
}

export interface RiskEvent {
  type: RiskEventType;
  description: string;
  exposure: number;
}

export interface HistoricalRiskData {
  period: string;
  overallScore: number;
  vatScore: number;
  incomeTaxScore: number;
  totalExposure: number;
  events?: RiskEvent[];
}

export interface TaxpayerRiskData {
  taxpayer: TaxpayerInfo;
  riskProfile: RiskProfile;
  history: HistoricalRiskData[];
}
