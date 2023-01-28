import express from 'express';
import got from 'got';
import Url from '../models/Url.mjs';
import { nanoid } from 'nanoid';

const IP_LOCATION_API_URL = 'http://ip-api.com/json';

const router = express.Router();

const validateUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url;
  } catch (err) {
    return null;
  }
};

const getOrigin = async (originIp) => {
  let ip = originIp;
  if (ip.substr(0, 7) == '::ffff:') {
    ip = ip.substr(7);
  }

  try {
		const res = await got
			.get(`${IP_LOCATION_API_URL}/${ip}`)
			.json();
    if (res.status === 'success') {
      return res.city;
    } else {
      return 'Unknown';
    }
	} catch (err) {
		console.log(err);
    return 'Unknown';
	}
};

router.post('/shorten', async (req, res) => {
  const { origUrl } = req.body;
  const url = validateUrl(origUrl);

  if (url) {
    try {
      // TODO: Check if already exists

      console.log(req.ip);
      const origin = await getOrigin(req.ip);
      const newUrl = new Url({
        id: nanoid(5),
        url: url,
        origin: origin
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