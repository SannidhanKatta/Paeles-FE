import React from "react";

const FailedTransactionPage = () => {
  const tickStyle = {
    animation: 'tick 0.5s ease-in-out forwards',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <img src="/wrong-icon.svg" alt="payment failed" className="w-[100px]" />
        <h1 className="text-2xl font-bold text-red-900">
          Transaction Unsuccessful!
        </h1>
        <p className="mt-4 text-gray-600 text-center">
          Your payment Processing has been Failed, Please Try again . If the money deducted from your bank Please contact   {" "}
          
            <a href="mailto:buyatpaeless.com" className="text-blue-500">
            buyatpaeless.com
            </a>

        </p>
      </div>
    </div>
  );
};

export default FailedTransactionPage;
