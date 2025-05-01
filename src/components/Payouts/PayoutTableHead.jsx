import { Alert, Pagination, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWalletPayoutsQuery } from "../../features/wallet/walletApi";
import PayoutTableBody from "./PayoutTableBody";

const PayoutTableHead = ({ columns }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Get page from URL or use default
  const pageParam = queryParams.get("page");
  const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam, 10) : 1);

  // Get search term from URL
  const searchValue = queryParams.get("search") || "";

  // Enhanced query with error handling
  const {
    data: allPayoutData,
    isLoading,
    isError,
    error
  } = useWalletPayoutsQuery({
    searchTerm: searchValue,
    page: currentPage
  });

  // Update URL when page changes
  useEffect(() => {
    // Sync URL with current page state
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("page", currentPage.toString());
    navigate({ search: newSearchParams.toString() }, { replace: true });
  }, [currentPage, location.search, navigate]);

  // Improved page change handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate total items for pagination
  const totalItems = allPayoutData?.pagination?.total || 0;
  const pageSize = allPayoutData?.pagination?.limit || 10;

  return (
    <div className="space-y-4">
      <div className="min-w-[1200px] w-full bg-transparent rounded-lg space-y-3">
        {/* Header */}
        <div className="grid grid-cols-5 text-center border-2 border-opacity-50 rounded-lg bg-surfacePrimary px-2 border-SurfacePrimary">
          {columns.map((column, index) => (
            <div key={index} className="py-3 font-semibold text-center">
              {column}
            </div>
          ))}
        </div>

        {/* Table Body with enhanced loading and error states */}
        <div className="border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-SurfacePrimary">
          {isLoading ? (
            <div className="py-10 text-center">
              <Spin size="large" tip="Loading payouts..." />
            </div>
          ) : isError ? (
            <Alert
              message="Error Loading Data"
              description={error?.data?.message || "Failed to load payout data"}
              type="error"
              showIcon
              className="m-4"
            />
          ) : allPayoutData?.data?.length > 0 ? (
            allPayoutData.data.map((item, index) => (
              <PayoutTableBody item={item} key={`payout-${index}`} />
            ))
          ) : (
            <h3 className="py-10 text-center">
              {searchValue ? "No matching records found" : "No data available"}
            </h3>
          )}
        </div>

        {/* Pagination - only show if we have data */}
        {totalItems > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="ant-pagination-custom"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutTableHead;
