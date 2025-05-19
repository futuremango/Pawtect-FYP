# Pawtect - Pet Rescue & Adoption Platform 🐕🐈

```markdown
# 🐾 Pawtect - Where Pets Find Their Forever Homes

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen)](https://www.mongodb.com/)

Pawtect is a comprehensive pet rescue and adoption platform connecting loving homes with pets in need. Our mission is to reduce stray animal populations through adoption, rescue coordination, and community support.

## 🌟 Key Features

- **Pet Adoption Network** - Browse adoptable pets with filters
- **Lost & Found System** - Report and search for missing pets
- **Rescue Coordination** - Connect with local rescue organizations
- **Donation Portal** - Support animal welfare initiatives
- **Surrender Assistance** - Responsible pet rehoming process
- **AI-Powered Chatbot** - 24/7 pet care assistance

## 🛠️ Tech Stack

| Component       | Technology                 |
|-----------------|----------------------------|
| Frontend        | React.js, Redux, TailwindCSS |
| Backend         | Node.js, Express.js        |
| Database        | MongoDB Atlas              |
| AI Chatbot      | Python (TensorFlow/NLTK)   |
| Authentication  | JWT, OAuth 2.0            |
| Payment Gateway | Stripe Integration        |

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Python 3.8+ (for chatbot)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/futuremango/Pawtect-FYP.git
   cd Pawtect-FYP
   ```

2. **Backend Setup**
   ```bash
   cd server
   node server.js
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm start
   ```

4. **Chatbot Setup**
   ```bash
   cd server
   pip install -r requirements.txt
   uvicorn app:app --reload
   ```

## 📂 Project Structure

```
Pawtect-FYP/
├── client/               # React frontend
│   ├── public/           # Static assets
│   └── src/              # React components
│       ├── components/   # Reusable UI
│       ├── pages/        # Route pages
│       └── styles/        # Redux configuration
├── server/               # Node.js backend
│   ├── controllers/      # Business logic
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   └── middleware/       # Authentication
│   ├── model/            # ML models
│   └── training_data/    # Chatbot datasets
└── docs/                 # Documentation
```

## 🌐 API Documentation

[View Complete API Docs](https://pawtect-api-docs.example.com)

Key Endpoints:
- `POST /api/pets` - Add new pet listing
- `GET /api/pets?type=dog` - Filter pets
- `POST /api/lost-reports` - File lost pet report
- `POST /api/donations` - Process donations


## 🛡️ Environment Variables

```ini
# Server
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/pawtect
JWT_SECRET=your_jwt_secret_here
STRIPE_KEY=sk_test_stripe_key

# Client
REACT_APP_API_URL=https://api.pawtect.example.com
REACT_APP_MAPBOX_KEY=pk.mapbox_key
```

## 🚧 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 🚀 Deployment Guide

1. **Frontend Deployment**
   ```bash
   cd client
   npm run build
   # Upload build/ to hosting (Netlify/Vercel)
   ```

2. **Backend Deployment**
   - Deploy to Render/Heroku
   - Configure MongoDB Atlas connection
   - Set environment variables

3. **Chatbot Deployment**
   - Containerize with Docker
   - Deploy to Python hosting (PythonAnywhere)




## ✉️ Contact

Project Maintainers:
- Romysa Siddiqui - [romysasidd21@gmail.com]
- Anza Malik - [anza.mk8142@gmail.com]

Project Link: [https://github.com/futuremango/Pawtect-FYP](https://github.com/futuremango/Pawtect-FYP)
```

