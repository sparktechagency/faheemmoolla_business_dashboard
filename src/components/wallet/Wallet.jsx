import { Button, message, Modal, Spin } from 'antd';
import React, { useState } from 'react';
import { useRequestPayoutMutation, useWalletBalanceQuery } from '../../features/wallet/walletApi';

const Wallet = () => {
  const { data, isLoading, error } = useWalletBalanceQuery();
  const [requestPayout, { isLoading: payoutLoading }] = useRequestPayoutMutation();

  const [isModalVisible, setIsModalVisible] = useState(false); // State for controlling modal visibility
  const [amountToWithdraw, setAmountToWithdraw] = useState(null); // State to store the amount to withdraw

  // Function to handle withdrawal action
  const handleWithdraw = async () => {
    try {
      const response = await requestPayout().unwrap();
      message.success(response?.message);
      console.log(response);
    } catch (error) {
      message.error(error?.data?.message || "An error occurred while processing the withdrawal.");
    }
  };

  // Show the confirmation modal and set the amount
  const showModal = () => {
    setAmountToWithdraw(data?.data?.availableBalance); // Set the amount to withdraw
    setIsModalVisible(true);
  };

  // Handle the confirmation modal (Yes/No)
  const handleOk = () => {
    setIsModalVisible(false);
    handleWithdraw(); // Proceed with the withdrawal after confirmation
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal without performing the withdrawal
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="default" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-8 bg-gradient-to-r from-[#C68C4E] to-[#703d07] shadow-xl rounded-3xl">
      <h2 className="text-3xl font-bold text-white text-center mb-6">ManeageYour Wallet</h2>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="space-y-6">
          <div className="flex justify-between text-lg text-gray-700">
            <span className="font-medium">Pending Amount:</span>
            <span className="font-semibold text-red-600">R {data?.data?.pendingBalance}</span>
          </div>
          <div className="flex justify-between text-lg text-gray-700">
            <span className="font-medium">Withdrawable Amount:</span>
            <span className="font-semibold text-green-600">R {data?.data?.availableBalance}</span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={showModal} // Trigger the modal on click
            disabled={payoutLoading || !data?.data?.availableBalance}
            className={`px-8 py-3 ${payoutLoading || !data?.data?.availableBalance ? 'bg-gray-400' : 'bg-[#C68C4E]'} text-white font-semibold rounded-lg shadow-md hover:bg-[#703d07] transition transform hover:scale-105 cursor-pointer`}
          >
            {payoutLoading ? (
              <Spin size="small" className="text-white mr-2" />
            ) : (
              'Request Withdraw'
            )}
          </button>
          {error && (
            <p className="text-red-600 text-center mt-4">There was an error loading your balance, please try again.</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        title={<div style={{ textAlign: 'center' }}>Confirm Withdrawal</div>}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
        confirmLoading={payoutLoading}
        width={400}
        bodyStyle={{ textAlign: 'center' }}
        footer={[
          <div style={{ textAlign: 'center' }}>
            <Button
              key="back"
              onClick={handleCancel} style={{ marginRight: 8 }} >
              No
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={payoutLoading}
              onClick={handleOk}
              style={{ backgroundColor: '#C68C4E', borderColor: '#C68C4E' }}
            >
              Yes
            </Button>
          </div>
        ]}
      >
        <p>Are you sure you want to withdraw R {amountToWithdraw}?</p>
      </Modal>
    </div>
  );
};

export default Wallet;
