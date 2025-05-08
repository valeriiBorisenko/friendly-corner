import React, { useEffect, useState, useRef } from 'react';
import './UserList.css';
import axios from 'axios';
import { GrClose, GrCheckmark, GrTrash, GrUpdate } from "react-icons/gr";
import ConfirmationDialog from '../ConfirmationDialog'; // Dialog component
import ViewUserImgModal from './ViewUserImgModal'; // Modal component for viewing images
import EditUserImgModal from './EditUserImgModal'; // Modal component for editing images
import { BASE_URL, BASE_LOGIN } from '../../../config';  // Import the base URL
// import UserGallery from '../../Gallery/UserGallery';

const UserList = () => {
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({
        username: '',
        email: '',
        name: '',
        pictureUrl: '',
        webUrl: '',
        description: '',
        password: ''
    });
    const [users, setUsers] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [alert, setAlert] = useState({ message: '', show: false });
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');
    const [newImageFile, setNewImageFile] = useState(null);
    const [currentUsername, setCurrentUsername] = useState('');
    const cropperRef = useRef(null);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/auth/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showAlert = (message) => {
        setAlert({ message, show: true });
        setTimeout(() => {
            setAlert({ message: '', show: false });
        }, 5000); // Hide the alert after 5 seconds
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/auth/delete/${id}`);
            if (response.status === 200) {
                fetchUsers();
                showAlert('User deleted successfully');
            } else {
                showAlert('Failed to delete user, please try again.');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showAlert('Failed to delete user, please try again.');
        }
    };

    const handleConfirmDelete = () => {
        if (deleteUserId !== null) {
            handleDelete(deleteUserId);
            setShowDialog(false);
            setDeleteUserId(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDialog(false);
        setDeleteUserId(null);
    };

    const handleDeleteClick = (id) => {
        setDeleteUserId(id);
        setShowDialog(true);
    };

    const handleEditClick = (user) => {
        setEditId(user.id);
        setEditData({
            username: user.username,
            email: user.email,
            name: user.name,
            pictureUrl: user.pictureUrl,
            webUrl: user.webUrl,
            description: user.description,
            password: '' // Initialize password field
        });
        setCurrentUsername(user.username); // Set the current username
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value
        });
    };

    const handleUpdate = async (id, updatedPictureUrl) => {
        try {
            await axios.put(`${BASE_URL}/api/auth/update/${id}`, { ...editData, pictureUrl: updatedPictureUrl }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchUsers(); // Refresh the user data
            setEditId(null);
            showAlert('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            showAlert('Failed to update user, please try again.');
        }
    };

    const handleImageClick = (url) => {
        setModalImageUrl(url);
        setShowViewModal(true);
    };

    const closeModal = () => {
        setShowViewModal(false);
        setShowEditModal(false);
        setModalImageUrl('');
        setNewImageFile(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImageFile(reader.result);
                setShowEditModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="user-list">
            <div className="user-text text">
                <h1>Registered Users</h1>
                {alert.show && <span className="user-alert">{alert.message}</span>}
            </div>
            {/* <UserGallery users={users} /> Add the UserGallery component */}
            <table className='user-tbl'>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Picture</th>
                        <th>Web URL</th>
                        <th>Description</th>
                        <th className="sticky-column">Actions</th>
                    </tr>
                </thead>
                <tbody className='user-bdy'>
                {users.filter(user => user.username !== BASE_LOGIN).map(user => (
                        <tr key={user.id} className={editId === user.id ? "editing" : ""}>
                            {editId === user.id ? (
                                <>
                                    <td><input type="text" name="username" value={editData.username} onChange={handleEditChange} className="input-field" /></td>
                                    <td><input type="email" name="email" value={editData.email} onChange={handleEditChange} className="input-field" /></td>
                                    <td><input type="text" name="name" value={editData.name} onChange={handleEditChange} className="input-field" /></td>
                                    <td className='picture-btns'>
                                        <input type="file" accept="image/*" id="fileInput" onChange={handleImageChange} />
                                        <label htmlFor="fileInput" className="update-file-input-label">Change Picture</label>
                                    </td>
                                    <td><input type="text" name="webUrl" value={editData.webUrl} onChange={handleEditChange} className="input-field" /></td>
                                    <td><input type="text" name="description" value={editData.description} onChange={handleEditChange} className="input-field" /></td>
                                    <td className="sticky-column">
                                        <input type="text" name="password" placeholder="New Password" value={editData.password} onChange={handleEditChange} className="input-field" /><br/>
                                        <button className='user-btn update' onClick={() => handleUpdate(user.id, editData.pictureUrl)}><GrCheckmark /></button>
                                        <button className='user-btn cancel' onClick={() => setEditId(null)}><GrClose /></button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{user.username || "N/A"}</td>
                                    <td>{user.email || "N/A"}</td>
                                    <td>{user.name || "N/A"}</td>
                                    <td>
                                        <button 
                                            className={`${!user.pictureUrl ? 'noview' : 'user-btn view'}`} 
                                            onClick={() => user.pictureUrl && handleImageClick(`${user.pictureUrl}`)} 
                                            disabled={!user.pictureUrl} > {user.pictureUrl ? 'View' : 'N/A'} 
                                        </button>
                                    </td>
                                    <td>{user.webUrl || "N/A"}</td>
                                    <td>{user.description || "N/A"}</td>
                                    <td className="sticky-column">
                                        <button className='user-btn edit' onClick={() => handleEditClick(user)}><GrUpdate /></button>
                                        <button className='user-btn delete' onClick={() => handleDeleteClick(user.id)}><GrTrash /></button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <ConfirmationDialog
                show={showDialog}
                message="Are you sure you want to delete this user?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            <ViewUserImgModal show={showViewModal} onClose={closeModal} image={modalImageUrl} />
            <EditUserImgModal show={showEditModal} onClose={closeModal} onSave={(updatedPictureUrl) => handleUpdate(editId, updatedPictureUrl)} image={newImageFile} username={currentUsername} />
        </div>
    );
};

export default UserList;