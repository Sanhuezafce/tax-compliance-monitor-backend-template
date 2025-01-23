// src/database/schemas/taxpayer.schema.ts
// Left some imports for the base structure
import { Schema, SchemaFactory, Prop, Index } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {TaxType, 
  ComplianceStatus, 
  RiskLevel,
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

@Schema({ _id: false })
export class RiskComponents {
  // TODO: Add properties
}

@Schema({ _id: false })
export class RiskProfile {
  @Prop({ 
    required: true,
    type: RiskScore
   })
   overall: RiskScore;

   @Prop({
    type: Map,
    of: TaxTypeRisk,  // As both components are string:TaxTypeRisk
    required: true,
  })
  components: Map<string, TaxTypeRisk>;  // both keys gets mapped to TaxTypeRisk
}

@Schema({ _id: false })
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
    index: true // due to not having a score, indexing exposure could work. together with the categorical data
   })
   exposure: number;

}

@Schema({ _id: false })
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

@Schema()
export class Taxpayer {
  // TODO: Add properties
}

export const TaxpayerSchema = SchemaFactory.createForClass(Taxpayer);
export type TaxpayerDocument = HydratedDocument<Taxpayer>;
