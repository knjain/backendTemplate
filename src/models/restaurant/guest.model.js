const {default: mongoose} = require('mongoose');
const {paginate} = require('../plugins/paginate');

const guestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      sparse: true,
      unique: true,
      default: null,
    },
    phone: {
      type: String,
      sparse: true,
      unique: true,
      default: null,
    },
    lastBookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

guestSchema.plugin(paginate);

module.exports.Guest = mongoose.model('Guest', guestSchema);
