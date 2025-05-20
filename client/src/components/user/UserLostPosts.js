import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/UserLostPosts.css';

const UserLostPosts = ({ userId, onDeletePost }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `https://pawtect-fyp-production.up.railway.app/api/posts/user/${userId}`, // Correct endpoint
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load posts');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await axios.delete(
        `/api/posts/${postId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      onDeletePost(postId); // Call the parent handler
    } catch (err) {
      setError('Failed to delete post');
      console.error('Delete error:', err);
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-lost-posts">
      <div className="posts-header">
        <h2>My Lost Pet Reports</h2>
        <Link to="/community" className="new-post-btn">
          + New Report
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No lost pet reports found.</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <h3>{post.pet_name}</h3>
                <button 
                  onClick={() => handleDelete(post._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>

              {post.pet_image && (
  <img
    src={`https://pawtect-fyp-production.up.railway.app/${post.pet_image}`}
    alt={post.pet_name}
    className="post-image"
  />
)}

              <div className="engagement-metrics">
                <span className="metric">
                  ❤️ {post.likes?.length || 0} Likes
                </span>
                <span className="metric">
                  💬 {post.comments?.length || 0} Comments
                </span>
                <span className="metric">
                  🔗 {post.shares || 0} Shares
                </span>
              </div>

              <div className="post-details">
                <p><strong>Last Seen:</strong> {post.last_seen_location}</p>
                <p><strong>Reported:</strong> 
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="recent-comments">
                <h4>Recent Comments</h4>
                {post.comments?.slice(0, 2).map(comment => (
                  <div key={comment._id} className="comment">
                    {/* In UserLostPosts.js - Update the comment avatar section */}
<div className="comment-author">
  <img 
    src={
      comment.user_id?.avatar 
        ? `https://pawtect-fyp-production.up.railway.app${comment.user_id.avatar}`
        : 'https://pawtect-fyp-production.up.railway.app/images/default-avatar.jpg'
    }
    alt="avatar"
    className="comment-avatar"
  />
  <span>{comment.user_id?.name}</span>
</div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserLostPosts;