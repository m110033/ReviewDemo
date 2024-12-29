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

const UpdateReviewPage = () => {
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
        
        setFormData((prev) => ({
          ...prev,
          title: review.title,
          description: review.description,
          targetEmployee: review.targetEmployee,
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
  
  const open = () => {
    setShow(true);
  };

  const isOpen = () => {
    return show === true;
  };

  const select = (id: string) => {
    const item = reviewersRef.current.find((i) => i.value === id);
    if (!item) return;

    let newSelectedReviewers = selectedReviewersRef.current;
    if (!item.selected) {
      item.selected = true;
      newSelectedReviewers = [...selectedReviewersRef.current, { id: item.value, email: item.text }];
    } else {
      item.selected = false;
      newSelectedReviewers = selectedReviewersRef.current.filter((i) => i.id !== id);
    }

    selectedReviewersRef.current = newSelectedReviewers;

    setFormData((prev) => ({
      ...prev,
      participants: newSelectedReviewers.map((i) => i.id),
    }));
  };
  
  const remove = (id: string) => {
    const item = reviewersRef.current.find((i) => i.value === id);
    if (!item) return;
    item.selected = false;
    selectedReviewersRef.current = selectedReviewersRef.current.filter((i) => i.id !== id);
    setFormData((prev) => ({
      ...prev,
      participants: selectedReviewersRef.current.map((i) => i.id),
    }));
  };
  
  const selectedValues = () => {
    return selectedReviewersRef.current.map((i) => i.email);
  };

  // Handles changes to input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Update form data state
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'targetEmployee') {
      setIsOptionSelected(true);
    }
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
      <Breadcrumb pageName="Edit Review" />
      <div className="flex flex-col gap-10">
        {/* Review Form */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Review Form</h3>
          </div>
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
                  onChange={handleInputChange}
                  placeholder="Enter your title"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
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
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Reviewee  Dropdown */}
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Reviewee
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    name="targetEmployee"
                    value={formData.targetEmployee}
                    onChange={handleInputChange}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                      isOptionSelected ? "text-black dark:text-white" : ""
                    }`}
                    required
                  >
                    <option value="" disabled>
                      Select reviewee
                    </option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.username} ({employee.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reviewer Dropdown */}
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
                        <div ref={trigger} onClick={open} className="w-full">
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
                                  <div className="flex flex-auto flex-row-reverse">
                                    <div
                                      onClick={() => remove(id)}
                                      className="cursor-pointer pl-2 hover:text-danger"
                                    >
                                      <svg
                                        className="fill-current"
                                        role="button"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                                          fill="currentColor"
                                        ></path>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {selectedReviewersRef.current.length === 0 && (
                                <div className="flex-1">
                                  <input
                                    placeholder="Select an option"
                                    className="h-full w-full appearance-none bg-transparent p-1 px-2 outline-none"
                                    defaultValue={selectedValues()}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="flex w-8 items-center py-1 pl-1 pr-1">
                              <button
                                type="button"
                                onClick={open}
                                className="h-6 w-6 cursor-pointer outline-none focus:outline-none"
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.8">
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                      fill="#637381"
                                    ></path>
                                  </g>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="w-full px-4">
                          <div
                            className={`max-h-select absolute left-0 top-full z-40 w-full overflow-y-auto rounded bg-white shadow dark:bg-form-input ${
                              isOpen() ? "" : "hidden"
                            }`}
                            ref={dropdownRef}
                            onFocus={() => setShow(true)}
                            onBlur={() => setShow(false)}
                          >
                            <div className="flex w-full flex-col">
                              {reviewersRef.current.map((option, index) => (
                                <div key={index}>
                                  <div
                                    className="w-full cursor-pointer rounded-t border-b border-stroke hover:bg-primary/5 dark:border-form-strokedark"
                                    onClick={(event) => select(option.value)}
                                  >
                                    <div
                                      className={`relative flex w-full items-center border-l-2 border-transparent p-2 pl-2 ${
                                        option.selected ? "border-primary" : ""
                                      }`}
                                    >
                                      <div className="flex w-full items-center">
                                        <div className="mx-2 leading-6">
                                          {option.text}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
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
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
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

export default UpdateReviewPage;
