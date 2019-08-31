import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import mongoConnect from "../libs/shared/mongoConnect";
import { CustomerModel } from "../libs/models/Customer";
import { generateResponse } from "../libs/shared/responseHelpers";
import requestPipeline from "../libs/shared/requestPipeline";

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  await mongoConnect();

  const customer = await new CustomerModel(req.body);
  if (customer) {
    await customer.save();
    context.res = generateResponse({ message: `Perfil do cliente criado com sucesso!` }, 200);
  } else {
    context.res = generateResponse({ message: `Erro ao criar perfil do cliente!` }, 400);
  }
};

export default requestPipeline(httpTrigger);