'use client';

import { useState, useEffect } from "react";
import { checkAndRefreshToken, Employee, getInfo } from "../api";

const Header = () => {
  const [employee, setEmployee] = useState<Employee>();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        await checkAndRefreshToken(); // Check token before making API calls
        const response = await getInfo();
        setEmployee(response);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    }

    fetchEmployee();
  }, []);
  

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-end px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
        </div>
        <div className="flex items-end gap-3 2xsm:gap-7">
          <ul className="flex items-end gap-2 2xsm:gap-4">
          {/* <!-- User Area --> */}
          <span className="flex items-end gap-4">
            <span className="hidden text-right lg:block">
              <span className="block text-sm font-medium text-black dark:text-white">
                {employee?.email}
              </span>
              <span className="block text-xs">{employee?.username}</span>
            </span>
          </span>
          {/* <!-- User Area --> */}
          </ul>
      </div>
      </div>
    </header>
  );
};

export default Header;
