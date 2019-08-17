// Route 설정 파일
const Route = require('koa-router');
const postCtrl = require('./posts.ctrl');

const posts = new Route();

posts.get('/', postCtrl.list);
posts.post('/', postCtrl.write);
posts.get('/:id', postCtrl.checkObjectId, postCtrl.read);
posts.delete('/:id', postCtrl.checkObjectId, postCtrl.remove);
posts.patch('/:id', postCtrl.checkObjectId, postCtrl.update);

module.exports = posts;