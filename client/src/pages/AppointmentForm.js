import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
 
const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    petName: '',     ownerName: '',    email: '',    date: '',    time: '',    reason: '',
  });

  const [appointments, setAppointments] = useState([]); // All booked appointments
  const [selectedDate, setSelectedDate] = useState(null); // Date selected on calendar

  // Fetch appointments on mount
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/auth'; // Redirect if no token
    }
     const fetchAppointments = async () => {
      try {
        const res = await axios.get('https://pawtect-fyp-production.up.railway.app/api/vet/appointments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };
    fetchAppointments();
  }, []);

  // Handle calendar date change
  const onDateChange = (date) => {
    setSelectedDate(date);
    // Format date to yyyy-mm-dd for input and formData
    const formattedDate = date.toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, date: formattedDate, time: '' })); // Reset time when date changes
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double check if time slot is available before submission
    const isBooked = appointments.some(
      (appt) => appt.date === formData.date && appt.time === formData.time
    );

    if (isBooked) {
      alert('This time slot is already booked. Please choose another time.');
      return;
    }

    try {
      // Add authorization header to POST request
      await axios.post('https://pawtect-fyp-production.up.railway.app/api/vet/appointments', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      alert('Appointment booked successfully!');
      
      // Reset form
      setFormData({ petName: '', ownerName: '', email: '', date: '', time: '', reason: '' });
      setSelectedDate(null);
  
      // Refresh appointments with authorization
      const res = await axios.get('https://pawtect-fyp-production.up.railway.app/api/vet/appointments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAppointments(res.data);
    } catch (error) {
      console.error('Full error:', error);
      alert(
        error.response?.data?.error ||
        'Failed to book. Check console for details.'
      );
    }
  };  
  // Get dates that have appointments (to highlight on calendar)
  const bookedDates = appointments.map((appt) => appt.date);

  // Disable dates in the past
  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }
    return false;
  };

  // Highlight dates that are booked
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      if (bookedDates.includes(dateStr)) {
        return 'booked-date'; // CSS class to highlight booked dates
      }
    }
    return null;
  };

  // Get booked times for the selected date
  const bookedTimesForSelectedDate = appointments
    .filter((appt) => appt.date === formData.date)
    .map((appt) => appt.time);

  // Define possible appointment times (e.g., every 30 mins from 9am to 5pm)
  const possibleTimes = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
    '13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00',
  ];

  return (
    <div
      style={{
        backgroundColor: '#ac8b66',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        paddingBottom: '2rem',
      }}
    >
      <Navbar/>

      <div className="container pt-5">
        <h1>Book an Online Vet Appointment</h1>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Calendar */}
          <div>
            <Calendar
              onChange={onDateChange}
              value={selectedDate}
              tileDisabled={tileDisabled}
              tileClassName={tileClassName}
            />
            <p style={{ marginTop: '0.5rem' }}>
              <small>
                Dates highlighted are already booked. Past dates are disabled.
              </small>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ flex: '1 1 300px' }}>
            <input
              type="text"
              name="petName"
              value={formData.petName}
              onChange={handleChange}
              placeholder="Pet's Name"
              className="form-control mb-2"
              required
            />
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={(e) => {
                const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                setFormData({ ...formData, ownerName: onlyLetters });
              }}
              placeholder="Owner's Name"
              className="form-control mb-2"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Owner's Email"
              className="form-control mb-2"
              required
            />

            {/* Date input is read-only, user selects date from calendar */}
            <input
              type="text"
              name="date"
              value={formData.date}
              readOnly
              placeholder="Select a date from calendar"
              className="form-control mb-2"
              required
            />

            {/* Time select, disable booked times */}
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="form-control mb-2"
              required
              disabled={!formData.date} // disable if no date selected
            >
              <option value="">Select a time</option>
              {possibleTimes.map((time) => (
                <option
                  key={time}
                  value={time}
                  disabled={bookedTimesForSelectedDate.includes(time)}
                >
                  {time} {bookedTimesForSelectedDate.includes(time) ? '(Booked)' : ''}
                </option>
              ))}
            </select>

            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Reason for Visit"
              className="form-control mb-2"
              required
            />
            <button type="submit" className="button2">
              Book Appointment
            </button>
          </form>
        </div>

        <img
          src="/images/sick.PNG"
          className="mx-auto d-block m-1"
          alt="sick"
          style={{ maxWidth: '300px', marginTop: '2rem' }}
        />
      </div>

      {/* Add some CSS for booked dates */}
      <style>{`
        .booked-date {
          background: #ff6b6b !important;
          color: white !important;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default AppointmentForm;