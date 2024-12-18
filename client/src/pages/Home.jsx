import React from "react";
import QueueList from "../components/QueueList";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-2 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white sm:p-8 p-2 rounded-lg shadow-md w-full">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Queue Automation
      </h1>
      <QueueList />
      <div className="mt-6 flex justify-center">
        <Link to="/api/queues">
          <button className="p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 inline-block mx-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Queue
          </button>
        </Link>
      </div>
    </div>
  </div>
);

export default Home;
