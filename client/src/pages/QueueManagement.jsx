import React from "react";
import QueueForm from "../components/QueueForm";

const QueueManagement = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md w-full">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Create Queue
      </h1>
      <QueueForm />
    </div>
  </div>
);

export default QueueManagement;
