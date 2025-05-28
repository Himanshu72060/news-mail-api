const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const Post = require('../models/Post');
const Subscriber = require('../models/Subscriber');
const nodemailer = require('nodemailer');

dotenv.config();

// ✅ Confirm that environment variables are available
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_HOST_USER,
    pass: process.env.EMAIL_HOST_PASSWORD
  },
});

// ✅ Post news and send emails
router.post('/post', async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content });
    await post.save();

    const subscribers = await Subscriber.find();
    const emails = subscribers.map(sub => sub.email);

    for (let email of emails) {
      await transporter.sendMail({
        from: `"News App" <${process.env.EMAIL_HOST_USER}>`, // <- better consistency
        to: email,
        subject: `New Post: ${title}`,
        text: content,
      });
    }

    res.status(201).json({ message: 'Post created and notifications sent.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Subscribe email
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    res.status(201).json({ message: 'Subscribed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
