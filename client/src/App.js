import React from 'react';
import "@fontsource/lilita-one";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAdoption from './pages/admin/ManageAdoption';
import ManageUsers from './pages/admin/ManageUsers';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AdoptionDashboard from './pages/AdoptionDashboard';
import Donate from './pages/Donate';
import Vet from './pages/AppointmentForm';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminRescues from './pages/admin/AdminRescues';
import AdminSurrenderedPets from './pages/admin/AdminSurrenderedPets';
import AdminVetAppointments from './pages/admin/AdminVetAppointments';
import VetLogin from './pages/vet/VetLogin';
import VetRecords from './pages/vet/vetRecords';
import AdminNavbar from './components/AdminNavbar';
import ManageDonations from './pages/admin/ManageDonations';
import Chatbot from './pages/chatbot';
import SinglePostPage from './components/SinglePostPage';

// Replace existing stripePromise code with:
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51RLkF5CWd0e1OS3oW7VmaB6Csy5VKESGoYWnswjGvlDqL8IASGEbxNos0mzrihuaFVnn7hqEuSDl1FjjPLVlfPFO00OgAMG1Bt' // Fallback
);
// Update the Stripe wrapper component
const StripeDonateWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <Donate />
    </Elements>
  );
};
// Add at the top of App.js
console.log('ENV VARIABLES:', process.env);
console.log('STRIPE KEY:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardWithNav />} />
          <Route path="/admin/manage-adoptions" element={<ManageAdoptionWithNav />} />
          <Route path="/admin/users" element={<ManageUsersWithNav />} />
          <Route path="/admin/volunteers" element={<AdminVolunteersWithNav />} />
          <Route path="/admin/rescues" element={<AdminRescuesWithNav />} />
          <Route path="/admin/surrenders" element={<AdminSurrenderedPetsWithNav />} />
          <Route path="/admin/vetappointments" element={<AdminVetAppointmentsWithNav />} />
          <Route path="/admin/manage-donations" element={<ManageDonationsWithNav />} />
        </Route>

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePageWithNav />} />
          <Route path="/community" element={<CommunityPageWithNav />} />
          <Route path="/profile" element={<ProfilePageWithNav />} />
          <Route path="/donate" element={<StripeDonateWrapper />} />
          <Route path="/vet" element={<Vet />} />
          <Route path="/adoptdash" element={<AdoptionDashboardWithNav />} />
          <Route path="/vet/login" element={<VetLogin />} />
          <Route path="/vet/records" element={<VetRecords />} />
          <Route path='/chatbot' element={<Chatbot/>}/>
          <Route path="/posts/:postId" element={<SinglePostPageWithNav />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
// Create wrapper
const SinglePostPageWithNav = () => (
  <>
    <Navbar />
    <SinglePostPage />
  </>
);

// Navigation Wrappers
const ManageDonationsWithNav = () => (
  <>
    <AdminNavbar />
    <ManageDonations />
  </>
);

const ManageUsersWithNav = () => (
  <>
    <AdminNavbar />
    <ManageUsers />
  </>
);

const AdminVolunteersWithNav = () => (
  <>
    <AdminNavbar />
    <AdminVolunteers />
  </>
);

const AdminRescuesWithNav = () => (
  <>
    <AdminNavbar />
    <AdminRescues />
  </>
);

const AdminSurrenderedPetsWithNav = () => (
  <>
    <AdminNavbar />
    <AdminSurrenderedPets />
  </>
);

const AdminVetAppointmentsWithNav = () => (
  <>
    <AdminNavbar />
    <AdminVetAppointments />
  </>
);

const ManageAdoptionWithNav = () => (
  <>
    <AdminNavbar />
    <ManageAdoption />
  </>
);

const AdminDashboardWithNav = () => (
  <>
    <AdminNavbar />
    <AdminDashboard />
  </>
);

const AdoptionDashboardWithNav = () => (
  <>
    <Navbar />
    <AdoptionDashboard />
  </>
);

const HomePageWithNav = () => (
  <>
    <Navbar />
    <HomePage />
  </>
);

const CommunityPageWithNav = () => (
  <>
    <Navbar />
    <CommunityPage />
  </>
);

const ProfilePageWithNav = () => (
  <>
    <Navbar />
    <ProfilePage />
  </>
);

export default App;