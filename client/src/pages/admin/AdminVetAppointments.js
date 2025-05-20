import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminVetAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchVetAppointments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/vetappointments');
        setAppointments(res.data);
      } catch (error) {
        console.error('Error fetching vet appointments:', error);
      }
    };
    fetchVetAppointments();
  }, []);

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
      <h1 className="text-center">Vet Appointments</h1>
      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Pet Name</th>
            <th className="border px-4 py-2">Owner Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Time</th>
            <th className="border px-4 py-2">Reason</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment, index) => (
            <tr key={index} className="border-t">
              <td className="border px-4 py-2">{appointment.petName}</td>
              <td className="border px-4 py-2">{appointment.ownerName}</td>
              <td className="border px-4 py-2">{appointment.email}</td>
              <td className="border px-4 py-2">{appointment.date}</td>
              <td className="border px-4 py-2">{appointment.time}</td>
              <td className="border px-4 py-2">{appointment.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminVetAppointments;
