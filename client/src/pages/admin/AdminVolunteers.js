import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await axios.get('https://pawtect-fyp-production.up.railway.app/api/admin/volunteers', {
          withCredentials: true,
        });
        setVolunteers(res.data);
      } catch (err) {
        setError('Failed to fetch volunteer data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://pawtect-fyp-production.up.railway.app/api/admin/volunteers/${id}`);
      setVolunteers(prev => prev.filter(v => v._id !== id)); // Remove from local state
    } catch (err) {
      console.error('Error deleting volunteer:', err);
    }
  };

  return (
    <div className="p-6"
    style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/images/dashboard.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100%',
    }}
    >
      <h1 className="text-center">Volunteer CV Submissions</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border m-5">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">CV</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{vol.name}</td>
                  <td className="px-4 py-2 border">{vol.email}</td>
                  <td className="px-4 py-2 border">{vol.phone}</td>
                  <td className="px-4 py-2 border">
                    <a
                      href={`https://pawtect-fyp-production.up.railway.app/uploads/${vol.cvPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View CV
                    </a>
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDelete(vol._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminVolunteers;
