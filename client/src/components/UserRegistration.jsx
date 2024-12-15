import React, { useState } from "react";

const UserRegistration = ({ queueId }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/queues/${queueId}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, contact }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register user");
      }

      const data = await response.json();
      setSuccess(`Registration successful! Your position is ${data.position}.`);
      setError(null);
      setName("");
      setContact("");
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <form onSubmit={handleRegister} className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Register for Queue</h2>
      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-2">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Contact</label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Register
      </button>
    </form>
  );
};

export default UserRegistration;
