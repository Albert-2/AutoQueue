import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserRegistration = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { queueID } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if name and contact are provided
    if (!name || !contact) {
      setMessage("Please fill in all the fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${queueID}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            contact,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `Registration successful! Your position is ${data.position}.`
        );
        setName("");
        setContact("");
        setTimeout(() => {
          navigate(`/api/queues/info/${queueID}`);
        }, 5000);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("Failed to register. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Register for Queue
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="contact"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-semibold text-lg"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center font-bold text-lg text-green-500">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserRegistration;
