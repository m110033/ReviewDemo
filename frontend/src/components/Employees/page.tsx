'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { getEmployees, deleteEmployee, checkAndRefreshToken, Employee } from "../api";
import { useRouter } from "next/navigation";

const CreateEmployeePage: React.FC = () => {
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);

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
      console.error("Error deleting employee:", error);
    }
  };

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
