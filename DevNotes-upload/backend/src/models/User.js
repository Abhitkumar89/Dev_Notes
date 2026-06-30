import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Firebase UID from Google sign-in (unique per Google account)
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    // User-defined categories used to organise notes
    categories: {
      type: [String],
      default: ['React', 'Node', 'DSA', 'Interview', 'JavaScript', 'Database'],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
