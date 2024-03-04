const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  description: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
