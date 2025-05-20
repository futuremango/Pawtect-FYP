import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'

const Home = () => {
  const [cvFile, setCvFile] = useState(null);
  const [volunteerData, setVolunteerData] = useState({
    name: '',     email: '',    phone: '',  });
  const [rescueData, setRescueData] = useState({
    name: '',    email: '',    phone: '',    location: '',    animalType: '',    description: '',  });
  const [surrenderData, setSurrenderData] = useState({    name: '',    email: '',    phone: '',    petName: '',    petType: '',    petAge: '',    reason: '',  });

  // Handle Volunteer CV Upload
  const handleVolunteer = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', volunteerData.name);
    formData.append('email', volunteerData.email);
    formData.append('phone', volunteerData.phone);
    formData.append('cv', cvFile);

    try {
      const response = await axios.post('http://localhost:5000/api/volunteer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      setVolunteerData({ name: '', email: '', phone: '' });
      setCvFile(null);
    } catch (error) {
      console.error('Volunteer Error:', error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'Error submitting volunteer application.');
    }
  };

  // Handle Rescue Request
  const handleRescue = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/rescue', rescueData);
      alert(response.data.message);
      setRescueData({name: '',        email: '',        phone: '',        location: '',        animalType: '',        description: '',      });
    } catch (error) {
      console.error('Rescue Error:', error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'Error submitting rescue request.');
    }
  };

  // Handle Pet Surrender
  const handleSurrender = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/surrender', surrenderData);
      alert(response.data.message);
      setSurrenderData({ name: '',        email: '',        phone: '',        petName: '',        petType: '',        petAge: '',        reason: '',      });
    } catch (error) {
      console.error('Surrender Error:', error.response?.data?.error || error.message);
      alert(error.response?.data?.error || 'Error submitting pet surrender request.');
    }
  };

  return (
    <div>
      <div className='center-div' style={{
  backgroundImage: 'url(/images/bg.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
}}>
       <section className="hero mt-5 pt-5">
        <h1 className="hero-title">Protecting every <span>Paw</span></h1>
        <p className="hero-subtitle">Find your perfect companion or help animals in need through our adoption and rescue services.</p>
        <button 
          className="adopt-btn" 
          onClick={() => window.location.href = 'http://localhost:3000/adoptdash'}
        >
          Start Adoption
        </button>
      </section>
     </div>   
      
      {/* Volunteer CV Upload */}
      <div className='min-vh-100 d-flex align-items-center justify-content-center section1' id="volunteer">
        <div className="container">
          <h2 className="text-center mb-4">Apply to Volunteer</h2>
          <form onSubmit={handleVolunteer} encType="multipart/form-data" className="w-100" style={{ maxWidth: '500px', margin: 'auto' }}>
          <img src="/images/vol.PNG" className="mx-auto d-block m-1" alt='siren'></img>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={volunteerData.name}
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setVolunteerData({ ...volunteerData, name: onlyLetters });
                }}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={volunteerData.email}
                onChange={(e) => setVolunteerData({ ...volunteerData, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="tel"
                className="form-control"
                pattern="[0-9]{11}" maxlength="11"
                placeholder="Phone (11 digits)"
                value={volunteerData.phone}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                  setVolunteerData({ ...volunteerData, phone: onlyNumbers });
                }}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files[0])}
                required
              />
            </div>
            <button type="submit" className="w-100">Submit CV</button>
          </form>
        </div>
      </div>


      {/* Rescue Request Form */}
      <div className='min-vh-100 d-flex align-items-center justify-content-center section2' id="rescue"
        style={{
          backgroundImage: 'url(/images/rescue.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '95vh',
        }}
      >
      <div className="container">
        <h2 className="text-center mb-4">Request Animal Rescue</h2>
        <form onSubmit={handleRescue} className="w-100" style={{ maxWidth: '500px', margin: 'auto' }}>
          <img src="/images/siren.PNG" className="rounded mx-auto d-block" alt='siren'></img>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={rescueData.name}
              onChange={(e) => {
                const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                setRescueData({ ...rescueData, name: onlyLetters });
              }}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={rescueData.email}
              onChange={(e) => setRescueData({ ...rescueData, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="tel"
              className="form-control"
              pattern="[0-9]{11}" maxlength="11"
              placeholder="Phone (11 digits)"
              value={rescueData.phone}
               onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                setRescueData({ ...rescueData, phone: onlyNumbers });
              }}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Location"
              value={rescueData.location}
              onChange={(e) => setRescueData({ ...rescueData, location: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Animal Type"
              value={rescueData.animalType}
              onChange={(e) => setRescueData({ ...rescueData, animalType: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Description"
              rows="3"
              value={rescueData.description}
              onChange={(e) => setRescueData({ ...rescueData, description: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="button2 w-100">Submit Rescue Request</button>
        </form>
      </div>
    </div>


      {/* Pet Surrender Form */}
      <div className='min-vh-100 d-flex align-items-center justify-content-center section1' id="surrender">
        <div className="container">
          <h2 className="text-center mb-4">Surrender Pet</h2>
          <form onSubmit={handleSurrender} className="w-100" style={{ maxWidth: '500px', margin: 'auto' }}>
          <img src="/images/sur.PNG" className="mx-auto d-block m-1" alt='siren'></img>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={surrenderData.name}
                 onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setSurrenderData({ ...surrenderData, name: onlyLetters });
                }}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={surrenderData.email}
                onChange={(e) => setSurrenderData({ ...surrenderData, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="tel"
                className="form-control"
                pattern="[0-9]{11}"
                maxLength="11"
                placeholder="Phone (11 digits)"
                value={surrenderData.phone}
                onChange={(e) => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                  setSurrenderData({ ...surrenderData, phone: onlyNumbers });
                }}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Pet Name"
                value={surrenderData.petName}
                onChange={(e) => setSurrenderData({ ...surrenderData, petName: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Pet Type"
                value={surrenderData.petType}
                onChange={(e) => setSurrenderData({ ...surrenderData, petType: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Pet Age"
                value={surrenderData.petAge}
                onChange={(e) => setSurrenderData({ ...surrenderData, petAge: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Reason for Surrender"
                rows="3"
                value={surrenderData.reason}
                onChange={(e) => setSurrenderData({ ...surrenderData, reason: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="w-100">Submit Surrender Request</button>
          </form>
        </div>
      </div>

      <div className='center-div'
        style={{
          backgroundImage: 'url(/images/Paw.PNG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '60vh',
        }}
      >
        <div className='Aboutus' id="Aboutus">
          <h3>Final Year Project Comsats University Islamabad Wah Campus</h3>
          <h4>Anza Malik (FA21-BCS-037) & Romysa Siddiqui (FA21-BCS-069)</h4>
          <h5>Supervised by: Dr. Muhammad Bilal</h5>
        </div>
        
      </div>
    </div>
  );
};

export default Home;