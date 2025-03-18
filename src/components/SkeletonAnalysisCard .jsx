import { Skeleton } from "antd";

const DashboardSkeleton = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Skeleton */}
      

      {/* Main Content */}
      <div className="flex-1 ">
        {/* Top Navbar */}
        

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
              <Skeleton.Input active className="w-1/2 h-6 mb-2" />
              <Skeleton.Input active className="w-full h-16" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="p-4 mt-6 bg-white rounded-lg shadow-md">
          <Skeleton.Input active className="w-1/3 h-6 mb-4" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex justify-between py-2 border-b">
              <Skeleton.Input active className="w-1/4 h-5" />
              <Skeleton.Input active className="w-1/4 h-5" />
              <Skeleton.Input active className="w-1/4 h-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
