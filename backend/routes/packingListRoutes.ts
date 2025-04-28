import express, { RequestHandler } from 'express';
import { getPackingList } from '../controllers/packingListController';

const router = express.Router();

router.get('/', getPackingList as RequestHandler);

export default router;
