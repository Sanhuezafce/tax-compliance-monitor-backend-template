// src/types/taxpayer.ts
import type { TaxType } from './common';

export interface TaxpayerInfo {
  id: string;
  name: string;
  taxTypes: TaxType[];
}
