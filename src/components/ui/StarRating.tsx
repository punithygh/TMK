import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string; // For the container
  starClassName?: string; // Additional classes for the stars
}

export const StarRating = ({ rating, size = 16, className = "flex gap-0.5", starClassName = "" }: StarRatingProps) => {
  const parsedRating = Number(rating) || 0;

  return (
    <div className={className}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = star <= parsedRating;
        const isHalf = !isFull && star - 0.5 <= parsedRating;

        if (isHalf) {
          return (
            <div key={star} className={`relative text-amber-500 ${starClassName}`} style={{ width: size, height: size }}>
              <Star size={size} className="fill-slate-200 text-slate-200 dark:fill-slate-800 dark:text-slate-800 absolute top-0 left-0" />
              <StarHalf size={size} className="fill-amber-500 absolute top-0 left-0" />
            </div>
          );
        }

        return (
          <Star
            key={star}
            size={size}
            className={`${isFull ? "fill-amber-500 text-amber-500" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"} ${starClassName}`}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
