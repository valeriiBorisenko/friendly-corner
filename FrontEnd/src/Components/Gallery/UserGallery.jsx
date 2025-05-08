import React from 'react';
import './UserGallery.css';

const UserGallery = ({ users }) => {
  const timestamp = new Date().getTime(); // Cache-busting

  return (
    <div className="user-gallery">
      {users.map(user => {
        console.log(`User: ${user.name}, WebUrl: ${user.webUrl || 'No WebUrl'}`);
        return (
          <div key={user.id} className="gallery-item">
            {user.pictureUrl ? (
              <img src={`${user.pictureUrl}?t=${timestamp}`} alt={user.username} className="gallery-image" />
            ) : (
              <div className="placeholder-image">No Image</div>
            )}
            <div className={`gallery-caption ${user.webUrl ? 'clickable' : ''}`}>
              {user.webUrl ? (
                <a href={user.webUrl} target="_blank" rel="noopener noreferrer">
                  {user.name}
                </a>
              ) : (
                user.name
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserGallery;