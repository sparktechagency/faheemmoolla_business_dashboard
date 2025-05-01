import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomLoading from "../../components/CustomLoading";
import SingleShop from "../../components/shop/SingleShop";
import { useProfileQuery } from "../../features/profile/profileApi";
import { useAllShopQuery } from "../../features/shop/shopApi";
import { useCreateStripeMutation } from "../../features/stripe/stripeApi";
import { useYocoverifyMutation } from "../../features/wallet/walletApi";

const ShopManagement = () => {
  const route = useNavigate();
  const { data, isLoading, refetch } = useAllShopQuery();
  const {
    data: user,
    isLoading: userLoading,
    refetch: userRefetch,
  } = useProfileQuery();
  const [modalOpen, setModalOpen] = useState(false);
  const [createStripe, { isLoading: stripeLoading }] =
    useCreateStripeMutation();

  const handleStripeConnect = async () => {
    try {
      await createStripe().unwrap();
      setModalOpen(true);
    } catch (error) {
      console.error("Stripe account creation failed:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="mt-10">
        <div className="flex items-center justify-end mb-6">
          {user?.data?.yocoAccountStatus && user?.data?.yocoAccountStatus ? (
            <Link
              to="./create-new-shop"
              className="px-16 py-2 font-semibold text-white rounded-md bg-primary"
            >
              Create New Shop
            </Link>
          ) : (
            <button
              onClick={handleStripeConnect}
              className="flex items-center justify-center gap-2 px-16 py-2 font-semibold text-white rounded-md bg-primary"
              disabled={stripeLoading}
            >
              <span
                onClick={() => {
                  setModalOpen(true);
                  handleStripeConnect();
                }}
                className="min-w-[200px] text-center"
              >
                Yoco Payment Gateway
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {isLoading ? (
          <div className="flex items-center justify-center col-span-4">
            <CustomLoading />
          </div>
        ) : data?.data?.shops?.length === 0 ? (
          <div className="col-span-4 text-xl text-center text-gray-500">
            No shops available at the moment.
          </div>
        ) : (
          data?.data?.shops?.map((foodShop, index) => (
            <SingleShop key={index} shop={foodShop} Loading={isLoading} />
          ))
        )}
      </div>

      {/* Modal for Yoco Account Connection */}
      {modalOpen && (
        <ModalYoco onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

const ModalYoco = ({ onClose }) => {
  const [yocoAccountNumber, setYocoAccountNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [yocoverify] = useYocoverifyMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(yocoAccountNumber)

    try {
      const reponse = await yocoverify({ yocoMerchantAcc: yocoAccountNumber }).unwrap();
      console.log(reponse);
      setIsSubmitted(true);

      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isSubmitted ? "Success!" : "Add Yoco Merchant Account"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="text-green-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xl font-medium text-gray-800">
              Yoco merchant account successfully added!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="yocoAccount" className="block text-sm font-medium text-gray-700 mb-1">
                Yoco Merchant Account Number
              </label>
              <input
                type="text"
                id="yocoAccount"
                value={yocoAccountNumber}
                onChange={(e) => setYocoAccountNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#C68C4E] focus:border-[#C68C4E] outline-none transition"
                placeholder="Please enter your YocoMerchantAcc number"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#C68C4E] text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#C68C4E] focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ShopManagement;
