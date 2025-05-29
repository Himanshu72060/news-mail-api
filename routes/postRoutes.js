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

// get all posts
router.get('/post', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// get a single post by id
router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a post by id
router.delete('/post/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a post by id
router.put('/post/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all subscribers
router.get('/subscribe', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).json(subscribers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single subscriber by id
router.get('/subscribe/:id', async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found.' });
    }
    res.status(200).json(subscriber);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a subscriber by id
router.delete('/subscribe/:id', async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found.' });
    }
    res.status(200).json({ message: 'Subscriber deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a subscriber by id
router.put('/subscribe/:id', async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findByIdAndUpdate(req.params.id, { email }, { new: true });
    if (!subscriber) {
      return res.status(404).json({ error: 'Subscriber not found.' });
    }
    res.status(200).json(subscriber);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
);


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
