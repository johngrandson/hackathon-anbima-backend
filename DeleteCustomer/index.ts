import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { notFound } from '@hapi/boom';
import mongoConnect from "../libs/shared/mongoConnect";
import requestPipeline from '../libs/shared/requestPipeline';
import { generateResponse } from '../libs/shared/responseHelpers';
import { CustomerModel } from '../libs/models/Customer';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await mongoConnect();

  const customerId: string = req.params.id;
  const customer = await CustomerModel.findByIdAndDelete(customerId);

  if (!customer) {
    throw notFound('Nenhum cliente encontrado com o ID informado');
  }

  context.res = generateResponse(null, 204);
};

export default requestPipeline(httpTrigger);
