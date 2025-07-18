import mongoose from 'mongoose';

const passwordSchema = new mongoose.Schema({
  userId: String, // Clerk user ID
  name: String,
  username: String,
  password: String, // Encrypted
  iv: String        // Encryption IV
});

export default mongoose.model('Password', passwordSchema);