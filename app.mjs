import express from 'express';
import connectDB from './config/db.mjs';
import shortenRouter from './routes/shorten.mjs';
import indexRouter from './routes/index.mjs';

const app = express();

app.set('trust proxy', true);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.use('/api', shortenRouter);
app.use(express.static('public'));
app.use('/', indexRouter);

// Server setup
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running at PORT: ${PORT}`);
});
