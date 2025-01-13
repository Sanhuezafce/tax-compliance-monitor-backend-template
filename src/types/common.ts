// src/types/common.ts
export type TaxType = 'VAT' | 'INCOME_TAX';
export type ComplianceStatus = 'COMPLIANT' | 'LATE' | 'MISSING';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RiskTrend = 'up' | 'down' | 'stable';
export type RiskEventType =
  | 'LATE_FILING'
  | 'MISSING_DECLARATION'
  | 'RISK_INCREASE';
