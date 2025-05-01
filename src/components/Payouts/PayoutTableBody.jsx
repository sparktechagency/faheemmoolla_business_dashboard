const PayoutTableBody = ({ item }) => {

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    // Check if it's already a formatted string with commas
    if (typeof dateString === 'string' && dateString.includes(",")) {
      return dateString;
    }

    // Parse the date and format it
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("en-GB", {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Table Row */}
      <div className="grid items-center grid-cols-5 gap-2 px-2 my-3 text-sm bg-gray-100 rounded-lg whitespace-nowrap mx-2">

        <div className="flex items-center justify-center py-3">{formatDate(item.updatedAt)}</div>
        <div className="flex items-center justify-center py-3">{item.payoutBalance}</div>
        <div className="flex items-center justify-center py-3">{formatDate(item.approvedDate)}</div>
        <div className="flex items-center justify-center py-3">{formatDate(item.rejectDate)}</div>
        <div className="flex items-center justify-center py-3">{item.payoutId}</div>
      </div>
    </>
  );
};

export default PayoutTableBody;
