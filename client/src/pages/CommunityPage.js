import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/CommunityPage.css';

const CommunityPage = () => {
  const [postData, setPostData] = useState({
    pet_name: '',
    description: '',
    last_seen_location: '',
    contact_info: '',
    pet_image: null,
  });
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [replyText, setReplyText] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await axios.get('/api/posts');
        setPosts(postsResponse.data);

        if (localStorage.getItem('token')) {
          const notificationsResponse = await axios.get('/api/notifications', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setNotifications(notificationsResponse.data);
        }
      } catch (err) {
        console.error('Fetch Error:', err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      alert('Please login to post!');
      navigate('/auth');
      return;
    }

    const formData = new FormData();
    Object.entries(postData).forEach(([key, value]) => formData.append(key, value));

    try {
      const response = await axios.post('/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        setPosts([response.data, ...posts]);
        setPostData({
          pet_name: '',
          description: '',
          last_seen_location: '',
          contact_info: '',
          pet_image: null,
        });
        setShowForm(false);
        document.querySelector('input[type="file"]').value = null;
      }
    } catch (err) {
      console.error('Post Creation Error:', err);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = posts.filter(post =>
      post.last_seen_location.toLowerCase().includes(term)
    );
    setFilteredPosts(filtered);
  };

  const handleComment = async (postId, text) => {
    if (!text.trim()) return;
  
    try {
      const res = await axios.post(
        `/api/posts/${postId}/comments`,
        { text },
        { 
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          } 
        }
      );
      
      // Update posts with the new comment including user data
      setPosts(posts.map(p => {
        if (p._id === postId) {
          const updatedComments = [...p.comments];
          // Add the new comment with user data from response
          updatedComments.push(res.data.comment);
          return { ...p, comments: updatedComments };
        }
        return p;
      }));
      
      setCommentText({ ...commentText, [postId]: '' });
    } catch (err) {
      console.error('Comment Error:', err.response?.data || err.message);
    }
  };

  const handleReply = async (postId, commentId, text) => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `/api/posts/${postId}/comments/${commentId}/replies`,
        { text },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPosts(posts.map(p => (p._id === postId ? res.data : p)));
      setReplyText({ ...replyText, [commentId]: '' });
    } catch (err) {
      console.error('Reply Error:', err.response?.data || err.message);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await axios.put(`/api/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(posts.map(p => p._id === postId ? res.data : p));
    } catch (err) {
      console.error('Like Error:', err.response?.data || err.message);
    }
  };

  const handleSharePost = async (postId) => {
    try {
      const res = await axios.post(`/api/posts/${postId}/share`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // Update the post with the shared data including image URL
      setPosts(posts.map(p => p._id === postId ? {
        ...p,
        ...res.data,
        shares: (p.shares || 0) + 1
      } : p));
      
      // Create shareable link with image preview
      const shareText = `Check out this lost pet: ${res.data.pet_name}\n` +
                       `Last seen: ${res.data.last_seen_location}\n` +
                       `Image: ${res.data.pet_image}\n` +
                       `View post: ${res.data.shareUrl}`;
      
      // For web share API
      if (navigator.share) {
        await navigator.share({
          title: `Lost Pet: ${res.data.pet_name}`,
          text: shareText,
          url: res.data.shareUrl
        });
      } else {
        // Fallback for browsers without share API
        navigator.clipboard.writeText(shareText);
        alert('Post link copied to clipboard!');
      }
  
    } catch (err) {
      console.error('Share Error:', err.response?.data || err.message);
    }
  };

  const toggleComments = (postId) => {
    setVisibleComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Mark Read Error:', err);
    }
  };

  return (
    <div 
      style={{
        backgroundImage: 'url(/images/dashboard.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '95vh',
      }}
    >
      <div className="community-container p-5">
        {/* Notifications */}
        <div className="notification-system">
          <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
            🔔 {notifications.filter(n => !n.read).length > 0 && (
              <span className="badge">{notifications.filter(n => !n.read).length}</span>
            )}
          </div>
          {showNotifications && (
            <div className="notification-dropdown">
              {notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification._id)}
                >
                  <div className="notification-icon">
                    {notification.type === 'like' && '❤'}
                    {notification.type === 'comment' && '💬'}
                    {notification.type === 'share' && '🔗'}
                    {notification.type === 'donation' && '💰'}
                    {notification.type === 'adoption' && '🏡'}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">
                      {notification.sender?.name} {notification.type}ed your {notification.post ? 'post' : 'comment'}
                    </p>
                    <small className="notification-time">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Creation */}
        <div className="container">
          <h1 className="text-center mb-4">Lost Pet Posters</h1>
          <div className="text-center mb-4">
            <button 
              className="button2"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Add New Lost Pet Post'}
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '500px', margin: 'auto' }}>
              <div className="mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={postData.pet_name} 
                  placeholder="Pet Name"
                  onChange={e => setPostData({ ...postData, pet_name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <textarea 
                  className="form-control" 
                  rows="3" 
                  required
                  value={postData.description} 
                  placeholder="Description"
                  onChange={e => setPostData({ ...postData, description: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={postData.last_seen_location} 
                  placeholder="Last Seen Location"
                  onChange={e => setPostData({ ...postData, last_seen_location: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  value={postData.contact_info}                   
                  pattern="[0-9]{11}" 
                  maxLength="11"
                  placeholder="Phone (11 digits)"
                  onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                    setPostData({ ...postData, contact_info: onlyNumbers });
                  }}
                />
              </div>
              <div className="mb-3">
                <input 
                  type="file" 
                  className="form-control" 
                  accept="image/*" 
                  required
                  onChange={e => setPostData({ ...postData, pet_image: e.target.files[0] })}
                />
              </div>
              <button type="submit" className="w-100">Create Post</button>
            </form>
          )}
        </div>

        {/* Posts Feed */}
        <div className="container mt-5">
          <div className="search-container shadow rounded-pill border-primary p-2 m-4">
            <input
              type="text"
              className="form-control rounded-pill border-primary"
              placeholder="Search Location"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="row">
            {(searchTerm ? filteredPosts : posts).map(post => (
              <div key={post._id} className="col-md-4 mb-4">
                <div className="post-card p-3">
                  <h5>{post.pet_name}</h5>
                  {post.pet_image && (
                    <img 
                      src={`https://pawtect-fyp-production.up.railway.app/${post.pet_image}`} 
                      alt={post.pet_name} 
                      className="img-fluid rounded mb-2" 
                      style={{ maxHeight: '250px', objectFit: 'cover', width: '100%' }} 
                    />
                  )}
                  <p className="text-muted">{post.description}</p>
                  <p><strong>Last Seen:</strong> {post.last_seen_location}</p>
                  <p><strong>Contact:</strong> {post.contact_info}</p>
                  <div className="d-flex justify-content-between">
                    <button 
                      className="btn btn-outline-danger btn-sm" 
                      onClick={() => handleLikePost(post._id)}
                    >
                      ❤ Like ({post.likes?.length || 0})
                    </button>
                    <button 
                      className="btn btn-outline-primary btn-sm" 
                      onClick={() => handleSharePost(post._id)}
                    >
                      🔗 Share
                    </button>
                  </div>
                  <div className="mt-2 text-end">
                    <button 
                      className="btn btn-link btn-sm" 
                      onClick={() => toggleComments(post._id)}
                    >
                      {visibleComments[post._id] ? 'Hide Comments' : 'Show Comments'}
                    </button>
                  </div>
                  {visibleComments[post._id] && (
                    <div className="comments-section mt-3">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Add a comment..."
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                      />
                      <button
                        className="btn btn-secondary btn-sm mb-2"
                        onClick={() => handleComment(post._id, commentText[post._id])}
                      >
                        Post
                      </button>
                      {post.comments?.map(comment => (
                        <div key={comment._id} className="border rounded p-2 mb-2">
                          <div className="comment-header">
                            <strong>{comment.user_id?.name || 'Anonymous'}</strong>
                            <small className="text-muted ms-2">
                              {new Date(comment.createdAt).toLocaleTimeString()}
                            </small>
                          </div>
                          <p>{comment.text}</p>
                          <div className="mt-1">
                            <input
                              type="text"
                              className="form-control mb-1"
                              placeholder="Reply..."
                              value={replyText[comment._id] || ''}
                              onChange={(e) => setReplyText({ ...replyText, [comment._id]: e.target.value })}
                            />
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => handleReply(post._id, comment._id, replyText[comment._id])}
                            >
                              Reply
                            </button>
                          </div>
                          {comment.replies?.map(reply => (
                            <div key={reply._id} className="ps-3 pt-2">
                              <div className="reply-header">
                                <strong>{reply.user_id?.name || 'Anonymous'}</strong>
                                <small className="text-muted ms-2">
                                  {new Date(reply.createdAt).toLocaleTimeString()}
                                </small>
                              </div>
                              <p>{reply.text}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;