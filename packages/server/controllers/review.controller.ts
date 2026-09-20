import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         return res.status(400).send('Invalid Product Id.');
      }

      const reviews = await reviewService.getReviews(productId);

      res.json(reviews);
   },
   async summarizeReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         return res.status(400).send('Invalid Product Id.');
      }

      const summary = await reviewService.summarizeReviews(productId);
      console.log(summary);

      res.send({ summary });
   },
};
