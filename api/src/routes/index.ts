import express, {Response, Request} from 'express';
import {helloWorld, dbTesting,} from './helloworld';
import {addForm} from './addform';
const router = express.Router();
router.get('/helloworld', helloWorld);
router.get('/db', dbTesting);
router.post('/addform',addForm);
export default router;

