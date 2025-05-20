import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/SinglePostPage.css';

const SinglePostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // SinglePostPage.js - Updated useEffect
useEffect(() => {
  const fetchPost = async () => {
    try {
        const response = await axios.get(`https://pawtect-fyp-production.up.railway.app/api/posts/${postId}`);
      // Add shareUrl if missing
      const postWithShareUrl = {
        ...response.data,
        shareUrl: response.data.shareUrl || `https://pawtect-fyp.vercel.app/posts/${postId}`
      };
      setPost(postWithShareUrl);
    } catch (err) {
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };
  
  fetchPost();
}, [postId]);

  if (loading) return <div className="loading">Loading post...</div>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <div className="single-post-page">
      <Navbar />
      <div className="post-container">
        <div className="post-header">
          <h1>{post.pet_name}</h1>
          <span className="status">{post.status}</span>
        </div>
        
        {post.pet_image && (
          <img 
            src={`https://pawtect-fyp-production.up.railway.app/${post.pet_image}`}
            alt={post.pet_name}
            className="post-image"
          />
        )}

        <div className="post-details">
          <p className="description">{post.description}</p>
          <div className="meta">
            <p>📍 {post.last_seen_location}</p>
            <p>📞 {post.contact_info}</p>
            <p>Posted on: {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;