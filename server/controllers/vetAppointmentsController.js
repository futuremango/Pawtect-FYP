// C:\Users\Anza\Desktop\pawtect5\pawtect\server\controllers\vetAppointmentsController.js
// C:\Users\Anza\Desktop\pawtect5\pawtect\server\models\VetAppointments.js
const VetAppointment = require('../models/VetAppointments');

const getAppointments = async (req, res) => {
  try {
    const appointments = await VetAppointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Only export what’s defined
module.exports = { getAppointments };
