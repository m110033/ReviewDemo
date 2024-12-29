import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableReviews from "@/components/Reviews/page";

export const metadata: Metadata = {
    title:
      "Performance Reviews",
    description: "Design a web application that allows employees to submit feedback toward each other's performance review.",
  };

const ReviewPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Review" />
      <div className="flex flex-col gap-10">
        <TableReviews />
      </div>
    </DefaultLayout>
  );
};

export default ReviewPage;
