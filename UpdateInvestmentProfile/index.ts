/* eslint-disable import/no-unresolved */
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { badRequest, notFound } from '@hapi/boom';
import mongoConnect from '../libs/shared/mongoConnect';
import { InvestmentProfileModel } from '../libs/models/InvestmentProfile';
import requestPipeline from '../libs/shared/requestPipeline';
import { generateResponse } from '../libs/shared/responseHelpers';
import { isValidObjectId } from '../libs/shared/utils';

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  await mongoConnect();

  const { id } = req.params;
  if (!isValidObjectId(id)) throw badRequest('ID do perfil de investimento é inválido!');

  await InvestmentProfileModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, profile) => {
    if (err) throw err;

    if (!profile) throw notFound('Perfil não encontrado!');

    profile.save((error: any) => {
      if (error) throw error;

      context.res = generateResponse(profile);
    });
  });
};

export default requestPipeline(httpTrigger);
