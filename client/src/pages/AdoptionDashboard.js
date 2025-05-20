import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdoptionDashboard.css';
import AdoptionForm from '../components/AdoptionForm';

const AdoptionDashboard = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('https://pawtect-fyp-production.up.railway.app/api/adoption');
        setPets(response.data);
        setFilteredPets(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch pets');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  // Handle the search input
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter pets based on search term (e.g., species or breed)
    if (value) {
      const filtered = pets.filter((pet) =>
        pet.name.toLowerCase().includes(value.toLowerCase()) ||
        pet.species.toLowerCase().includes(value.toLowerCase()) ||
        pet.breed.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPets(filtered);
    } else {
      setFilteredPets(pets);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('/images/dashboard.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div className="adoption-dashboard p-3">
        <h1>Available Pets for Adoption</h1>

        {/* Search Bar */}
        <div className="search-container shadow rounded-pill border-primary p-2 m-4">
          <input
            type="text"
            className="form-control rounded-pill border-primary"
            placeholder="Search pets by name, species, or breed"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading pets...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && filteredPets.length === 0 && (
          <div className="no-pets">
            <h3>No pets found 😿</h3>
            <p>Please check back later!</p>
          </div>
        )}

        {!loading && !error && filteredPets.length > 0 && (
          <div className="pets-grid">
            {filteredPets.map((pet) => (
              <div key={pet._id} className="pet-card">
                <div className="pet-image">
                  <img 
                    src={`https://pawtect-fyp-production.up.railway.app${pet.image.startsWith('/') ? '' : '/'}${pet.image}`}
                    alt={pet.name}
                    onError={(e) => {
                      e.target.src = '/images/fallback.jpg';
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="pet-details">
                  <h3>{pet.name}</h3>
                  <div className="detail-row">
                    <span>Species:</span>
                    <span>{pet.species}</span>
                  </div>
                  <div className="detail-row">
                    <span>Breed:</span>
                    <span>{pet.breed}</span>
                  </div>
                  <div className="detail-row">
                    <span>Age:</span>
                    <span>{pet.age} years</span>
                  </div>
                  <div className="detail-row">
                    <span>Gender:</span>
                    <span>{pet.gender}</span>
                  </div>
                  <div className="medical-info">
                    <span>Vaccinated: {pet.medicalHistory.vaccinated ? '✅' : '❌'}</span>
                    <span>Neutered: {pet.medicalHistory.neutered ? '✅' : '❌'}</span>
                  </div>
                  <p className="description">{pet.description}</p>
                  <button 
                    className="button2"
                    onClick={() => setSelectedPet(pet)}
                  >
                    Start Adoption Process
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bootstrap Modal for Adoption Form */}
        {selectedPet && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Adopt {selectedPet.name}</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedPet(null)}></button>
                </div>
                <div className="modal-body p-3">
                  <AdoptionForm 
                    petId={selectedPet._id} 
                    onClose={() => setSelectedPet(null)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionDashboard;
