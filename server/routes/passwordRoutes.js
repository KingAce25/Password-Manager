import express from 'express';
import Password from '../models/Password.js';
import { encrypt, decrypt } from '../utils/encrption.js';

const router = express.Router();

// 🔐 Save password
router.post('/', async (req, res) => {
  const { userId, name, username, password } = req.body;
  const { encryptedData, iv } = encrypt(password);

  const newEntry = new Password({ userId, name, username, password: encryptedData, iv });
  await newEntry.save();

  res.status(201).json({ message: 'Password saved' });
});

// 📥 Get all for user
router.get('/:userId', async (req, res) => {
  const passwords = await Password.find({ userId: req.params.userId });
  const decrypted = passwords.map(entry => ({
    ...entry._doc,
    password: decrypt(entry.password, entry.iv)
  }));
  res.json(decrypted);
});

// 🗑️ Delete password
router.delete('/:id', async (req, res) => {
  await Password.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
