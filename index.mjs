import express from 'express';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { google } from 'googleapis';
import apicache from 'apicache';
import { nanoid } from 'nanoid';

const app = express();

dotenv.config();

const customKeywords = JSON.parse(
  await readFile(
    new URL('./custom-keywords.json', import.meta.url)
  )
);

let cache = apicache.middleware;
app.use(cache('10 minutes'));

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});


app.get('/', (req, res) => {
  res.send('Welcome to TLDR - the greatest ever URL shortener!');
});

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
