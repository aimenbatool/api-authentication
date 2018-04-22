import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import userRoute from './routes/user';
import mongoose from 'mongoose';

const app = express();
mongoose.connect('mongodb://localhost/yourOwnDB');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());


// Routes
app.use('/users', userRoute);

const port = process.env.PORT || 3000;
app.listen(port , () =>  console.log(`Listening at port ${port}`));

export default app;
