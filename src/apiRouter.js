// ! This defines all APIs for the server. Most are intended to be public,
// ! and others contain UUIDs that should be kept private, but it's not
// ! acceptable for them to have security issues if the path is discovered.
//!
// ! For details on what each route receives as arguments, see makeRoute.js
import { Router } from 'express';
import bodyParser from 'body-parser';
import accounts from './apis/accounts';
import makeRoute from './utils/makeRoute';

const apiRouter = new Router();
const invalidMethodRouter = new Router();

addRoute('POST', '/api/v1/account', accounts);

invalidMethodRouter.get('/api/*', invalidApi);
invalidMethodRouter.post('/api/*', invalidApi);
invalidMethodRouter.put('/api/*', invalidApi);
invalidMethodRouter.patch('/api/*', invalidApi);
invalidMethodRouter.delete('/api/*', invalidApi);

apiRouter.use(invalidMethodRouter);

function invalidApi(req, res) {
  res.status(405).json({
    message: `There is no API for ${req.method.toUpperCase()} ${JSON.stringify(
      req.originalUrl,
    )}`,
  });
}

// Internal routes for testing controllers
function ctrlRoute(func) {
  const url = `/api/v1/internal/6d2437b9-0218-4ee9-9232-09affd9453d1/ctrl/${func.name}`;
  addRoute('POST', url, func);
}

function addRoute(method, url, apiFunction, extraQuery = null) {
  const args = [url];
  const lowMethod = method.toLowerCase();
  if (lowMethod === 'post' || lowMethod === 'put') {
    args.push(bodyParser.json());
  }
  args.push(
    makeRoute((ctx, query, ...rest) =>
      apiFunction(
        ctx,
        {
          ...query,
          ...extraQuery,
        },
        ...rest,
      ),
    ),
  );

  apiRouter[lowMethod](...args);

  invalidMethodRouter.all(url, (req, res) => {
    res
      .status(405)
      .json({
        message: `The http method ${
          req.method
        } isn't supported for this endpoint. At least ${method} is allowed.`,
      });
  });
}

export default apiRouter;
