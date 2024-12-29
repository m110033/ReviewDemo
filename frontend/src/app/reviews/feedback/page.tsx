'use client';

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createFeedback, getReview } from "@/components/api";

const CreateFeedbackPage = () => {
  const router = useRouter();

  const searchParams = useSearchParams(); // Get query params

  const reviewId = searchParams.get("id") || ''; // Extract `id` parameter

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    feedback: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks submission status
  const [error, setError] = useState(""); // Tracks any error during submission
  const [isFeedbackExist, setIsFeedbackExist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const review = await getReview(reviewId);
        const feedback = review?.feedbacks?.find((feedback) => feedback.reviewId ===  reviewId && feedback.participant === userInfo._id);
        if (feedback) setIsFeedbackExist(true);
        setFormData((prev) => ({
          ...prev,
          title: review.title,
          feedback: feedback?.content || '',
        }));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
  
    fetchData();
  }, []);
  
  // Handles changes to input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Update form data state
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true);
    setError(""); // Clear any previous error

    try {
      const data = { reviewId: reviewId, content: formData.feedback, };
      await createFeedback(reviewId, data); // Call API to update an review
      router.push("/reviews"); // Redirect to review list upon success
    } catch (err) {
      console.error("Error updating feedback:", err);
      setError("Failed to create feedback. Please try again."); // Set error message
    } finally {
      setIsSubmitting(false); // Reset submission status
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Create Feedback" />
      <div className="flex flex-col gap-10">
        {/* Feedback Form */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Feedback Form</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              {/* Title Field */}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Title {!isFeedbackExist && <span className="text-meta-1">*</span>}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  disabled={isFeedbackExist}
                  required
                />
              </div>

              {/* Feedback Field */}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Feedback {!isFeedbackExist && <span className="text-meta-1">*</span>}
                </label>
                <div className="relative bg-slate-50 rounded-xl overflow-auto">
                  <textarea
                    name="feedback"
                    value={formData.feedback}
                    className="w-full rounded border-[1.5px] border-stroke bg-white px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-slate-800 dark:text-white dark:focus:border-primary"
                    onChange={handleInputChange}
                    placeholder="Enter your feedback"
                    disabled={isFeedbackExist}
                  />
                </div>
              </div>

              {/* Submit Button */}
              {!isFeedbackExist && (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}

              {/* Error Message */}
              {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateFeedbackPage;
