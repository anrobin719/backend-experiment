const Route = require('koa-router');
const posts = require('./posts');

const api = new Route();

api.use('/posts', posts.routes());

module.exports = api;