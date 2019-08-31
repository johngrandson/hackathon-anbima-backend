import { ObjectId } from 'mongodb';
import { prop as Property, Typegoose } from 'typegoose';

export class InvestmentProfile extends Typegoose {
  public _id: string | ObjectId;

  @Property({ required: true })
  public name: string;

  @Property({ required: true })
  public points: number;
}

export const InvestmentProfileModel =
  new InvestmentProfile().getModelForClass(InvestmentProfile, { schemaOptions: { collection: 'investmentProfile', timestamps: true } });
