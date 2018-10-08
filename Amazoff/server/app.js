const http = require('http');
const app = require('express')();
const bodyParser = require('body-parser');
const logger = require('./logger');


const port = 8080;
const server = http.createServer(app);
logger.accessLog.info('Server Started');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.all('/*', (req, res, next) => {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header(
    'Access-Control-Allow-Headers',
    'Content-type,Accept,X-Access-Token,X-Key',
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});
app.get('/', (req, res) => {
  res.send('Web app running.');
});

server.listen(port, () => logger.accessLog.info(`Listening on port ${port}`));
