import mongoose from 'mongoose'
const { Schema, model, models, Types } = mongoose

const ImageSchema = new Schema({
  url: { type: String, required: true },
  public_id: { type: String },
  width: Number,
  height: Number,
  bytes: Number,
  format: String,
  folder: String,
}, { _id: false })

const SoftwareSchema = new Schema({
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
  description: { type: String, trim: true, maxlength: 4000 },
  categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
  categoryTitle: { type: String, trim: true },
  type: { type: String, enum: ['pc', 'mobile'], required: true },
  version: { type: String, trim: true },
  vendor: { type: String, trim: true },
  website: { type: String, trim: true },
  license: { type: String, trim: true, default: 'free' },
  downloadLink: { type: String, trim: true },
  altDownloadLink: { type: String, trim: true },
  thumbnailUrl: { type: String, trim: true },
  images: { type: [ImageSchema], default: [] },
  tags: { type: [String], default: [] },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  downloads: { type: Number, min: 0, default: 0 },
  releaseDate: { type: Date },
  sizeMB: { type: String, trim: true },
  osSupport: { type: String, trim: true },
  notes: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

SoftwareSchema.index({ title: 1, type: 1 }, { unique: false })

export const Software = models.Software || model('Software', SoftwareSchema)


