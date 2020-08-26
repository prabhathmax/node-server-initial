// const ALLOWED = [/(^|\.)sfrhub.com$/, /^localhost$/];

function cors(req, res, next) {
  // let enable = ALLOWED.some((regex) => regex.test(req.hostname));
  // if (req.ip === '127.0.0.1') enable = true;

  // if (enable) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  if (req.method.toUpperCase() === 'OPTIONS') {
    res.end();
  } else {
    next();
  }
}

export default cors;
