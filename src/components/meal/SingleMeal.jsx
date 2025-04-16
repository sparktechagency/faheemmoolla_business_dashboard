import { useState } from "react";
import { Link } from "react-router-dom";
import { message, Spin } from "antd";
import {
  useDeleteMealMutation,
  useUpdateMealStatusMutation,
} from "../../features/meal/mealApi";
import { baseURL } from "../../utils/BaseURL";
import Loading from "../Loading";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const SingleMeal = ({ items }) => {
  const [mealStatus, setMealStatus] = useState(items.mealStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteMeal, { isLoading: mealDeleteLoading }] =
    useDeleteMealMutation();
  const [updateMealStatus, { isLoading: mealStatusLoading }] =
    useUpdateMealStatusMutation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [direction, setDirection] = useState(0);

  const handleModalToggle = (state) => {
    setIsModalVisible(state);
  };

  const handleAction = async (type, id) => {
    setIsLoading(true);
    try {
      if (type === "delete") {
        await deleteMeal(id).unwrap();
        window.location.reload();
        message.success("Meal deleted successfully.");
      } else if (type === "off") {
        const response = await updateMealStatus({
          id,
          data: { mealStatus: !items?.mealStatus },
        }).unwrap();
        if (response.success) {
          setMealStatus((prev) => !prev);
          message.success(
            `Meal ${items?.mealStatus ? "disabled" : "enabled"} successfully.`
          );
        }
      }
    } catch (error) {
      message.error(
        `Error ${type === "delete" ? "deleting" : "updating"} meal.`
      );
    }
    setIsLoading(false);
    handleModalToggle(false);
  };

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % items.image.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) =>
      prev === 0 ? items.image.length - 1 : prev - 1
    );
  };

  const imageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    }),
  };

  return (
    <div className="relative w-full border border-gray-200 shadow max-w-[360px] h-[600px] bg-white rounded-xl overflow-hidden flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Spin />
        </div>
      )}

      <div className="h-[250px] overflow-hidden cursor-pointer" onClick={() => handleModalToggle(true)}>
        <img
          src={`${baseURL}/${items?.image}`}
          className="w-full h-full object-cover"
          alt="Meal"
        />
      </div>

      <div className="px-5 flex-grow flex flex-col">
        <div className="py-4 text-[12px] font-semibold text-gray-700 space-y-1">
          <h3 className="text-xl text-gray-800 truncate">{items?.name}</h3>
          <p>Category: <span className="truncate">{items?.category}</span></p>
          <p>Price: ${items?.price}</p>
          <p>Collection Time: {items?.collectionTime}</p>
          <p>Dietary Preference: <span className="truncate">{items?.dietaryPreference}</span></p>
        </div>
        
        <div className="flex-grow overflow-hidden mb-4">
          <textarea
            readOnly
            placeholder="Description"
            className="border border-primary w-full p-2 h-[120px] rounded-xl focus:outline-none resize-none"
            defaultValue={items?.description}
          />
        </div>
        
        <div className="flex px-3 py-3 mt-auto text-sm justify-evenly">
          <button
            onClick={() => handleAction("off", items?._id)}
            className={`px-4 py-1 font-semibold text-gray-700 border ${
              mealStatus ? "border-gray-700 opacity-50" : "border-[#00721E]"
            } rounded-md`}
            disabled={mealStatusLoading || isLoading}
          >
            {mealStatus ? "Turn On" : "Turn Off"}
          </button>

          <button
            onClick={() => handleAction("delete", items?._id)}
            className="px-4 py-1 font-semibold text-gray-700 border border-red-400 rounded-md"
            disabled={mealDeleteLoading || isLoading}
          >
            Delete Meal
          </button>

          <Link
            to={`./edit-meal/${items?._id}`}
            className="px-4 py-1 font-semibold text-gray-700 border rounded-md border-primary"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Image Modal with Carousel */}
      <AnimatePresence>
        {isModalVisible && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleModalToggle(false)}
          >
            <motion.div
              className="relative bg-white p-6 rounded-xl shadow-lg w-[480px] flex flex-col items-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute text-2xl font-bold text-gray-700 transition top-3 right-3 hover:text-red-500"
                onClick={() => handleModalToggle(false)}
              >
                &times;
              </button>

              {/* Image Carousel */}
              <div className="relative flex items-center">
                {/* Previous Button */}
                <motion.button
                  onClick={prevImage}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className="absolute left-0 z-10 p-2 text-white rounded-full shadow-md cursor-pointer"
                >
                  <FaArrowLeft />
                </motion.button>

                {/* Animated Image */}
                <motion.img
                  key={currentImageIndex}
                  src={`${baseURL}/${Array.isArray(items.image) ? items.image[currentImageIndex] : items.image}`}
                  alt="Meal"
                  className="object-cover rounded-lg shadow-lg w-96 h-60"
                  variants={imageVariants}
                  custom={direction}
                  initial="enter"
                  animate="center"
                  exit="exit"
                />

                {/* Next Button */}
                <motion.button
                  onClick={nextImage}
                  className="absolute right-0 z-10 p-2 text-white rounded-full shadow-md cursor-pointer"
                >
                  <FaArrowRight />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SingleMeal;