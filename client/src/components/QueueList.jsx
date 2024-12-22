import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const QueueList = () => {
  const [queues, setQueues] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_DOMAIN}/api/queues`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch queues");
        }
        const data = await response.json();
        setQueues(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchQueues();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Queues</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2">
        {queues.map((queue) => (
          <Link to={`/api/queues/info/${queue._id}`} key={queue._id}>
            <li className="p-2 border rounded">
              <h3 className="text-lg font-semibold">{queue.name}</h3>
              <p>Location: {queue.location}</p>
              <p>Max Capacity: {queue.maxCapacity}</p>
              <p>Current Queue length : {queue.users.length}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default QueueList;
