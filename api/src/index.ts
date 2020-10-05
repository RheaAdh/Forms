import path from 'path';
require('dotenv').config({ path: path.join('.env') });


import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import router  from './routes' ;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port: Number = 4000;

app.use('/api', router);

app.listen(port, () => console.log(`Listening on port ${port}`));