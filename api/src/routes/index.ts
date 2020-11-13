import express, {Response, Request} from 'express';
import {helloWorld, dbTesting} from './helloworld';
import {deleteForm,addForm,viewForm} from './form';
import{addQuestion,deleteQuestion,viewQuestion} from './question';
import {addResponse,deleteResponse,viewResponse} from './response';

const router = express.Router();
router.get('/helloworld', helloWorld);
router.get('/db', dbTesting);

router.post('/addform',addForm);
router.delete('/deleteform/:form_id',deleteForm);

router.post('/addquestion',addQuestion);
router.delete('/deletequestion/:q_id',deleteQuestion);

router.post('/addresponse',addResponse);
router.delete('/deleteresponse/:answer_id',deleteResponse);

router.get('/viewform/:form_id',viewForm);
router.get('/viewform/:form_id',viewQuestion);
router.get('/viewform/:form_id',viewResponse);

export default router;

