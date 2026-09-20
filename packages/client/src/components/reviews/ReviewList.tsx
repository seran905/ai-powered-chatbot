import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { HiSparkles } from 'react-icons/hi';
import StarRating from './starRating';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useState } from 'react';
import ReviewSkeleton from './ReviewSkeleton';
type props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

type SummarizeResponse = {
   summary: string;
};

const ReviewList = ({ productId }: props) => {
   const [summary, setSummary] = useState('');
   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
   const {
      data: reviewData,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: [productId],
      queryFn: () => fetchReviews(),
   });

   const handleSummarize = async () => {
      setIsSummaryLoading(true);
      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/summarize`
      );
      setSummary(data.summary);
      setIsSummaryLoading(false);
   };

   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <p className="text-red-500">Could not fetch the reviews. Try again!</p>
      );
   }

   if (!reviewData?.reviews.length) {
      return null;
   }

   const currentSummary = reviewData.summary || summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={handleSummarize}
                     className="cursor-pointer"
                     disabled={isSummaryLoading}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {isSummaryLoading && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewData?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating value={review.rating} />
                  </div>
                  <div className="py-2">{review.content}</div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
