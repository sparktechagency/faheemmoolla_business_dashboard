import { useNavigate } from "react-router-dom";
import { offer01 } from "../../assets/assets";
import HeaderProfile from "../../components/HeaderProfile";

const singleView = {
  shopName: "Andres Felipe",
  itemName: "Burger",
  itemCategory: "Burger",
  offerTitle: "Demo Title",
  offerType: "Flat Discount",
  discountPrice: 20,
  startDate: "31-01-2025",
  endDate: "02-02-2025",
  status: "Running",
  des: "Offer Description",
};

const ViewDetails = () => {
  const navigate = useNavigate();
  const {
    shopName,
    itemName,
    itemCategory,
    offerTitle,
    offerType,
    discountPrice,
    startDate,
    endDate,
    status,
    des,
  } = singleView;

  return (
    <div className="w-full space-y-20">
      <div className="flex items-center justify-end">
        <HeaderProfile />
      </div>
      <div>
        <div className="w-full max-w-[500px] mx-auto rounded-xl overflow-hidden bg-textSecondary">
          <img src={offer01} alt="offer 01" className="w-full" />
          <div className="w-[90%] mx-auto border border-primary my-4 p-3 rounded-lg">
            <p>Shop Name: {shopName}</p>
            <p>Item Name : {itemName}</p>
            <p>Item Category : {itemCategory}</p>
            <p>Offer Title : {offerTitle}</p>
            <p>Offer Type: {offerType}</p>
            <p>Discount Price : ${discountPrice}</p>
            <p>Start Date : {startDate}</p>
            <p>End Date : {endDate}</p>
            <p>Status : {status}</p>
          </div>
          <div className="w-[90%] min-h-[100px] mx-auto border border-primary my-4 p-3 rounded-lg">
            {des}
          </div>
          <div className="w-[90%] mx-auto flex justify-end pb-5">
            <button
              onClick={() => navigate("/offer")}
              className="px-10 py-2 rounded-lg bg-primary text-surfacePrimary"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
