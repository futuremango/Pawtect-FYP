import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams(); // Get userId from URL

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch user data
        const userRes = await fetch(`/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Fetch user's posts (with replies)
        const postsRes = await fetch(`/api/users/${userId}/posts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!userRes.ok || !postsRes.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const userData = await userRes.json();
        const postsData = await postsRes.json();

        setUser(userData);
        setPosts(postsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/lostpets/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete post');
      
      setPosts(posts.filter(post => post._id !== postId));
      alert('Post deleted successfully');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="profile-container">
      <div className="user-info">
        <h2>{user.name}'s Profile</h2>
        <p>Email: {user.email}</p>
        <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="user-posts">
        <h3>My Lost Pet Reports</h3>
        {posts.length === 0 ? (
          <p>You haven't reported any lost pets yet.</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <h4>{post.petName}</h4>
                <button 
                  onClick={() => handleDeletePost(post._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
              
              <p>Last seen: {post.lastSeenLocation}</p>
              <p>Date reported: {new Date(post.createdAt).toLocaleDateString()}</p>

              <div className="post-replies">
                <h5>Responses ({post.replies.length})</h5>
                {post.replies.length === 0 ? (
                  <p>No responses yet</p>
                ) : (
                  post.replies.map((reply, index) => (
                    <div key={index} className="reply">
                      <p><strong>From:</strong> {reply.email}</p>
                      <p><strong>Message:</strong> 
                        {reply.messageType === 'saw' 
                          ? ' I saw this animal' 
                          : ' I have a lead'}
                      </p>
                      <p><small>{new Date(reply.createdAt).toLocaleString()}</small></p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfilePage;