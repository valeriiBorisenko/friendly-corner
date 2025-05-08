import React from 'react';
import './ViewUserImgModal.css';

const placeholderImage = '/user-placeholder.jpg';  // Path relative to public folder

const ViewUserImgModal = ({ show, onClose, image }) => {
    if (!show) return null;

    // Use the provided image URL with timestamp or fallback to the placeholder image
    const imageUrl = image || placeholderImage;

    return (
        <div className="view-modal-overlay">
            <div className="view-modal-content">
                <img src={imageUrl} alt="User" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                <button className="view-close-button" onClick={onClose}>X</button>
            </div>
        </div>
    );
};

export default ViewUserImgModal;
