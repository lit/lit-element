const path = require('path');
const karma = require('karma');
const portfinder = require('portfinder');
const Koa = require('koa');
const mount = require('koa-mount');
const static_ = require('koa-static');
const proxy = require('koa-proxy');
const {nodeResolve} = require('koa-node-resolve');

console.log('Initializing Karma with Koa Node Resolve Proxy Server');
console.log('-----------------------------------------------------');

// The `portfinder` package will check for available ports, starting
// with 9876 and ascending until it reaches the OS limit.
portfinder.getPort({port: 9876}, (_err: unknown, port: number) => {
  let karmaServerProxy = async (_ctx: unknown, _next: unknown) => {};
  const proxyPort = port;
  console.log('Starting Proxy Server...');
  const proxyServer =
      new Koa()
          .use(mount('/base', new Koa().use(nodeResolve()).use(static_('.'))))
          .use((ctx: unknown, next: unknown) => karmaServerProxy(ctx, next))
          .listen(proxyPort);
  process.on('SIGINT', () => proxyServer.close())
  console.log('Proxy Server listening on port', proxyPort);

  console.log('Starting Karma Server...');
  const karmaConfig = {
    configFile: path.join(__dirname, '../karma.conf.js'),
    upstreamProxy: {hostname: '127.0.0.1', port: proxyPort},
    port: proxyPort + 1,
    singleRun: process.argv.indexOf('--single-run') !== -1,
  };
  const karmaServer = new karma.Server(karmaConfig, (exitCode: number) => {
    console.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
  });
  karmaServer.on('listening', (port: number) => {
    const karmaPort = port;
    console.log('Karma Server listening on port', karmaPort);
    karmaServerProxy = proxy({host: `http://127.0.0.1:${karmaPort}/`});
  });
  karmaServer.start();
});
