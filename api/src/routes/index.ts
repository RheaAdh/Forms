import express, {Response, Request} from 'express';
import {helloWorld, dbTesting} from './helloworld';
import {addForm} from './addform';
import {deleteForm} from './deleteform';
import{addQuestion} from './addquestion';
import{deleteQuestion} from './deletequestion';
// import{addOption} from './';
// import {addResponse} from './';

const router = express.Router();

router.get('/helloworld', helloWorld);
router.get('/db', dbTesting);
router.post('/addform',addForm);
router.delete('/deleteform/:form_id',deleteForm);
router.post('/addquestion',addQuestion);
router.delete('/deletequestion/:q_id',deleteQuestion);
// router.post('/addoption',addOption);
// router.post('/addresponse',addResponse);

export default router;

