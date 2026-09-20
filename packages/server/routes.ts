import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { prisma } from './lib/prisma';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('Hello, World!');
});

router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello from the API!' });
});

router.post('/api/chat', chatController.sendMessage); // Use the chatController for handling chat requests

router.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
   const productId = Number(req.params.id);

   if (isNaN(productId)) {
      return res.status(400).send('Invalid Product Id.');
   }

   const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
   });

   /* if (!reviews.length) {
      return res
         .status(404)
         .send(`No reviews found for product ID ${productId}.`);
   } */

   res.json(reviews);
});

export default router;
