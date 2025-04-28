import express, { RequestHandler } from 'express';
import { getPickList } from '../controllers/pickListController';

const router = express.Router();

router.get('/', getPickList as RequestHandler);

export default router;
