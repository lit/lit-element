/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const Koa = require('koa');
const mount = require('koa-mount');
const staticFiles = require('koa-static');
const {nodeResolve} = require('koa-node-resolve');
const {esmTransform} = require('koa-esm-transform');
const LRU = require('lru-cache');
const cache = new LRU({max: 1000});
const {browserCapabilities} = require('browser-capabilities');

const cacheMeOutside = async (ctx, next) => {
    const capabilitiesList = [...browserCapabilities(ctx.request.header['user-agent']||'').keys()].sort();
    const key = `${ctx.request.href}#${capabilitiesList}`;
    const cachedResponse = cache.has(key) && cache.get(key);
    if (cachedResponse) {
        ctx.response.status = cachedResponse.status;
        ctx.response.body = cachedResponse.body;
        ctx.response.length = cachedResponse.length;
        ctx.response.type = cachedResponse.type;
        return;
    }
    await next();
    cache.set({
        status: ctx.status,
        body: ctx.body,
        length: ctx.length,
        type: ctx.type
    });
}

module.exports = (karma) =>
    new Koa()
        .use(cacheMeOutside)
        .use(esmTransform())
        .use(mount('/base', new Koa().use(nodeResolve()).use(staticFiles('.'))))
        .use(karma);
