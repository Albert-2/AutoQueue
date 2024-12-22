import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const QueueForm = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(30);
  const [timePerPerson, setTimePerPerson] = useState(5);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sendVerificationCode = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/queues/verifyCode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: adminName, adminEmail }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send verification code");
      }

      setSuccess("Verification code sent to your email");
      setError(null);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name,
      location,
      maxCapacity,
      timePerPerson,
      adminName,
      adminEmail,
      verificationCode,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/queues/newQueue`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create queue");
      }

      const result = await response.json();
      setSuccess(result.message);
      setError(null);
      setName("");
      setLocation("");
      setMaxCapacity(30);
      setTimePerPerson(5);
      setAdminName("");
      setAdminEmail("");
      setVerificationCode("");

      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Queue Details</h2>
      {success && <p className="text-green-500 text-sm">{success}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Admin Name
        </label>
        <input
          type="text"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Admin Email
        </label>
        <input
          type="email"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
          required
        />
      </div>
      <div className="flex sm:flex-row flex-col sm:items-end gap-2 justify-end w-full">
        <div className="sm:w-4/5">
          <label className="block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter verification code"
          />
        </div>
        <button
          type="button"
          onClick={sendVerificationCode}
          className="sm:w-2/5 bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Send Verification Code
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter queue name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter queue location"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Max Capacity
        </label>
        <input
          type="number"
          value={maxCapacity}
          onChange={(e) => setMaxCapacity(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Default is 30"
          min={0}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Time Per Person (mins)
        </label>
        <input
          type="number"
          value={timePerPerson}
          onChange={(e) => setTimePerPerson(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Default is 5 minutes"
          min={0}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Create Queue
      </button>
    </form>
  );
};

export default QueueForm;
