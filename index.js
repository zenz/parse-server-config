const express = require('express');
const compression = require('compression');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const fs = require('fs');
const app = express();
const url = process.env.SERVER_URL;
const port = process.env.SERVER_PORT;
const mountPath = process.env.PARSE_MOUNT;
const dashPath = process.env.DASH_MOUNT;

var api = new ParseServer({
  databaseURI: process.env.DATABASE_URI,
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  appName: process.env.APP_NAME,
  cloud: './cloud/main.js',
  expireInactiveSessions: true,
  sessionLength: 2592000,
  serverURL:  url + ':' + port + mountPath,
  publicServerURL: url + ':' + port + mountPath,
  allowClientClassCreation: false,
  verifyUserEmails: true,
  emailVerifyTokenValidityDuration: 2 * 60 * 60,
  preventLoginWithUnverifiedEmail: true,
  emailAdapter: {
    module: 'parse-server-generic-email-adapter',
    options: {
      service: process.env.MAIL_SERVICE,
      email: process.env.MAIL_EMAIL,
      from: process.env.MAIL_FROM,
      password: process.env.MAIL_PASSWORD
    }
  },
  accountLockout: {
    duration: 10,
    threshold: 5,
  },
  passwordPolicy: {
    validatorPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    validationError: 'Password must with at least 8 char with at least 1 lower case, 1 upper case and 1 digit',
    doNotAllowUsername: true,
    maxPasswordAge: 90,
    maxPasswordHistory: 5,
    resetTokenValidityDuration: 24*60*60
  },
  filesAdapter: {
    module: '@parse/fs-files-adapter'
  },
  liveQuery: {
    classNames: ['Diet_Plans'],
    redisURL: 'redis://localhost:6379'
  }
});

var dashboard = new ParseDashboard({
  apps: [{
    serverURL: url + ':' + port + mountPath,
    appId: process.env.APP_ID,
    masterKey: process.env.MASTER_KEY,
    appName: process.env.APP_NAME,
    production: true,
  }],
  users: [{
    user: process.env.DASH_USER,
    pass: process.env.DASH_PASSWORD
  }],
  useEncryptedPasswords: true
}, {
    cookieSessionSecret: process.env.COOKIE
   }
);

var cert = {
  key: fs.readFileSync(process.env.SSL_KEY),
  cert: fs.readFileSync(process.env.SSL_CER)
};

app.use(compression());
app.use(mountPath, api);
app.use(dashPath, dashboard);
app.get('/', function(req, res) {
  res.status(500);
});

var httpServer = require('https').createServer(cert, app);
httpServer.listen(port, function(){
  console.log('parse-server and parse-dashboard running.');
});

ParseServer.createLiveQueryServer(httpServer, {
    redisURL: 'redis://localhost:6379'
});