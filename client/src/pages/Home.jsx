import React from "react";
import QueueList from "../components/QueueList";

const Home = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md w-full">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Queue Automation
      </h1>
      <QueueList />
    </div>
  </div>
);

export default Home;
