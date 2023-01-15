import express from 'express';
import Url from '../models/Url.mjs';
import { nanoid } from 'nanoid';

const router = express.Router();

function validateUrl(urlString) {
  try {
    const url = new URL(urlString);
    return url;
  } catch (err) {
    return null;
  }
};

router.post('/shorten', async (req, res) => {
  const { origUrl } = req.body;
  const url = validateUrl(origUrl);
  
  console.log(origUrl)
  console.log(url)

  if (url) {
    try {
      // TODO: Check if already exists

      const newUrl = new Url({
        id: nanoid(5),
        url: url,
        origin: 'New York'
      });
      await newUrl.save();
      console.log('New URL saved');
      res.json(url);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  } else {
    res.status(400).json('Provided URL is invalid');
  }
});

export default router;