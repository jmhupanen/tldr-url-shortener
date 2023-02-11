import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apicache from 'apicache';
import { google } from 'googleapis';
import Url from '../models/Url.mjs';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CUSTOM_KEYWORDS = JSON.parse(process.env.CUSTOM_KEYWORDS);

const router = express.Router();
const cache = apicache.middleware;

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});


const getCustomRoute = (id) => {
  let route = null;
  CUSTOM_KEYWORDS.youtube.keywords.map(keyword => {
    if (keyword.name === id) {
      route = keyword;
    }
  });
  return route;
};


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Redirect if ID exists
router.get('/:id', cache('10 minutes'), async (req, res, next) => {
  const id = req.params.id;
  const customRoute = getCustomRoute(id);
  let foundUrl;

  if (customRoute) {
    // Predefined IDs
    try {
      const response = await youtube.search.list({
        part: 'id',
        channelId: customRoute.channelId,
        order: 'date',
        maxResults: 1
      });
      const videoId = response.data.items[0].id.videoId;
      res.redirect(`https://www.youtube.com/watch?v=${videoId}`);
    } catch (err) {
      next(err);
    }
  } else if (foundUrl = await Url.findOne({ id: id })) {
    // User-created IDs
    foundUrl && res.redirect(foundUrl.url);
  } else {
    res.redirect('/');
  }
});

export default router;