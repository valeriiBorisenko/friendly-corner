import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "react-modal";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { BASE_URL } from '../../config';  // Import the base URL

import './LoginModal.css'

Modal.setAppElement('#root');

const LoginModal = forwardRef((props, ref) => {

    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); // "Remember Me" checkbox state
    const navigate = useNavigate(); // Initialize useNavigate
    const [showPassword, setShowPassword] = useState(false);

    // Check for existing token in localStorage or sessionStorage
    if (showModal) {
        const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (storedToken) {
            // Decode and verify token to determine role and navigate
            const user = JSON.parse(atob(storedToken.split('.')[1]));
            const userRole = user.role;

            if (userRole === 'admin') {
                toggleModal();
                navigate('/admin');
            } else if (userRole === 'user') {
                toggleModal();
                navigate('/user');
            }
        }
    }

    // Toggle modal visibility
    function toggleModal() {
      setShowModal((prev) => !prev);
    }

    // Clear input fields when modal closes
    useEffect(() => {
    if (!showModal) {
        setUsername('');
        setPassword('');
    }
    }, [showModal]);

    // Toggle password visibility
    function togglePasswordVisibility() {
        setShowPassword((prev) => !prev);
    };

    // Expose toggleModal to parent components via ref
    useImperativeHandle(ref, () => ({
    openModal: toggleModal,
    }));

//   Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            username: username,
            password: password
        });
        const { token } = response.data;

        if (rememberMe) {
            localStorage.setItem('token', token); // Persist token between sessions
        } else {
            sessionStorage.setItem('token', token); // Only for current session
        }

        // Decode the token to check roles
        const user = JSON.parse(atob(token.split('.')[1])); // Simplified decoding
        const userRole = user.role; // Adjust according to token payload structure

    // Redirect based on role
    if (userRole === 'admin') {
        toggleModal();      // Close modal
        navigate('/admin'); // Redirect to Admin page
    } else if (userRole === 'user') {
        toggleModal();      // Close modal
        navigate('/user'); // Redirect to User page
    } else {
        alert('Unknown role');} // Unasigned role
    } catch (error) {
        console.error('Login failed', error);
        alert('Login failed, please check your credentials.');
    }
};

    return(
        <>
        <div>
            <Modal 
                isOpen={showModal} 
                onRequestClose={() => {
                    toggleModal();
                    setUsername(''); // Clear username when modal closes
                    setPassword(''); // Clear password when modal closes
                }} 
                className='login-modal' 
                overlayClassName="login-overlay"
                shouldCloseOnOverlayClick={true}
                shouldReturnFocusAfterClose={true}>

                <div className="close-btn-cont">
                    <button onClick={toggleModal} className="close-btn">X</button>
                </div>    

                {/* Login form */}
                <div className="container">
                    <h1 className="heading" >Log in</h1>
                    <form onSubmit={handleSubmit} className="form">
                        <div>
                            <label htmlFor="username" className="input-label">Username</label>
                            <input 
                                id="username" 
                                type="text" 
                                className="input" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div>
                            <label htmlFor="password" className="input-label">Password</label>
                            <div className="password-input-container">
                                <input
                                className={`input password-input`}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                                <button
                                    className="icon-button"
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    title={showPassword ? "Hide password" : "Show password"}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label className="remember-me">
                                <input
                                    className="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember Me
                            </label>
                        </div>

                        <button className="submit-btn">Submit</button>
                    </form>
                </div>


            </Modal>
            {/* Overlay div */}
        {showModal && <div className="login-overlay" />}
        </div>
        </>
    );
});

export default LoginModal