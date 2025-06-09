import { useEffect, useState } from 'react';
import { useBankDetailsQuery, useYocoverifyMutation } from "../features/wallet/walletApi";

const BankInfoCard = ({ bankData, onEdit }) => {
  return (
    <div className="bg-gradient-to-br flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md transform transition-all hover:scale-[1.02] hover:shadow-2xl">
        {/* Card Header */}
        <div className="bg-gradient-to-r bg-primary p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
            Bank Account Details
          </h2>
          <p className="text-indigo-100 mt-1">Your secure banking information</p>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Account Holder */}
          <div className="flex items-start">
            <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Account Holder</h3>
              <p className="text-gray-900 font-semibold text-lg">{bankData.bankHolderName}</p>
            </div>
          </div>

          {/* Bank Name */}
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Bank Name</h3>
              <p className="text-gray-900 font-semibold text-lg">{bankData.bankName}</p>
            </div>
          </div>

          {/* Branch */}
          <div className="flex items-start">
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Branch</h3>
              <p className="text-gray-900 font-semibold text-lg">{bankData.bankBranch}</p>
            </div>
          </div>

          {/* Account Number */}
          <div className="flex items-start">
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Account Number</h3>
              <p className="text-gray-900 font-semibold text-lg">{bankData.yocoMerchantAcc}</p>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end items-center">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-primary text-white rounded-lg transition-colors text-sm font-medium hover:bg-primary-dark"
          >
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

const EditBankForm = ({ bankData, onCancel, onSubmit, isEditing }) => {
  const [formData, setFormData] = useState({
    bankHolderName: bankData.bankHolderName || '',
    yocoMerchantAcc: bankData.yocoMerchantAcc || '',
    bankName: bankData.bankName || '',
    bankBranch: bankData.bankBranch || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset isSubmitted when the form is opened for editing
  useEffect(() => {
    if (isEditing) {
      setIsSubmitted(false);
    }
  }, [isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md transform transition-all">
        {/* Card Header */}
        <div className="bg-gradient-to-r bg-primary p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Bank Details
          </h2>
          <p className="text-indigo-100 mt-1">Update your banking information</p>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="text-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Details Updated Successfully!</h3>
              <p className="text-gray-600 mt-2">Your bank information has been updated.</p>
              <button
                onClick={onCancel}
                className="mt-6 px-4 py-2 bg-primary text-white rounded-lg transition-colors text-sm font-medium hover:bg-primary-dark"
              >
                Back to Details
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="bankHolderName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="bankHolderName"
                  name="bankHolderName"
                  value={formData.bankHolderName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#C68C4E] focus:border-[#C68C4E] outline-none transition"
                  placeholder="Please enter your Bank holder name"
                  required
                />
              </div>

              <div>
                <label htmlFor="yocoMerchantAcc" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="number"
                  id="yocoMerchantAcc"
                  name="yocoMerchantAcc"
                  value={formData.yocoMerchantAcc}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#C68C4E] focus:border-[#C68C4E] outline-none transition"
                  placeholder="Please enter your bank account number"
                  required
                />
              </div>

              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#C68C4E] focus:border-[#C68C4E] outline-none transition"
                  placeholder="Please enter your bank name"
                  required
                />
              </div>

              <div>
                <label htmlFor="bankBranch" className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Name
                </label>
                <input
                  type="text"
                  id="bankBranch"
                  name="bankBranch"
                  value={formData.bankBranch}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#C68C4E] focus:border-[#C68C4E] outline-none transition"
                  placeholder="Please enter your branch name"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#C68C4E] text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#C68C4E] focus:ring-offset-2 disabled:opacity-50 hover:bg-[#B87D3E]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : "Update"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const BankDetailsView = () => {
  const { data, isLoading, refetch } = useBankDetailsQuery();
  const [yocoverify] = useYocoverifyMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [animation, setAnimation] = useState('');

  const bankData = data?.data || {
    bankHolderName: '',
    yocoMerchantAcc: '',
    bankName: '',
    bankBranch: ''
  };

  const handleEdit = () => {
    setAnimation('slide-out');
    setTimeout(() => {
      setIsEditing(true);
      setAnimation('slide-in');
    }, 300);
  };

  const handleCancel = () => {
    setAnimation('slide-out');
    setTimeout(() => {
      setIsEditing(false);
      setAnimation('slide-in');
    }, 300);
  };

  const handleSubmit = async (formData) => {
    try {
      await yocoverify(formData).unwrap();
      await refetch();
      setAnimation('');
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-[600px] mt-10">
      <div className={`transition-all duration-300 ${isEditing ? `translate-x-[-100%] ${animation}` : `translate-x-0 ${animation}`}`}>
        <BankInfoCard bankData={bankData} onEdit={handleEdit} />
      </div>
      <div className={`absolute top-0 w-full transition-all duration-300 ${isEditing ? `translate-x-0 ${animation}` : `translate-x-[100%] ${animation}`}`}>
        <EditBankForm bankData={bankData} onCancel={handleCancel} onSubmit={handleSubmit} isEditing={isEditing} />
      </div>
    </div>
  );
};

export default BankDetailsView;