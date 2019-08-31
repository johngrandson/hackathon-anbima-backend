import { AzureFunction, Context } from '@azure/functions';
import { handleError } from './responseHelpers';

export default function requestPipeline(...functions: AzureFunction[]) {
  return async function (context: Context, ...args: any[]): Promise<void> {
    for (const f of functions) {
      try {
        await f(context, ...args);
      } catch (error) {
        context.res = handleError(error, context.log);
      }

      if (context.res && !(context.res.status instanceof Function)) {
        break;
      }
    }
  };
}
