const {default: mongoose} = require('mongoose');

const adminSchema = new mongoose.Schema({}, {timestamps: true});

module.exports = {
  adminSchema,
};
