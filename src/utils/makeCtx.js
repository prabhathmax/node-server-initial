import envConfig from '../envConfig';
import Knex from 'knex';

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

  const knex = Knex({
    client: 'mysql',
    connection: envConfig.dbUrl,
    pool: { min: 0, max: 7 },
    useNullAsDefault: true,
  });
  ctx.mysql = knex();
  return ctx;
}

export default makeCtx;
