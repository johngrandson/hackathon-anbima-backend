import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { notFound } from '@hapi/boom';
import mongoConnect from "../libs/shared/mongoConnect";
import requestPipeline from '../libs/shared/requestPipeline';
import { generateResponse } from '../libs/shared/responseHelpers';
import { InvestmentProfileModel } from '../libs/models/InvestmentProfile';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  await mongoConnect();

  const investmentProfileId: string = req.params.id;
  const investmentProfile = await InvestmentProfileModel.findByIdAndDelete(investmentProfileId);

  if (!investmentProfile) {
    throw notFound('Nenhum perfil de investimento encontrado com o ID informado');
  }

  context.res = generateResponse(null, 204);
};

export default requestPipeline(httpTrigger);
