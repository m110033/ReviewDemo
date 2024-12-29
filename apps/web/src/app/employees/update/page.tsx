'use client';

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkAndRefreshToken, Employee, getEmployee, getEmployees, updateEmployee } from "@/components/api";

const EditEmployeePage = () => {
  const router = useRouter();

  const searchParams = useSearchParams(); // Get query params

  const employeeId = searchParams.get("id") || ''; // Extract `id` parameter

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const [employee, setEmployee] = useState<Employee>();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks submission status
  const [error, setError] = useState(""); // Tracks any error during submission

  // State for role dropdown styling
  const [selectedOption, setSelectedOption] = useState<string>(""); // Selected role value
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false); // Whether an option is selected

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        await checkAndRefreshToken(); // Check token before making API calls
        const response = await getEmployee(employeeId);

        setFormData((prev) => ({
          ...prev,
          email: response.email,
          username: response.username,
          role: response.role,
        }));

        setEmployee(response);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployee();
  }, []);
  
  // Handles changes to input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Update form data state
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Special handling for role selection to change text color
    if (name === "role") {
      setSelectedOption(value);
      setIsOptionSelected(true);
    }
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true);
    setError(""); // Clear any previous error

    try {
      if (employee) {
        await updateEmployee(employee._id, formData); // Call API to update an employee
      }
      router.push("/employees"); // Redirect to employee list upon success
    } catch (err) {
      console.error("Error creating employee:", err);
      setError("Failed to create employee. Please try again."); // Set error message
    } finally {
      setIsSubmitting(false); // Reset submission status
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Edit Employee" />
      <div className="flex flex-col gap-10">
        {/* Employee Form */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Employee Form</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              {/* Email Field */}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  defaultValue={employee?.email}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Username Field */}
              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  defaultValue={employee?.username}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* Role Dropdown */}
              {userInfo?.role === "admin" && (
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Role
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${
                      isOptionSelected ? "text-black dark:text-white" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    <option value="admin">Admin</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
              </div>
              )}

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

export default EditEmployeePage;
