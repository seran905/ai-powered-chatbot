import OpenAI from 'openai';
import type { Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },
   async summarizeReviews(productId: number): Promise<String> {
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');
      const prompt = `
      Summarize the following customer reviews into a short paragraph highlighting key themes, both positive and negative:
      
      ${joinedReviews}
      `;

      const response = await openaiClient.responses.create({
         model: 'gpt-4.1-mini',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 500,
      });

      return response.output_text;
   },
};

const openaiClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY || '',
});
