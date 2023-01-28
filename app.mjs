import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import apicache from 'apicache';

import connectDB from './config/db.mjs';
import shortenerRouter from './routes/shortener.mjs';

const app = express();

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const customKeywords = JSON.parse(process.env.CUSTOM_KEYWORDS);

let cache = apicache.middleware;
app.use(cache('10 minutes'));

app.set('trust proxy', true);
app.use(express.json());

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use('/api', shortenerRouter);

app.get('/*', async (req, res, next) => {
  let customRoute;
  customKeywords.youtube.keywords.map(keyword => {
    if(req.path === `/${keyword.name}`) {
      customRoute = keyword;
    }
  });

  if (customRoute) {
    try {
      const response = await youtube.search.list({
        part: 'id',
        channelId: customRoute.channelId,
        order: 'date',
        maxResults: 1
      });
      const id = response.data.items[0].id.videoId;
      res.redirect(`https://www.youtube.com/watch?v=${id}`);
    } catch (err) {
      next(err);
    }
  } else {
    res.redirect('/');
  }
});

// Server Setup
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
