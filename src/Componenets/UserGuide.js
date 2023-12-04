import React, {useState} from 'react';
import {Card} from 'react-bootstrap';
import '../style/UserGuide.css'
import Navbar from "./Navbar";
import Logo from '../assets/mindlab.png';


const UserGuide = () => {


    return (
        <div>
            <Navbar/>
            <div className="guide-container">

                <Card
                    className='custom-card'
                    style={{
                        marginBottom: '20px',
                        width: '50%',
                        height: '700px',
                        border: '0 solid',
                        borderRadius: '20px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.7), 0 4px 8px rgba(0, 0, 0, 0.4)',

                    }}
                >
                    <Card.Img
                        variant="top"
                        src={Logo}
                        style={{
                            height: '240px',
                            objectFit: 'cover',
                            width: '100%',
                            border: '0 solid',
                            borderRadius: '20px'
                        }}
                    />
                    <Card.Body>
                        <Card.Title style={{textAlign: 'center'}}><b>User Guide</b></Card.Title>
                        <Card.Text style={{textAlign: 'center' , marginTop: '50px'}}>
                            Card Content
                        </Card.Text>
                    </Card.Body>
                </Card>

            </div>

        </div>

    )
};

export default UserGuide;



