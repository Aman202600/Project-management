const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Cascade delete tasks when a project is deleted
ProjectSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  console.log(`Tasks being removed from project ${this._id}`);
  await this.model('Task').deleteMany({ project_id: this._id });
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);
