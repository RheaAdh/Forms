import express, {Response, Request} from 'express';
import {helloWorld, dbTesting} from './helloworld';
import {deleteForm,addForm} from './form';
import{addQuestion,deleteQuestion} from './question';
import {addResponse,deleteResponse} from './response';

const router = express.Router();
router.get('/helloworld', helloWorld);
router.get('/db', dbTesting);

router.post('/addform',addForm);
router.delete('/deleteform/:form_id',deleteForm);

router.post('/addquestion',addQuestion);
router.delete('/deletequestion/:q_id',deleteQuestion);

router.post('/addresponse',addResponse);
router.delete('/deleteresponse/:answer_id',deleteResponse);

export default router;

