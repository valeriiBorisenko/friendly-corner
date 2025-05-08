import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './EditUserImgModal.css';
import { GrClose, GrCheckmark } from "react-icons/gr";
import axios from 'axios';
import { BASE_URL } from '../../../config';  // Import the base URL

const EditUserImgModal = ({ show, onClose, onSave, image, username }) => {
    const [localImage, setLocalImage] = useState(null);
    const cropperRef = useRef(null);

    useEffect(() => {
        if (image) {
            setLocalImage(image);
        }
    }, [image]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (cropperRef.current && cropperRef.current.cropper) {
            const canvas = cropperRef.current.cropper.getCroppedCanvas({
                width: 200, // max width
                height: 300, // max height (200 * 3/2 aspect ratio)
            });

            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('image', blob, `${username}.png`);
                const uploadResponse = await axios.post(`${BASE_URL}/api/auth/uploadProfileImage`, formData);
                const updatedPictureUrl = `${BASE_URL}/${uploadResponse.data.path}`;
                onSave(updatedPictureUrl);
                setLocalImage(null); // Clear the local image state
                onClose();
            });
        }
    };

    if (!show) return null;

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal-content">
                {/* <h2>Edit User Image</h2> */}
                {!localImage ? (
                    <div className="edit-image-upload">
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                        <p>Select an image to edit</p>
                    </div>
                ) : (
                    <Cropper
                        className='cropper'
                        src={localImage}
                        style={{ height: '300px', width: '200px' }}
                        aspectRatio={2 / 3}
                        guides={true}
                        ref={cropperRef}
                        viewMode={1}
                        cropBoxResizable={false}
                        dragMode="move"
                    />
                )}
                <div className="edit-modal-btns">
                    {localImage && <button className="edit-btn save" onClick={handleSave}><GrCheckmark /></button>}
                    <button className="edit-btn exit" onClick={onClose}><GrClose /></button>
                </div>
            </div>
        </div>
    );
};

export default EditUserImgModal;