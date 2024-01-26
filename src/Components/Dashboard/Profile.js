import React, { useState, useEffect } from 'react';
import '../../style/Profile.css';
import ProfileFoto from '../../assets/profilfoto.png';
import { useAuth } from '../../utils/AuthContext';
import {updateDoctorInfoById} from "../../Api/Api";


const Profile = () => {
    const { user } = useAuth();

    const initialUserData = {
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        username: user?.username || '',
        email: user?.email || '',
    };

    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(initialUserData);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        setUserData({
            firstname: user?.firstname || '',
            lastname: user?.lastname || '',
            username: user?.username || '',
            email: user?.email || '',
        });
    }, [user]);

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setSelectedPhoto(file);
    };

    const saveChanges = async () => {
         const updatedUser = await updateDoctorInfoById(user.id, {
            firstname: userData.firstname,
            lastname: userData.lastname,
            username: userData.username,
        });
        setUserData(updatedUser)
        console.log('Saving changes:', userData);
        console.log('Selected Photo:', selectedPhoto);
        toggleEditing();
    };
    const cancelChanges = () => {
        toggleEditing();

    }

    return (
        <div className={`profile-container ${isEditing ? 'editing-mode' : ''}`}>
            <div className={`centered-container ${isEditing ? 'editing-center' : ''}`}>
                <h2 className="profile-header">User Profile</h2>
                <div className={`photo-frame ${isEditing ? 'centered-photo-frame' : ''}`}>
                    <img
                        src={selectedPhoto ? URL.createObjectURL(selectedPhoto) : ProfileFoto}
                        alt="User's profile"
                        className="profile-photo"
                    />
                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                    )}
                </div>
                {isEditing ? (
                    <div className="edit-mode">
                        <div className="form-group">
                            <label>Firstname:</label>
                            <input
                                type="text"
                                name="firstname"
                                value={userData.firstname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Lastname:</label>
                            <input
                                type="text"
                                name="lastname"
                                value={userData.lastname}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={userData.username}
                                onChange={handleChange}
                            />
                        </div>

                        <button className="save-button" onClick={saveChanges}>
                            Save Changes
                        </button>
                        <button className="back-button" onClick={cancelChanges}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="view-mode" style={{textAlign: "center", color: "white", fontSize: "12pt"}}>
                        <p><strong>Firstname:</strong> {userData.firstname}</p>
                        <p><strong>Lastname:</strong> {userData.lastname}</p>
                        <p><strong>Username:</strong> {userData.username}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <button className="edit-button" onClick={toggleEditing}>
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
