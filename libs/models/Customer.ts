import { subYears } from 'date-fns';
import { ObjectId } from 'mongodb';
import { staticMethod as StaticMethod, ModelType, prop as Property, Typegoose, arrayProp as ArrayProperty } from 'typegoose';
import { cnpjValidator, cpfValidator, emailValidator } from '../shared/mongooseValidators';
import { InvestmentProfile } from './InvestmentProfile';
import { Question } from './Question';

type CustomerType = 'person' | 'company';
type CustomerGender = 'male' | 'female' | 'other';

export const CustomerTypeEnum = {
  COMPANY: 'company',
  PERSON: 'person'
};

export const CustomerGenderEnum = {
  FEMALE: 'female',
  MALE: 'male',
  OTHER: 'other'
};

export const PersonalBankAccountTypeEnum = {
  CHECKING: 'checking', // Conta corrente
  SALLARY: 'sallary', // Conta salário
  SAVING: 'saving' // Conta poupança
};

async function duplicateEmailValidator(this: any, value: string) {
  const document = this.parent().parent();
  let query: any = {
    'contactInfo.emails.address': value
  };

  if (!document.isNew) {
    query = { ...query, _id: { $ne: document._id } };
  }

  return (await CustomerModel.count(query)) === 0;
}

export class Email {
  // tslint:disable-next-line: variable-name
  public _id: string | ObjectId;

  @Property({
    lowercase: true,
    required: true,
    trim: true,
    validate: [{
      message: 'E-mail inválido',
      validator: emailValidator
    }, {
      message: 'E-mail já cadastrado',
      validator: duplicateEmailValidator
    }]
  })
  public address: string;
}

// export class RG {
//   /**
//    * Número
//    */
//   @Property({ required: true })
//   public number: string;
// }

/**
 * Informações de pessoa física
 */
export class PersonalInfo {
  @Property({ required: true })
  public name: string;

//   @Property({ required: true })
//   public rg: RG;

  // @Property({
  //   required: true,
  //   validate: {
  //     message: 'O cliente deve ter pelo menos 18 anos',
  //     validator: (value: Date) => value <= subYears(new Date(), 18)
  //   }
  // })
  // public birthDate: Date;

  @Property({ required: true, validate: cpfValidator, unique: true, sparse: true })
  public cpf: string;

  @Property({ required: true, enum: CustomerGenderEnum })
  public gender: CustomerGender;
}

/**
 * Informações de pessoa jurídica
 */
export class CompanyInfo {
  /**
   * Razão social
   */
  @Property({ required: true })
  public companyName: string;

  /**
   * Nome fantasia
   */
  @Property({ required: true })
  public tradingName: string;

  @Property({ required: true })
  public municipalRegistration: string;

  @Property({ required: true })
  public stateRegistration: string;

  @Property({ required: true })
  public creationDate: Date;

  @Property({ required: true, validate: cnpjValidator, unique: true, sparse: true })
  public cnpj: string;

  @Property({ required: true })
  public field: string;
}


/**
 * Informações de contato
 */
export class ContactInfo {
  @Property({ required: true })
  public email: Email;
}

export class Customer extends Typegoose {
  @StaticMethod
  public static async calculatePoints(this: ModelType<InvestmentProfile> & typeof Customer, customer: Customer) {
    return customer.questions.reduce((prev, next) => {
      return next.point + prev;
    }, 0);
  }

  public _id: string | ObjectId;

  @Property()
  public contactInfo: ContactInfo;

  @Property()
  public investmentProfile: InvestmentProfile;

  @ArrayProperty({ items: Question })
  public questions: Question[];

  @Property({ required() { return this.type === 'person'; } })
  public personalInfo?: PersonalInfo;

  @Property({ required() { return this.type === 'company'; } })
  public companyInfo?: CompanyInfo;

  @Property({ enum: CustomerTypeEnum, required: true })
  public type: CustomerType;

  @Property()
  get displayName() {
    if (this.type === 'company') {
      return this.companyInfo.tradingName;
    }

    return this.personalInfo.name;
  }
}

export const CustomerModel =
  new Customer().getModelForClass(Customer, { schemaOptions: { collection: 'customers', timestamps: true } });
