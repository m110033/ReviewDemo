'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const EmployeePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Employee Dashboard</h1>
      {/* Employee-specific content */}
    </div>
  );
};

export default EmployeePage;
