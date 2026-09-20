import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';
import template from '../llm/prompts/summarize-reviews.txt';

export const reviewService = {
   async summarizeReviews(productId: number): Promise<String> {
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary) {
         return existingSummary;
      }

      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');
      const prompt = template.replace('{{reviews}}', joinedReviews);

      const { text: summary } = await llmClient.generateText({
         model: 'gpt-4.1-mini',
         input: prompt,
         temperature: 0.2,
         maxToken: 500,
      });

      await reviewRepository.storeReviewSummary(productId, summary);

      return summary;
   },
};
