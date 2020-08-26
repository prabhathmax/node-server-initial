import { inspect } from 'util';
import { errorKey } from '../constants';
import makeCtx from './makeCtx';

// / Produces an express route handler, wrapping a function that accepts the
// / arguments (ctx, query or body).
// / The "ctx" object (short for "context") contains services and information about
// / the request.
///
// / The route implementation should return an object/array to have it sent back
// / as JSON, or throw an error which will be formatted and returned.
///
// / Some properties of the "ctx" object:
// /   - cache: see cache.js
// /   - req: the express 'req' object
// /   - res: the express 'res' object; don't attempt to send a response through it
// /   - token: a string or null auth token
// /   - classic: an interface to the PHP API, see classicApi.js
// /   - es: the elasticsearch wrapper defined in es.js
function makeRoute(implementation) {
  return async (req, res) => {
    let ctx;
    try {
      ctx = makeCtx(req.originalUrl);
      ctx.req = req;
      ctx.res = res;

      // TODO: make API able to specify a token is required,
      // and validate the token with the classic api?
      // Would need to be cached
      ctx.token = req.headers.authorization;

      if (ctx.token) {
        // We'll need this later
      }

      const queryArg = ['get', 'head', 'delete', 'options'].includes(
        req.method.toLowerCase(),
      )
        ? req.query
        : req.body;

      // Invoke the handler, which may throw
      const result = await implementation(ctx, queryArg);

      if (!res.headersSent) {
        const final = result == null ? null : result;
        res.json(final);
      }
    } catch (error) {
      try {
        // eslint-disable-next-line no-console
        console.error(
          `ERROR - in ${req.originalUrl}`,
          inspect(error, { depth: 7, maxArrayLength: 3000 }),
        );

        const message = error.message;

        if (error && error.RAW_RESPONSE) {
          res.status(error.RAW_RESPONSE.status).json(error.RAW_RESPONSE.body);
        }

        // Is this an expected error? This is normally created
        // by error.js's throwError function
        if (error && error[errorKey]) {
          const etc = { ...error.etc };
          let status = parseInt(error.status, 10) || 422;
          if (status < 200 || status > 599) {
            status = 500;
            etc._original_error_status = status;
          }

          res.status(status).json({
            id: error.id,
            status,
            type: error.type,
            message: error.message || '(unknown)',
            etc,
          });

          return;
        }

        // if (process.env.NODE_ENV === 'production') {
        //   message = `An unexpected error occurred`;
        // }

        // Not an expected error, so give a 500
        res.status(500).json({
          status: 500,
          type: 'internal_error',
          message,
          etc: {},
          stack: (error && error.stack && String(error.stack)) || null,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error handler raised an error ;_;', error);
        res.status(500).json({
          message: 'Error handler raised an error ;_;',
          origMessage: error.message,
        });
      }
    }
  };
}

export default makeRoute;
