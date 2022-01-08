/**
 * @description Defines a User profile model
 */
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const {Schema} = mongoose;

const UserProfileSchema = new Schema({
  username: {required: true, trim: true, type: String, unique: true},
  password: {required: true, select: false, type: String},
  serviceName: {default: 'local', required: true, trim: true, type: String},
  lastLogin: {type: Date},
  userRoles: {
    default: ['user'],
    type: [String]
  },
  isEnabled: {default: true, type: Boolean},
});

UserProfileSchema.pre(
  'save',
  async function(next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  }
);

UserProfileSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

UserProfileSchema.methods.toJSON = function() {
  return {
    _id: this._id,
    username: this.username,
    lastLogin: this.lastLogin,
  };
};

export default mongoose.model('UserProfile', UserProfileSchema);