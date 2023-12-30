import React, {useEffect, useState} from 'react';
import '../../style/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Card, Row, Col, Modal, Button} from 'react-bootstrap';
import  secureLocalStorage  from  "react-secure-storage";
import mindLab from '../../assets/mindlab.png';
import Logo from '../../assets/mindlab.png';
import Person from '../../assets/person.png';
import Settings from '../../assets/settings.png';
import Experience from '../../assets/experience.png';
import Navbar from "../../Components/Navbar/Navbar";
import MenuBar from "../../Components/Sidebar/Menubar";
import CardItem from "../../Components/Home/CardItem";


function DemoHome() {
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const currentMode = JSON.parse(secureLocalStorage.getItem('isDemoMode'));

    

    const cardsData = [
        {
            title: 'About the Project',
            content: <p>MindLab was developed with the aim of providing professionals in the field of psychology with a
                seamless and flexible environment for executing standardized and custom psychological tests. From
                cognitive ability tests to reaction tests, MindLab enables comprehensive assessment and data
                collection.</p>,
            imageSrc: Logo
        },
        {
            title: 'Benefits of the Application', content: (
                <div>
                    <p><b>Modularity:</b> Customize tests to specific research goals or clinical needs.</p>
                    <p><b>Data Integrity:</b> Ensure accurate and reliable data collection for qualitative analyses.</p>
                    <p><b>User-Friendliness:</b> Enjoy an intuitive user interface that requires no technical expertise.
                    </p>
                    <p><b>Privacy:</b> Ensure the protection and confidentiality of sensitive information with our
                        robust security protocols.</p>
                </div>), imageSrc: Logo
        },
        {
            title: 'Experiment Settings',
            content: <p>MindLab allows you to customize test parameters such as shape, color, and time intervals to
                conduct a variety of reaction time and decision-making tests. Using simple dropdown menus and sliders,
                you can control the difficulty and complexity of the tests.</p>,
            imageSrc: Logo
        },
        {
            title: 'Experiment Information',
            content: <p>Our detailed test descriptions and step-by-step instructions ensure a clear understanding of the
                testing procedures and goals. MindLab aims to meet the highest scientific standards while providing a
                user-friendly experience.</p>,
            imageSrc: Logo
        },

    ];


    useEffect(() => {
        // Calculate the maximum height among all cards
        const cards = document.querySelectorAll('.custom-card');
        let maxHeight = 0;

        cards.forEach((card) => {
            const cardHeight = card.clientHeight;
            if (cardHeight > maxHeight) {
                maxHeight = cardHeight;
            }
        });

        // Set the calculated height to all cards
        cards.forEach((card) => {
            card.style.height = `${maxHeight}px`;
        });
    }, []); // Run this effect only once, on mount

    return (
        <div className="hp-back">
            <div className='home-container'>
                <Navbar/>

                {/* Left-side Menu Bar */}
                <MenuBar currentMode={currentMode} />


                <div className="main-content">
                    {/* Banner Section */}
                    <div className="banner-section">
                        <div className="first-part">
                            <div className="logo-container">
                                {/* Include your logo image here */}
                                <img src={mindLab} alt="MindLab Logo" className="logo-img"/>
                            </div>
                            <div className="prin-title">
                                <h1 className="home-title">"React, Reflect, Uncover: Exploring Minds Through Time"</h1>
                            </div>
                            <div className="quoted-container">
                                <div className="quote-mark-up">“</div>
                                <blockquote className="quote-text">
                                    <p>MindLab is an avant-garde platform that provides psychologists and researchers
                                        with
                                        advanced tools for conducting, managing, and analyzing psychological tests. Our
                                        mission
                                        is to explore and understand the depth of the human mind through innovative
                                        technologies.</p>
                                </blockquote>
                                <div className="quote-mark-down">”</div>
                            </div>


                            {/* Add any additional content or styling for this section */}
                        </div>
                    </div>

                    {/* Row of Cards */}
                    <div className="white-box">
                        <Row xs={1} md={3} className="justify-content-center">
                            {cardsData.map((card, index) => (
                                <Col key={index} xs={12} md={6} lg={4}>
                                    <CardItem card={card}></CardItem>

                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Light Gray Box with Three Sections */}
                    <div className="light-gray-box">
                        <div className="section">
                            <img className="d-block w-100" src={Person} alt="First slide"/>
                            <h4>Patient's personal details</h4>
                            <p className='section-text'>The patient is asked to fill in the form with his/her personal
                                information.</p>
                        </div>
                        <div className="section">
                            <img className="d-block w-100" src={Settings} alt="First slide"/>
                            <h4>Set the experiment Parameters</h4>
                            <p className='section-text'>The test supervisor defines the parameters of the experiment
                                according
                                to the nature of the results he wants to achieve.</p>
                        </div>
                        <div className="section">
                            <img className="d-block w-100" src={Experience} alt="First slide"/>

                            <h4>Perform the experiment</h4>
                            <p className='section-text'>Finally, the patient is asked to read the instructions and then
                                carry
                                out the experiment.</p>
                        </div>
                    </div>

                    {/* transparent Box */}
                    <div className="transparent-box">
                        <h1 className='bottom-text'>"Unlocking Minds, Timing Reactions: The Essence of Psychological
                            Experiments."</h1>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DemoHome;
