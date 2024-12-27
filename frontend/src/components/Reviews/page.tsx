'use client'

import { useState, useEffect } from "react";
import { getReviews, deleteReview, Review } from "../api";

const TableReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewList = await getReviews(); // getReviews 会自动检查 token
        setReviews(reviewList);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Delete review
  const handleDelete = async (id: number) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((review) => review._id !== id));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Title
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Description
              </th>
              <th className="min-w-[300px] px-4 py-4 font-medium text-black dark:text-white">
                Reviewee
              </th>
              {/* <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                Reviewers
              </th> */}
              <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {review.title}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{review.description}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{review.targetEmployee.username}</p>
                </td>
                {/* <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {review.participants.map((participant, index) => (
                    <p key={index} className="text-black dark:text-white">
                      {participant}
                    </p>
                  ))}
                </td> */}
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button
                      onClick={() => alert(`Edit review: ${review._id}`)}
                      className="hover:text-primary"
                    >
                      Feedback
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="hover:text-primary"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableReviews;
