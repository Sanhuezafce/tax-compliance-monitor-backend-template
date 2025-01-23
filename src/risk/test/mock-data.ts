// src/risk/test/mock-data.ts
export const mockTaxpayerData = {
  taxpayer: {
    id: 'TP001',
    name: 'Acme Corp',
    taxTypes: ['VAT', 'INCOME_TAX'],
  },
  riskProfile: {
    overall: {
      score: 55,
      previousScore: 45,
      trend: 'up',
      exposure: 25000000,
    },
    components: {
      vat: {
        score: 58,
        exposure: 15000000,
        lastFiled: '2024-11-14',
        nextDue: '2025-01-14',
        status: 'COMPLIANT',
      },
      incomeTax: {
        score: 32,
        exposure: 10000000,
        lastFiled: '2023-04-29',
        nextDue: '2025-04-29',
        status: 'COMPLIANT',
      },
    },
  },
  history: [
    {
      period: '2024-11',
      overallScore: 55,
      vatScore: 58,
      incomeTaxScore: 32,
      totalExposure: 25000000,
      events: [
        {
          type: 'RISK_INCREASE',
          description: 'Multiple late VAT filings detected',
          exposure: 3000000, // Delta from previous month
        },
      ],
    },
    {
      period: '2024-10',
      overallScore: 52,
      vatScore: 55,
      incomeTaxScore: 32,
      totalExposure: 22000000,
      events: [
        {
          type: 'RISK_INCREASE',
          description: 'Inconsistent VAT declaration patterns',
          exposure: 2000000, // Delta
        },
      ],
    },
    {
      period: '2024-09',
      overallScore: 50,
      vatScore: 52,
      incomeTaxScore: 32,
      totalExposure: 20000000,
      events: [
        {
          type: 'LATE_FILING',
          description: 'VAT filing deadline missed by 2 days',
          exposure: 2000000, // Delta
        },
      ],
    },
    {
      period: '2024-08',
      overallScore: 48,
      vatScore: 48,
      incomeTaxScore: 32,
      totalExposure: 18000000,
      events: [
        {
          type: 'LATE_FILING',
          description: 'VAT declaration submitted close to deadline',
          exposure: 3000000, // Delta
        },
      ],
    },
    {
      period: '2024-07',
      overallScore: 45,
      vatScore: 45,
      incomeTaxScore: 32,
      totalExposure: 15000000,
      events: [
        {
          type: 'MISSING_DECLARATION',
          description:
            'Initial risk assessment - Supporting documentation pending',
          exposure: 15000000, // Base exposure
        },
      ],
    },
    // Add more historical data...
  ],
};

export const mockTaxpayerHistory = mockTaxpayerData.history;
//added const to export the rest of the data 
// For now i am not using them but i will have them defined
export const mockTaxpayerInfo = mockTaxpayerData.taxpayer;
export const mockTaxpayerRiskProfile = mockTaxpayerData.riskProfile;
