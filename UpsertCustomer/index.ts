/* eslint-disable import/no-unresolved */
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import mongoConnect from '../libs/shared/mongoConnect';
import { CustomerModel } from '../libs/models/Customer';
import requestPipeline from '../libs/shared/requestPipeline';
import { generateResponse } from '../libs/shared/responseHelpers';
import { InvestmentProfileModel } from '../libs/models/InvestmentProfile';
import updateDocument from '../libs/shared/updateDocument';

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  await mongoConnect();

  const { cpf } = req.body.personalInfo;

  let customer = await CustomerModel.findOne({ "personalInfo.cpf": cpf });

  if (customer) {
    const points = await CustomerModel.calculatePoints(req.body);
    const investmentProfile = await InvestmentProfileModel.findOne({ points });
    customer = req.body;
    customer.investmentProfile = investmentProfile;
    updateDocument(customer, req.body);
    context.res = generateResponse(customer);

  } else {
    const newCustomer = await CustomerModel.create(req.body);
    const points = await CustomerModel.calculatePoints(newCustomer);
    const investmentProfile = await InvestmentProfileModel.findOne({ points });
    newCustomer.investmentProfile = investmentProfile;
    await newCustomer.save();
    context.res = generateResponse(newCustomer);
  }
  
};

export default requestPipeline(httpTrigger);