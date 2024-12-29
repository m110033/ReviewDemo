'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { getEmployees, deleteEmployee, checkAndRefreshToken, Employee } from "../api";
import { useRouter } from "next/navigation";

const CreateEmployeePage: React.FC = () => {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [error, setError] = useState<string | null>(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        await checkAndRefreshToken(); // Check token before making API calls
        const response = await getEmployees();
        setEmployees(response);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Delete employee
  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((employee) =>employee._id !== id));
    } catch (error) {
      const msg = (error as any).response?.data?.message || "An error occurred. Please try again.";
      console.error("Error deleting employee:", msg);
      setError("Failed to delete employee. error: " + msg);
    }
  };

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      setError(null);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {userInfo.role === "admin" && (
        <div className="flex justify-end py-2">
        <Link
          href="/employees/create"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-6"
        >
          Create
        </Link>
      </div>
      )}

      {/* 錯誤視窗 */}
      {error && (
        <div className="flex justify-center py-2 mb-4.5">
          <div className="flex w-9/12 border-l-6 border-[#F87171] bg-[#F87171] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
            <div className="mr-5 flex h-9 w-9/12 max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                  fill="#ffffff"
                  stroke="#ffffff"
                ></path>
              </svg>
            </div>
            <div className="w-full">
              <h5 className="mb-3 font-semibold text-[#B45454]">
                Request Exception
              </h5>
              <ul>
                <li className="leading-relaxed text-[#CD5D5D]">
                  {error}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Email
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Username
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Role
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {employee.email}
                  </h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{employee.username}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{employee.role}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button
                      onClick={() => router.push(`/employees/view?id=${employee._id}`)}
                      className="hover:text-primary"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/employees/update?id=${employee._id}`)}
                      className="hover:text-primary"
                    >
                      Edit
                    </button>
                    {userInfo.role === "admin" && userInfo.email !== employee.email && (
                      <button
                        onClick={() => handleDelete(employee._id)}
                        className="hover:text-primary"
                      >
                        Delete
                      </button>
                    )}
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

export default CreateEmployeePage;
