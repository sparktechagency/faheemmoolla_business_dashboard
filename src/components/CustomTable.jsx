const Table = ({ columns, data, renderRow }) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full bg-white rounded-lg shadow-md">
        {/* Table Header */}
        <div className="grid grid-cols-10 py-3 font-semibold text-gray-700 bg-gray-100 border-b border-gray-300">
          {columns.map((col, index) => (
            <div key={index} className="px-4 text-center">
              {col}
            </div>
          ))}
        </div>
        {/* Table Body */}
        <div className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <div className="col-span-10 py-4 text-center text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;
