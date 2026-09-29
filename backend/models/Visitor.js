const mongoose = require('mongoose');

// Schema for Visitor Registration
const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company or College name is required'],
      trim: true,
    },
    personToMeet: {
      type: String,
      required: [true, 'Person to meet is required'],
      trim: true,
    },
    purpose: {
      type: String,
      required: [true, 'Purpose of visit is required'],
      trim: true,
    },
    // Auto-recorded Date & Time upon entry
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['In Premises', 'Checked Out'],
      default: 'In Premises',
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // creates createdAt and updatedAt automatically
  }
);

visitorSchema.index({ checkInTime: -1 });

module.exports = mongoose.model('Visitor', visitorSchema);
