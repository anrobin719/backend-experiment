const Post = require('models/post');
const Joi = require('joi');
const { ObjectId } = require('mongoose').Types;

// Object Id 검증
exports.checkObjectId = (ctx, next) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return null;
  }

  return next();
};

// 데이터 생성 및 조회
exports.write = async (ctx) => {
  // 객체가 지닌 값들을 검증
  const schema = Joi.object().keys({
    title: Joi.string().required(), // 뒤에 required를 붙이면 필수 항목이라는 의미
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required()
  });

  // 첫 번째 파라미터는 검증할 객체, 두 번째는 스키마
  const result = Joi.validate(ctx.request.body, schema);

  // 오류가 발생하면 오류 내용 응답
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;

  const post = new Post({
    title, body, tags
  });

  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.list = async (ctx) => {
  // page가 주어지지 않았다면 1로 간주
  // query는 문자열 형태로 받아 오므로 숫자로 변환
  const page = parseInt(ctx.query.page || 1, 10);

  // 잘못된 페이지가 주어졌다면 오류
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .exec();

    const postCount = await Post.countDocuments().exec();

    const limitBodyLength = (post) => ({
      ...post,
      body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`
    });
    ctx.body = posts.map(limitBodyLength);

    // 마지막 페이지 알려주기
    // ctx.set은 response header를 설정
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = posts;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.read = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

exports.update = async (ctx) => {
  const { id } = ctx.params;
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true
    }).exec();

    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};