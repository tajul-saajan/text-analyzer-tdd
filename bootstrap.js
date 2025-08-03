const moduleAlias = require('module-alias');
const path = require('path');

// Set up path aliases for production
moduleAlias.addAliases({
  '@/app': path.join(__dirname, 'dist/src/app'),
  '@/config': path.join(__dirname, 'dist/src/config'),
  '@config': path.join(__dirname, 'dist/src/config'),
  '@controllers': path.join(__dirname, 'dist/src/controllers'),
  '@dtos': path.join(__dirname, 'dist/src/dtos'),
  '@/entities': path.join(__dirname, 'dist/src/entities'),
  '@/decorators': path.join(__dirname, 'dist/src/decorators'),
  '@exceptions': path.join(__dirname, 'dist/src/exceptions'),
  '@interfaces': path.join(__dirname, 'dist/src/interfaces'),
  '@middlewares': path.join(__dirname, 'dist/src/middlewares'),
  '@routes': path.join(__dirname, 'dist/src/routes'),
  '@services': path.join(__dirname, 'dist/src/services'),
  '@/services': path.join(__dirname, 'dist/src/services'),
  '@utils': path.join(__dirname, 'dist/src/utils'),
  '@/utils': path.join(__dirname, 'dist/src/utils'),
  '@tests': path.join(__dirname, 'dist/src/tests'),
  '@seeders': path.join(__dirname, 'dist/src/seeders')
});

// Now require the main server file
require('./dist/src/server.js');