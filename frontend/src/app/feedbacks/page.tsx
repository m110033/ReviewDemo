import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableEmployees from "@/components/Employees/page";

export const metadata: Metadata = {
    title:
      "Performance Reviews",
    description: "Design a web application that allows employees to submit feedback toward each other's performance review.",
  };

const FeedbackPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Feedback" />
      <div className="flex flex-col gap-10">
        <TableEmployees />
      </div>
    </DefaultLayout>
  );
};

export default FeedbackPage;
