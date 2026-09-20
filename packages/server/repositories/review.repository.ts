import dayjs from 'dayjs';
import type { Review } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';

export const reviewRepository = {
   getReviews(productId: number, limit?: number): Promise<Review[]> {
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },

   storeReviewSummary(productId: number, summary: string) {
      const now = new Date();
      const expiresAt = dayjs().add(7, 'days').toDate();

      const summaryData = {
         content: summary,
         expiresAt,
         generatedAt: now,
         productId,
      };

      return prisma.summary.upsert({
         where: { productId },
         create: summaryData,
         update: summaryData,
      });
   },
};
