import React, { useState, useRef } from 'react';
import axios from 'axios';
import './Register.css';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { BASE_URL } from '../../../config';  // Import the base URL

const RegisterPage = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [name, setName] = useState('');
    const [pictureUrl, setPictureUrl] = useState('');
    const [email, setEmail] = useState('');
    const [webUrl, setWebUrl] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const cropperRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (cropperRef.current && cropperRef.current.cropper) {
            const canvas = cropperRef.current.cropper.getCroppedCanvas({
                width: 200, // max width
                height: 300, // max height (200 * 3/2 aspect ratio)
            });

            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('image', blob, `${username}.png`);
                const uploadResponse = await axios.post(`${BASE_URL}/api/auth/uploadProfileImage`, formData);
                const imagePath = `${BASE_URL}/${uploadResponse.data.path}`;
                await registerUser(imagePath);
            });
        } else {
            await registerUser('');
        }
    };

    const registerUser = async (imagePath) => {
        await axios.post(`${BASE_URL}/api/auth/register`, { 
            username, password, role, name, pictureUrl: imagePath, email, webUrl, description 
        });
        alert('User registered successfully');
        
        // Reset form state 
        setUsername(''); 
        setPassword(''); 
        setRole('user'); 
        setName(''); 
        setPictureUrl(''); 
        setEmail(''); 
        setWebUrl(''); 
        setDescription('');
        setImageFile(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpload();
    };

    return (
        <>
        <div className='register-wrap'>
            <div className="register-text text">
                <h1>Register new colleagues</h1>
            </div>

            <div className="register-cont">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <select 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        required
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="url"
                        placeholder="Web URL"
                        value={webUrl}
                        onChange={(e) => setWebUrl(e.target.value)}
                    />
                    <input type="file" accept="image/*" id="fileInput" onChange={handleImageChange} />
                    <label htmlFor="fileInput" className="file-input-label">Choose a picture</label>

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button className='reg-btn' type="submit">Register</button>
                </form>

                {imageFile && (
                    <Cropper
                        className='cropper'
                        src={imageFile}
                        style={{ height: '300px', width: '200px' }}
                        aspectRatio={2 / 3}
                        guides={true}
                        ref={cropperRef}
                        viewMode={1}
                        cropBoxResizable={false}
                        dragMode="move"
                    />
                )}
            </div>
        </div>
        </>
    );
};

export default RegisterPage;