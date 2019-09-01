import { ObjectId } from 'mongodb';
import { prop as Property, Typegoose } from 'typegoose';

export class Question extends Typegoose {
  public _id: string | ObjectId;

  @Property({ required: true })
  public description: string;

  @Property({ required: true })
  public point: number;
}

export const QuestionModel =
  new Question().getModelForClass(Question, { schemaOptions: { collection: 'question', timestamps: true } });
