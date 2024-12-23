import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const QueueDetails = () => {
  const [queue, setQueue] = useState(null);
  const [error, setError] = useState(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [showDeleteField, setShowDeleteField] = useState(false);
  const { queueID } = useParams();
  const navigate = useNavigate();

  const fetchQueueDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/queues/info/${queueID}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch queue details");
      }
      const data = await response.json();
      setQueue(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteQueue = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/queues/del/${queueID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminEmail }),
        }
      );

      if (response.ok) {
        alert("Queue deleted successfully.");
        navigate("/");
      } else {
        throw new Error("Failed to delete queue.");
      }
    } catch (error) {
      alert("Error deleting queue: " + error.message);
    }
  };

  const handleDeleteUser = async (userID) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_DOMAIN
        }/api/queues/${queueID}/user/${userID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("User deleted successfully.");
        fetchQueueDetails();
      } else {
        throw new Error("Failed to delete user.");
      }
    } catch (error) {
      alert("Error deleting user: " + error.message);
    }
  };

  useEffect(() => {
    fetchQueueDetails();
  }, [queueID]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Queue Details
          </h2>
          <button
            className="text-gray-500 hover:text-red-600"
            onClick={() => setShowDeleteField(!showDeleteField)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m7 0H6"
              />
            </svg>
          </button>
        </div>

        {showDeleteField && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter Admin Email to Delete Queue
            </label>
            <div className="flex sm:flex-row flex-col items-center gap-2 mt-2">
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Admin Email"
                required
              />
              <button
                onClick={handleDeleteQueue}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 sm:w-2/5 w-full"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {queue ? (
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-blue-600">{queue.name}</h3>
              <p className="text-gray-600">Location: {queue.location}</p>
              <p className="text-gray-600">
                Max Capacity: {queue.maxCapacity || "N/A"}
              </p>
              <p className="text-gray-600">
                Users in Queue: {queue.users.length}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Users in Queue
              </h4>
              {queue.users.length > 0 ? (
                <ul className="space-y-2 max-h-80 overflow-y-auto">
                  {queue.users.map((user) => (
                    <li
                      key={user._id}
                      className="p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 flex justify-between"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-gray-600">
                          Current position: {user.position}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-gray-500 hover:text-red-600"
                        aria-label="Delete user"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m7 0H6"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No users in the queue yet.</p>
              )}
            </div>
            <div className="mt-6">
              <Link to={`/api/users/${queueID}/register`}>
                <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:text-lg font-semibold">
                  Participate in the Queue
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading queue details...</p>
        )}
      </div>
    </div>
  );
};

export default QueueDetails;
