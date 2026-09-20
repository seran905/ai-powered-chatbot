import type { Review } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },
};
