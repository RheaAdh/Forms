import express, {Response, Request} from 'express';
import {helloWorld, dbTesting} from './helloworld';

const router = express.Router();
router.get('/helloworld', helloWorld);
router.get('/db', dbTesting);

export default router;

