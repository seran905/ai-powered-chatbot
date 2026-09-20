import { HiSparkles } from 'react-icons/hi';
import StarRating from './starRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import ReviewSkeleton from './ReviewSkeleton';
import {
   reviewsApi,
   type GetReviewsResponse,
   type SummarizeResponse,
} from './ReviewsApi';
type props = {
   productId: number;
};

const ReviewList = ({ productId }: props) => {
   const summarizeMutation = useMutation<SummarizeResponse>({
      mutationFn: () => reviewsApi.summarizeReviews(productId),
   });

   const reviewsQuery = useQuery<GetReviewsResponse>({
      queryKey: [productId],
      queryFn: () => reviewsApi.fetchReviews(productId),
   });

   if (reviewsQuery.isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }

   if (reviewsQuery.isError) {
      return (
         <p className="text-red-500">Could not fetch the reviews. Try again!</p>
      );
   }

   if (!reviewsQuery.data?.reviews.length) {
      return null;
   }

   const currentSummary =
      reviewsQuery.data.summary || summarizeMutation.data?.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => summarizeMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summarizeMutation.isPending}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {summarizeMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summarizeMutation.isError && (
                     <p className="text-red-500">
                        Could not summarize reviews. Try again
                     </p>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsQuery.data?.reviews.map((review) => (
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
