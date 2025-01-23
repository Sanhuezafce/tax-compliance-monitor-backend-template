// src/database/schemas/taxpayer.schema.ts
// Left some imports for the base structure
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {TaxType, 
  ComplianceStatus, 
  RiskTrend,
  RiskEventType} from "../../types/common"

@Schema({ _id: false })
// Defined based on the interface in types/taxpayer
export class TaxpayerInfo {
  @Prop({ 
    required: true,
    index: true,
    unique: true
   })
  id: string;

  @Prop({ 
    required: true, 
    index: true // Indexing name could be benefitial since its a typical search field
  })
  name: string;

  //Including the enum to ensure only the TaxType strings are valid
    @Prop({ 
      enum: ['VAT', 'INCOME_TAX'], 
      required: true
    })
    taxTypes: TaxType;
  }

@Schema({ _id: false })
export class TaxTypeRisk {
  @Prop({ 
    required: true,
    index: true,
   })
  score: number;

  @Prop({ 
    required: true,
  })
  exposure: number;

  // One index could be useful in lastFiled or nextDue
  // Could be helpful to know the latest or closest needed document
  @Prop({ 
    required: true,
   })
   lastFiled: string;

   @Prop({ 
    required: true, // Am assuming some data should be able to be uploaded without all the fields
                    // in this case, i would do that but the interface doesnt specify that this could be optional
   })
   nextDue: string;
 
   // I am indexing ComplianceStatus due to it being categorical, could be useful to filter with scores
   @Prop({ 
    required: true,
    index: true,
    enum:['COMPLIANT','LATE','MISSING']
   })
   status: ComplianceStatus;
}

@Schema({ _id: false })
export class RiskScore {

  @Prop({ 
    required: true,
    index: true // Could be useful to sort and search by scores
   })
   score: number;

   @Prop({ 
    required: true,
   })
   previousScore: number;

   // Am indexing the categorical value for better querys with the scores.
   @Prop({ 
    required: true,
    index: true,
    enum: ['up', 'down', 'stable']
   })
   trend: RiskTrend;

   @Prop({ 
    required: true,
   })
   exposure: number;
}

@Schema({ _id: true })
export class RiskComponents {
  @Prop({ 
    required: true, 
  })
  vat: TaxTypeRisk; 
  
  @Prop({ 
    required: true 
  })
  incomeTax: TaxTypeRisk;

}

@Schema({ _id: true })
export class RiskProfile {
  @Prop({ 
    required: true,
   })
   overall: RiskScore; //Elements inside RiskScore are already indexed so the only index is _id

   @Prop({
    required: true
  })
  components: RiskComponents;  // both keys gets mapped to TaxTypeRisk
}

@Schema({ _id: true })
export class RiskEvent {
  @Prop({ 
    required: true,
    enum: ['LATE_FILING','MISSING_DECLARATION','RISK_INCREASE'],
    index: true
   })
   type: RiskEventType;

   @Prop({ 
    required: true,
   })
   description: string;

   @Prop({ 
    required: true,
     })
   exposure: number;

}

@Schema({ _id: true })
export class HistoricalRiskData {
  @Prop({ 
    required: true,
   })
   period: string;

   @Prop({ 
    required: true,
   })
   overallScore: number;

   @Prop({ 
    required: true,
   })
   vatScore: number;

   @Prop({ 
    required: true,
   })
   incomeTaxScore: number;
   
   @Prop({ 
    required: true,
   })
   totalExposure: number;
   
   @Prop({ 
    required: false, // Due to the interface declaring events?: 
    type: [RiskEvent], // I dont use enum as i already defined that in RiskEvent
   })
   events?: RiskEvent[];

}
@Schema({ _id: true }) // The most appropiate index on TaxPayer would be over the whole schema instead of any of the props
export class Taxpayer {
  @Prop({ 
    required: true,
   })
  taxpayer: TaxpayerInfo;

  @Prop({ 
    required: true,
   })
  riskProfile: RiskProfile;

  @Prop({ 
    required: true,
    type: [HistoricalRiskData]
   })
  history: HistoricalRiskData[];
}

export const TaxpayerSchema = SchemaFactory.createForClass(Taxpayer);
export type TaxpayerDocument = HydratedDocument<Taxpayer>;
