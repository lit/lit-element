const Koa = require('koa');
const mount = require('koa-mount');
const staticFiles = require('koa-static');
const {nodeResolve} = require('koa-node-resolve');
const {esmToAmd} = require('koa-esm-to-amd');

module.exports = (karma) =>
    new Koa()
        .use(esmToAmd())
        .use(mount('/base', new Koa().use(nodeResolve()).use(staticFiles('.'))))
        .use(karma);
