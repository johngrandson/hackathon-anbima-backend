import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import mongoConnect from "../libs/shared/mongoConnect";
import { InvestmentProfileModel } from "../libs/models/InvestmentProfile";
import { generateResponse } from "../libs/shared/responseHelpers";
import requestPipeline from "../libs/shared/requestPipeline";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  await mongoConnect();

  const investmentProfile = await new InvestmentProfileModel(req.body);

  if (investmentProfile) {
    await investmentProfile.save();
    context.res = generateResponse({ message: `Perfil de investimento criado com sucesso!` }, 200);
  } else {
    context.res = generateResponse({ message: `Erro ao criar perfil de investimento!` }, 400);
  }
};

export default requestPipeline(httpTrigger);