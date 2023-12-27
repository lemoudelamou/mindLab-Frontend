import React, { useState } from 'react';
import axios from 'axios';
import '../../style/Contact.css';
import Navbar from "../Navbar/Navbar"; // Import the CSS file for styling

const Contact = () => {
    const [formData, setFormData] = useState({
        email: '', // Replace with the sender's email
        fullname: '',
        subject: '',
        body: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8081/api/send', formData);
            console.log('Response:', response.data);
            alert('Email sent successfully!');

            // Clear the input fields on successful email sent
            setFormData({
                email: '',
                fullname: '',
                subject: '',
                body: '',
            });
        } catch (error) {
            console.error('Error sending email:', error);
            // ... (rest of the error handling code)
            alert('Failed to send email. Please check the console for details.');
        }
    };

    return (

        <div>
            <div className="contact-container">
            <Navbar/>
            <h2 className="contact-header">Contact Us</h2>

            <div className="contact-description">
                <p>Feel free to reach out to us with any questions or concerns, by using the contact form below.</p>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Your Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="fullname">Your Full Name:</label>
                <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="subject">Subject:</label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="body">Email Body:</label>
                <textarea
                    id="body"
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    required
                />

                <button className="contact-button" type="submit">Send Email</button>
            </form>
        </div>
        </div>
    );
};

export default Contact;
