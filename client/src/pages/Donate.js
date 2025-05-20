import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import DonationHistory from '../components/DonationHistory';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '../components/Navbar';

const currencyConfig = {
  PKR: { min: 50, step: 1, zeroDecimal: true },
  USD: { min: 1, step: 0.01, zeroDecimal: false },
  EUR: { min: 1, step: 0.01, zeroDecimal: false },
  GBP: { min: 1, step: 0.01, zeroDecimal: false }
};

const Donate = () => {
  const [formData, setFormData] = useState({
    type: 'money',
    amount: '',
    currency: 'PKR',
    items: [{ name: '', quantity: 1, category: 'food' }],
    message: '',
    pickupAddress: ''
  });

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
    }
  }, []);

  const handleTypeChange = (type) => {
    setFormData({
      ...formData,
      type,
      amount: '',
      items: [{ name: '', quantity: 1, category: 'food' }],
      pickupAddress: ''
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, category: 'food' }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      
      if (formData.type === 'money') {
        if (!stripe || !elements) {
          throw new Error('Payment system not ready');
        }

        const config = currencyConfig[formData.currency];
        const amount = config.zeroDecimal 
          ? Math.round(formData.amount)
          : Math.round(formData.amount * 100);

        const paymentIntentRes = await axios.post(
          '/api/donations/create-payment-intent',
          {
            amount: amount,
            currency: formData.currency.toLowerCase()
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
          paymentIntentRes.data.clientSecret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
            }
          }
        );

        if (stripeError) throw stripeError;

        await axios.post('/api/donations', {
          type: 'money',
          amount: formData.amount,
          currency: formData.currency,
          message: formData.message,
          paymentIntentId: paymentIntent.id,
          status: 'completed',
          items: []
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/donations', {
          ...formData,
          status: 'pending'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setSuccess(true);
      setRefreshHistory(prev => !prev);
      setFormData({
        type: 'money',
        amount: '',
        currency: 'PKR',
        items: [{ name: '', quantity: 1, category: 'food' }],
        message: '',
        pickupAddress: ''
      });

    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  if (!stripe) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Payment system loading...</span>
          </div>
          <p className="mt-3">Securing payment gateway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: `url('/images/dashboard.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '95vh',
      }}
    >
      <Navbar/>
      <div className="container p-4" style={{ maxWidth: '768px' }}>
        <h1 className="text-center mb-4">Donate Now</h1>

        <div className="d-flex gap-2 justify-content-center mb-4">
          <button
            type="button"
            onClick={() => handleTypeChange('money')}
            className={`btn ${formData.type === 'money' ? 'button1' : 'btn-outline-secondary'}`}
          >
            Monetary Donation
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('item')}
            className={`btn ${formData.type === 'item' ? 'button1' : 'btn-outline-secondary'}`}
          >
            Item Donation
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {formData.type === 'money' ? (
            <>
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  min={currencyConfig[formData.currency].min}
                  step={currencyConfig[formData.currency].step}
                  required
                />
                <small className="text-muted">
                  Minimum {currencyConfig[formData.currency].min} {formData.currency}
                </small>
              </div>
              <div className="mb-3">
                <label className="form-label">Currency</label>
                <select
                  className="form-select"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option value="PKR">Pakistani Rupee (PKR)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Card Details</label>
                <div className="p-2 border rounded">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {formData.items.map((item, index) => (
                <div key={index} className="rounded p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Item {index + 1}</strong>
                    {formData.items.length > 1 && (
                      <button type="button" className="btn btn-link text-danger p-0" onClick={() => removeItem(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={item.category}
                        onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                      >
                        <option value="food">Food</option>
                        <option value="medicine">Medicine</option>
                        <option value="toys">Toys</option>
                        <option value="equipment">Equipment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-outline-secondary w-100 mb-3" onClick={addItem}>
                + Add Another Item
              </button>
              <div className="mb-3">
                <label className="form-label">Pickup Address</label>
                <textarea
                  className="form-control"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  rows="3"
                  required
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label">Message (Optional)</label>
            <textarea
              className="form-control"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="3"
              maxLength="500"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Donation successful! Thank you for your generosity.</div>}

          <button
            type="submit"
            className="btn button2 text-white w-100"
            disabled={loading || (formData.type === 'money' && !stripe)}
          >
            {loading ? 'Processing...' : 'Submit Donation'}
          </button>
        </form>

        {userId && (
          <div className="mt-5">
            <DonationHistory userId={userId} refreshTrigger={refreshHistory} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Donate;