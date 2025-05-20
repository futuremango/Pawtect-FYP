import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminRescues = () => {
  const [rescues, setRescues] = useState([]);

  useEffect(() => {
    const fetchRescueRequests = async () => {
      try {
        const res = await axios.get('https://pawtect-fyp-production.up.railway.app/api/admin/rescues');
        setRescues(res.data);
      } catch (error) {
        console.error('Error fetching rescue requests:', error);
      }
    };
    fetchRescueRequests();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://pawtect-fyp-production.up.railway.app/api/admin/rescues/${id}`);
      setRescues(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error deleting rescue request:', err);
    }
  };
  

  return (
    <div className="p-4"
    style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/images/dashboard.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100%',
    }}
    >
      <h1 className="text-center">Rescue Requests</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Animal Type</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {rescues.map((rescue, index) => (
            <tr key={index} className="border-t">
              <td className="border px-4 py-2">{rescue.name}</td>
              <td className="border px-4 py-2">{rescue.phone}</td>
              <td className="border px-4 py-2">{rescue.location}</td>
              <td className="border px-4 py-2">{rescue.animalType}</td>
              <td className="border px-4 py-2">{rescue.description}</td>
              <td className="border px-4 py-2">{new Date(rescue.createdAt).toLocaleString()}</td>
              <td className="border px-4 py-2">
              <button
                onClick={() => handleDelete(rescue._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"> Delete
              </button>
            </td>
            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRescues;
