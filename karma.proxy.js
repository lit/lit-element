const Koa = require('koa');
const mount = require('koa-mount');
const staticFiles = require('koa-static');
const {nodeResolve} = require('koa-node-resolve');

module.exports = (karma) => new Koa()
  .use(mount('/base', new Koa()
    .use(nodeResolve())
    .use(staticFiles('.'))))
  .use(karma);
