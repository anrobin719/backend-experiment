// 스키마 생성
const mongoose = require('mongoose');

const { Schema } = mongoose;

const Post = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishedDate: {
    type: Date,
    default: new Date()
  }
});

// 모델 생성
module.exports = mongoose.model('Post', Post);