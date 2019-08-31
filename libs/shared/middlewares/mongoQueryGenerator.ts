const aqp = require('api-query-params');
import { Context, HttpRequest } from '@azure/functions';
import * as url from 'url';

declare module '@azure/functions' {
  interface HttpRequest {
    mongoQuery: {
      filter: Object;
      projection: Object;
      sort: Object;
      skip: number;
      limit: number;
      population?: Object;
    };
  }
}

export default async function mongoQueryGenerator(
  context: Context,
  req: HttpRequest
): Promise<void> {
  const parsedUrl = url.parse(req.url);

  if (parsedUrl.search) {
    req.mongoQuery = aqp(parsedUrl.search.substring(1));
  }

  req.mongoQuery = req.mongoQuery || {
    filter: {},
    projection: {},
    sort: {},
    skip: 0,
    limit: 1000
  };
}
