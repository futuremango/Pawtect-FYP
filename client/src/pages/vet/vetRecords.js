import React, { useEffect, useState } from "react";

const VetRecords = () => {
  const [appointments, setAppointments] = useState([]); // All appointments
  const [filteredAppointments, setFilteredAppointments] = useState([]); // Displayed appointments
  const [searchQuery, setSearchQuery] = useState(""); // Search input

  // Fetch appointments and filter for today
  useEffect(() => {
    fetch("http://localhost:5000/api/appointments")
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        // Filter for today's appointments
        const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const todayAppointments = data.filter((a) => a.date === today);
        setFilteredAppointments(todayAppointments);
      })
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      // Show today's appointments if search is cleared
      const today = new Date().toISOString().split("T")[0];
      setFilteredAppointments(appointments.filter((a) => a.date === today));
    } else {
      // Search through all appointments
      const filtered = appointments.filter(
        (a) =>
          a.petName.toLowerCase().includes(query) ||
          a.ownerName.toLowerCase().includes(query) ||
          a.email.toLowerCase().includes(query) ||
          a.reason.toLowerCase().includes(query)
      );
      setFilteredAppointments(filtered);
    }
  };

  return (
    <div
      className="p-4"
      style={{
        backgroundImage: `url('/images/dashboard.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <h1 className="text-center mb-4">Vet Appointments</h1>
      <div className="search-container shadow rounded-pill border-primary p-2 m-5">
        <input
          type="text"
          placeholder="Search by pet, owner, or reason..."
          value={searchQuery}
          onChange={handleSearch}
          className="form-control rounded-pill border-primary"
          />
      </div>
      <table className="w-full border border-collapse mx-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Pet Name</th>
            <th className="border p-2">Owner Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Reason</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((a, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border p-2">{a.petName}</td>
              <td className="border p-2">{a.ownerName}</td>
              <td className="border p-2">{a.email}</td>
              <td className="border p-2">{a.date}</td>
              <td className="border p-2">{a.time}</td>
              <td className="border p-2">{a.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VetRecords;