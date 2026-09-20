import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('Hello, World!');
});

router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello from the API!' });
});

router.post('/api/chat', chatController.sendMessage); // Use the chatController for handling chat requests

router.get('/api/products/:id/reviews', reviewController.getReviews);

router.get('/api/products/:id/summarize', reviewController.summarizeReviews);

export default router;
