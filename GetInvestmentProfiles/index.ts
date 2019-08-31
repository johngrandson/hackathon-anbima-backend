import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import mongoConnect from '../libs/shared/mongoConnect';
import { InvestmentProfileModel } from '../libs/models/InvestmentProfile';
import requestPipeline from '../libs/shared/requestPipeline';
import { generateResponse } from '../libs/shared/responseHelpers';
import mongoQueryGenerator from '../libs/shared/middlewares/mongoQueryGenerator';

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  await mongoConnect();

  const {
    filter,
    skip,
    limit,
    sort,
    projection,
    population,
  } = req.mongoQuery;
  const documentCount: number = await InvestmentProfileModel.count(filter);

  const responseBody = await InvestmentProfileModel.find(filter)
    .populate(population)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(projection);

  context.res = generateResponse(responseBody, 200, {
    'Access-Control-Expose-Headers': 'X-Total-Count',
    'X-Total-Count': documentCount,
  });
};

export default requestPipeline(mongoQueryGenerator, httpTrigger);
