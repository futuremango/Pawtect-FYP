import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminSurrenders = () => {
  const [surrenders, setSurrenders] = useState([]);

  useEffect(() => {
    const fetchSurrenderedPets = async () => {
      try {
        const res = await axios.get('https://pawtect-fyp-production.up.railway.app/api/admin/surrenders');
        setSurrenders(res.data);
      } catch (error) {
        console.error('Error fetching surrendered pets:', error);
      }
    };
    fetchSurrenderedPets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://pawtect-fyp-production.up.railway.app/api/admin/surrenders/${id}`);
      setSurrenders(prev => prev.filter(s => s._id !== id)); // Optimistic update
    } catch (err) {
      console.error('Error deleting surrender request:', err);
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
      <h1 className="text-center">Surrendered Pets</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Submitted By</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Pet Name</th>
            <th className="border px-4 py-2">Pet Type</th>
            <th className="border px-4 py-2">Pet Age</th>
            <th className="border px-4 py-2">Reason</th>
          </tr>
        </thead>
        <tbody>
          {surrenders.map((pet, index) => (
            <tr key={index} className="border-t">
              <td className="border px-4 py-2">{pet.name}</td>
              <td className="border px-4 py-2">{pet.email}</td>
              <td className="border px-4 py-2">{pet.phone}</td>
              <td className="border px-4 py-2">{pet.petName}</td>
              <td className="border px-4 py-2">{pet.petType}</td>
              <td className="border px-4 py-2">{pet.petAge}</td>
              <td className="border px-4 py-2">{pet.reason}</td>
              <td>
              <button onClick={() => handleDelete(pet._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete
              </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSurrenders;
