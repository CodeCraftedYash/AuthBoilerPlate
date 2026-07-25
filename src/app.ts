import express, { urlencoded } from 'express';
import router from './routes/rootRoute';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieparser from 'cookie-parser';
import { env } from './config/env';
import { logger } from './config/logger';
import { pinoHttp } from 'pino-http';
import { notFound } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json()); // parses string to json objects
app.use(urlencoded({extended:true})); //parses url encoded body gotten from html form to objects
app.use(helmet()); //group of smaller middlewares that add security
app.use(cors({
    origin:env.CLIENT_URL,
    credentials: true,
})); // helps with cross origin error
app.use(compression()); // compresses the response size to save bandwidth usage 
app.use(cookieparser()); //without this req.cookie results in undefined, it parses cookie to objects
app.use(pinoHttp({logger})); // logs out 

app.use("/api",router); //root router

app.use(notFound); //handles unkown endpoints
app.use(errorHandler); //global error class
export default app;

