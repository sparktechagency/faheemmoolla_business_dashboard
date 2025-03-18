import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAllShopQuery } from "../../features/shop/shopApi";
import { useProfileQuery } from "../../features/profile/profileApi";
import {
  useCreateStripeMutation,
  useOnboardingMutation,
  useVerifyAccauntMutation,
} from "../../features/stripe/stripeApi";
import Loading from "../../components/Loading";
import { message, notification, Spin } from "antd";
import SingleShop from "../../components/shop/SingleShop";
import CustomLoading from "../../components/CustomLoading";

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
  const [onboarding, { isLoading: onboardingLoading }] =
    useOnboardingMutation();


  const [verifyAccaunt, { isLoading: verifyAccauntLoading }] =
    useVerifyAccauntMutation();

    

  const handleStripeConnect = async () => {
    try {
      await createStripe().unwrap();
      setModalOpen(true);
    } catch (error) {
      console.error("Stripe account creation failed:", error);
    }
  };

  const handleOnboarding = async () => {
    try {
      const res = await onboarding().unwrap();
      console.log(res?.data);
      if (res?.success) {
        const url = res?.data?.startsWith("http")
          ? res.data
          : `https://${res.data}`;
        userRefetch();
        window.open(url, "_blank"); // Open in a new tab
      }
    } catch (error) {
      console.error("Onboarding failed:", error);
    }
  };

  const handleVerified = async () => {
    try {
      const res = await verifyAccaunt().unwrap();
      if (res.data) {
        window.location.reload();
      } else {
        message.error(`${res.message}, please click Go To Stripe Button`);
      }
    } catch (error) {
      console.error("Onboarding failed:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="mt-10">
      <div className="flex items-center justify-end mb-6">
          {user?.data?.stripeAccountId && user?.data?.stripeAccountStatus ? (
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
                Connect Stripe Account
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

      {/* Modal for Stripe Account Connection */}
      {modalOpen && (
        <ModalStripe onClose={() => setModalOpen(false)}>
          <h2 className="mb-4 text-xl font-semibold text-center">
            Connect Stripe Account
          </h2>
          {userLoading ? (
            <div className="flex items-center justify-center h-24">
              <Spin />
            </div>
          ) : onboardingLoading || stripeLoading || verifyAccauntLoading ? (
            <div className="flex items-center justify-center h-24">
              <Spin />
            </div>
          ) : (
            <>
              <button
                onClick={handleOnboarding}
                className="w-full py-2 mt-4 text-white bg-orange-600 rounded-md"
              >
                Go to Stripe
              </button>
              <button
                onClick={handleVerified}
                className="w-full py-2 mt-4 text-white bg-green-600 rounded-md"
              >
                Verify-Account
              </button>
            </>
          )}
        </ModalStripe>
      )}
    </div>
  );
};

const ModalStripe = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-6 bg-white rounded-lg w-96">
        <button
          onClick={onClose}
          className="absolute text-gray-500 top-2 right-2"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};

export default ShopManagement;
