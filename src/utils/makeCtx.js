import envConfig from '../envConfig';

// / Documented in makeRoute.js
function makeCtx(name = '(ctx)') {
  const ctx = {
    name,
    isCtx: true,
    req: null,
    res: null,
    config: envConfig,
    cache: null,
  };

  return ctx;
}

export default makeCtx;
