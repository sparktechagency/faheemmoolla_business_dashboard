import React, { useMemo } from "react";
import TableRow from "../components/TableRow";

const Table = ({ columns, data = [], location }) => {
  // Define grid classes based on location
  const gridClass = useMemo(() => {
    const baseGrid =
      "grid border-2 px-3 text-start border-opacity-50 rounded-lg bg-surfacePrimary border-primary";
    const locationGrids = {
      "/order": "grid-cols-10",
      "/offer": "grid-cols-11",
      "/earning": "grid-cols-10",
    };
    return `${baseGrid} ${locationGrids[location] || "grid-cols-10"}`;
  }, [location]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1200px] w-full bg-transparent rounded-lg shadow-md space-y-3">
        {/* Header section */}
        <div className={gridClass}>
          {columns.map((column, index) => {
            const columnClass = useMemo(() => {
              const columnStyles = {
                Category: "-ml-1",
                "Offer Type": "-ml-1",
                "Start Date": location === "/order" ? "-ml-2.5" : "-ml-0",
                "End Date": location === "/order" ? "-ml-2.5" : "-ml-0",
                Price: location === "/order" ? "flex justify-center -ml-1" : "",
                "Order Number":
                  location === "/order" ? "flex justify-center -ml-[90px]" : "",
                "User Name":
                  location === "/order"
                    ? "flex justify-center -ml-[130px]"
                    : "",
                Location:
                  location === "/order" ? "flex justify-center -ml-[90px]" : "",
                "Item & Qty":
                  location === "/order"
                    ? "flex justify-center -ml-[150px]"
                    : "",
                Offer:
                  location === "/order"
                    ? "flex justify-center -ml-[150px]"
                    : "",
                Status: location === "/order" ? "flex justify-center" : "",
                Action:
                  location === "/offer"
                    ? "text-center ml-[80px]"
                    : location === "/earning"
                    ? "text-center ml-[35px]"
                    : "",
              };
              return columnStyles[column] || "";
            }, [column, location]);

            return (
              <div
                key={index}
                className={`py-3 text-start pl-3 ${columnClass}`}
              >
                {column}
              </div>
            );
          })}
        </div>

        {/* Body section */}
        <div className="border-2 border-opacity-50 rounded-lg bg-surfacePrimary border-primary">
          {data.length === 0 ? (
            <h3 className="py-10 text-center">No Data Available</h3>
          ) : (
            data.map((item, i) => (
              <TableRow key={i} location={location} list={i} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Table;