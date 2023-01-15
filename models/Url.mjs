import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  origin: {
    type: String
  },
  date: {
    type: String,
    default: Date.now
  }
});

export default mongoose.model('Url', UrlSchema);