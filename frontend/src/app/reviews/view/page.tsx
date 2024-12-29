'use client';

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Employee, getEmployees, getReview, Review, updateReview } from "@/components/api";

interface Option {
  value: string;
  text: string;
  username: string;
  selected: boolean;
  element?: HTMLElement;
}

interface FeedbackOption {
  id: string;
  username: string;
  email: string;
  content: string;
}

const ViewReviewPage = () => {
  const router = useRouter();

  const reviewerId = 'participants';

  const searchParams = useSearchParams(); // Get query params

  const reviewId = searchParams.get("id") || ''; // Extract `id` parameter

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetEmployee: "",
    participants: [] as string[], // Reviewer IDs
    feedbacks: []
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks submission status
  const [error, setError] = useState(""); // Tracks any error during submission
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false); // Whether an option is selected
  const [show, setShow] = useState(false);

  const dropdownRef = useRef<any>(null);
  const trigger = useRef<any>(null);
  const reviewersRef = useRef<Option[]>([]);
  const feedbacksRef = useRef<FeedbackOption[]>([]);
  const selectedReviewersRef = useRef<{ id: string, email: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees first
        const employees = await getEmployees();
        setEmployees(employees);
        reviewersRef.current = employees.map((reviewer) => ({
          value: reviewer._id || '',
          text: reviewer.email,
          username: reviewer.username,
          selected: false,
        }));
        // Then fetch review and pre-select reviewers
        const review = await getReview(reviewId);
        const reviewerInfo = employees.find((employee) => employee._id === review.targetEmployee);
        setFormData((prev) => ({
          ...prev,
          title: review.title,
          description: review.description,
          targetEmployee: `${reviewerInfo?.username} (${reviewerInfo?.role})`,
          participants: review.participants,
        }));
  
        // Pre-select participants
        review.participants.forEach((participantId) => {
          const reviewer = reviewersRef.current.find((i) => i.value === participantId);
          if (reviewer) reviewer.selected = true; // Mark reviewer as selected
        });
  
        selectedReviewersRef.current = review.participants.map((participantId) => {
          const reviewer = reviewersRef.current.find((i) => i.value === participantId);
          return { id: reviewer?.value || '', email: reviewer?.text || '' };
        });

        feedbacksRef.current = review?.feedbacks?.map((feedback) => {
          const reviewer = reviewersRef.current.find((i) => i.value === feedback.participant);
          return {
            id: reviewer?.value || '',
            username: reviewer?.username || '',
            email: reviewer?.text || '',
            content: feedback.content,
          };
        })?.sort((a, b) => {
          if (a.email === userInfo.email) return -1;
          if (b.email === userInfo.email) return 1;
          return 0;
        }) || [];
  
        setFormData((prev) => ({
          ...prev,
          participants: selectedReviewersRef.current.map((i) => i.id),
        }));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
  
    fetchData();
  }, []);
  
  const selectedValues = () => {
    return selectedReviewersRef.current.map((i) => i.email);
  };

  // handle reviewer
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (
        !show ||
        dropdownRef.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setShow(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true);
    setError(""); // Clear any previous error

    try {
      await updateReview(reviewId, formData); // Call API to update an review
      router.push("/reviews"); // Redirect to review list upon success
    } catch (err) {
      console.error("Error updating review:", err);
      setError("Failed to update review. Please try again."); // Set error message
    } finally {
      setIsSubmitting(false); // Reset submission status
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="View Review" />
      <div className="flex flex-col gap-10">
        {/* Review Form */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              {/* Title Field */}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-transparent disabled:text-black dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  disabled
                />
              </div>

              {/* Description Field */}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-transparent disabled:text-black dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  disabled
                />
              </div>

              {/* Reviewee Field */}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Reviewee
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.targetEmployee}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-transparent disabled:text-black dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  disabled
                />
              </div>

              {/* Reviewer Field */}
              <div className="relative z-50">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Reviewers
                </label>
                <div>
                <select
                    id={reviewerId}
                    className="hidden"
                    name="participants"
                    multiple
                  >
                    {reviewersRef.current.map((reviewer) => (
                      <option key={reviewer.value} value={reviewer.text}>
                        {reviewer.text}
                      </option>
                    ))}
                  </select>

                  <div className="flex flex-col items-center">
                    <input name="values" type="hidden" defaultValue={selectedValues()} />
                    <div className="relative z-20 inline-block w-full">
                      <div className="relative flex flex-col items-center">
                        <div ref={trigger} className="w-full">
                          <div className="mb-2 flex rounded border border-stroke py-2 pl-3 pr-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input">
                            <div className="flex flex-auto flex-wrap gap-3">
                              {selectedReviewersRef.current.map(({ id, email }) => (
                                <div
                                  key={id}
                                  className="my-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30"
                                >
                                  <div className="max-w-full flex-initial">
                                    {email}
                                  </div>
                                </div>
                              ))}
                              {selectedReviewersRef.current.length === 0 && (
                                <div className="flex-1">
                                  <input
                                    className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                                    defaultValue={selectedValues()}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedback Field */}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Feedbacks
                </label>
                <div className="relative bg-slate-50 rounded-xl overflow-auto">
                  {feedbacksRef.current.map((feedback, index) => (
                      <div key={index} className="px-4 sm:px-0 mt-1.5 mb-2.5">
                        <div className="grid gap-4 mx-auto max-w-xl bg-white shadow-xl p-8 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                          <h3 className="text-balance text-l dark:text-white font-semibold text-slate-900">{`${feedback.username} (${feedback.email})`}</h3>
                          <p className="text-sm/6">{feedback.content}</p>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={() => router.push(`/reviews`)}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
              >
                Return
              </button>

              {/* Error Message */}
              {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ViewReviewPage;
