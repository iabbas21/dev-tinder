const express = require('express');
const { userAuth } = require('../middlewares/auth');
const generateSignedUrl = require('../utils/generateSignedUrl');
const courseRouter = express.Router()

courseRouter.get('/course/video', userAuth, (req, res) => {
  try {
    const baseUrl = `${process.env.AWS_CLOUDFRONT_DOMAIN}/Test.mp4`;
    const keyPairId = process.env.AWS_CLOUDFRONT_KEY_PAIR_ID;
    const privateKeyPath = './private_key.pem';

    const signedUrl = generateSignedUrl(baseUrl, keyPairId, privateKeyPath, 300);
    res.json({ signedUrl });
  } catch(err) {
    return res.status(500).json({ msg: err.message })
  }
});

module.exports = courseRouter