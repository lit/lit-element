const Koa = require('koa');
const mount = require('koa-mount');
const staticFiles = require('koa-static');
const {nodeResolve} = require('koa-node-resolve');
const {
  esmToAmd,
  babelTransformEs2015,
  babelTransformEs2016,
  babelTransformEs2017,
  babelTransformEs2018,
  babelTransformModulesAmd
} = require('koa-esm-to-amd');

module.exports = (karma) =>
  new Koa()
    .use(esmToAmd({
          logLevel: 'debug'
          // babelPlugins: [
          //   ...babelTransformEs2015,
          //   ...babelTransformEs2016,
          //   ...babelTransformEs2017,
          //   ...babelTransformEs2018,
          //   ...babelTransformModulesAmd
          // ]
        }))
        .use(mount('/base', new Koa().use(nodeResolve()).use(staticFiles('.'))))
        .use(karma);
