import axios from 'axios';

export type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

export type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

export type SummarizeResponse = {
   summary: string;
};

export const reviewsApi = {
   async summarizeReviews(productId: number) {
      return await axios
         .post<SummarizeResponse>(`/api/products/${productId}/summarize`)
         .then((res) => res.data);
   },

   async fetchReviews(productId: number) {
      return await axios
         .get<GetReviewsResponse>(`/api/products/${productId}/reviews`)
         .then((res) => res.data);
   },
};
