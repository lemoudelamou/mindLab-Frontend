// InformationPage.js
import React, {useState} from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import '../../style/LevelsDescription.css'
import Navbar from "../Navbar/Navbar";

const LevelsDescription = () => {
    const [activeTab, setActiveTab] = useState('tab1');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="hp1-back">
            <Navbar/>
            <h1 style={{marginTop: '150px', textAlign: 'center', color: '#fff'}}>Levels Description</h1>
            <div className="tab-content-container">
                <Tabs
                    id="information-tabs"
                    activeKey={activeTab}
                    onSelect={(tab) => handleTabChange(tab)}
                    className="mb-3"
                    style={{margin: '50px', border: '2px solid #fff', backgroundColor: '#fff'}}
                >

                    <Tab eventKey="tab1" title="Level Easy">
                        <h2 style={{color: '#000000', marginBottom: '-230px'}}>No Color blindness</h2>
                        <p className="tab-text">In this level, the task involves observing a shape whose background color alternates
                            between two distinct colors. To progress through the level successfully, the patient needs to press the
                            space bar at the precise moment when a specific color is displayed. Pressing the spacebar when the correct
                            color appears is counted as a correct answer, while pressing it when the other color is present is considered
                            an incorrect response. This level challenges the player's timing and observation skills, making the game more
                            engaging and interactive.</p>
                        <h2 style={{color: '#000000',  marginBottom: '-230px'}}>Color blindness</h2>
                        <p className="tab-text">In this level, the task involves observing a shape whose background color alternates between two distinct colors,
                            blue and yellow. To progress through the level successfully, the patient needs to press the spacebar at the precise
                            moment when the blue color is displayed. Pressing the space bar when the blue color appears is counted as a correct answer,
                            while pressing it when the yellow color is present is considered an incorrect response. This level challenges the player's
                            timing and observation skills, making the game more engaging and interactive. Please note that this adjustment accommodates
                            individuals with color blindness, ensuring an inclusive gaming experience.</p>

                    </Tab>
                    <Tab eventKey="tab2" title="Level Medium">
                        <h2 style={{color: '#000000', marginBottom: '-230px'}}>No Color blindness</h2>
                        <p className="tab-text">In this level, the task involves observing a shape whose background color alternates among three distinct colors.
                            To progress through the level successfully, the player needs to press the space bar at the precise moment when a specific color is displayed.
                            Pressing the spacebar when the correct color appears is counted as a correct answer, while pressing it when either of the other two colors is
                            present is considered an incorrect response. This level challenges the player's timing and observation skills with the added complexity of three colors,
                            making the game more engaging and interactive.</p>
                        <h2 style={{color: '#000000', marginBottom: '-230px'}}>Color blindness</h2>
                        <p className="tab-text">In this level, the task involves observing a shape that randomly changes between three distinct shapes: square, circle and rectangle
                            and two colors: yellow and blue . To progress through the level successfully, the patient needs to press the spacebar at the precise moment when the
                            current shape color is blue. Pressing the space bar when the shape color is blue, it is counted as a correct answer, while pressing it when the shape color is yellow, it
                            is considered an incorrect response. This level challenges the patient's timing and observation skills, as the shape changes randomly between the two,
                            making the game more engaging and interactive. Please note that this adjustment accommodates individuals with color blindness, ensuring an inclusive
                            gaming experience.</p>
                    </Tab>
                    <Tab eventKey="tab3" title="Level Hard">
                        <p className="tab-text">In this challenging level, the task involves observing a shape whose background color alternates among three distinct colors.
                            To successfully navigate the level, the player must press the space bar at the precise moment when the current color represents the correct answer.
                            Pressing the space bar when the correct color appears is counted as a correct answer, while pressing it when the background is one of the other two
                            colors is considered an incorrect response. Adding to the difficulty, the shape changes randomly each time the color shifts, requiring the patient
                            to demonstrate advanced timing and observation skills. This level poses a formidable challenge, making the test more intense and demanding.</p>
                    </Tab>
                </Tabs>
            </div>

            {/* Additional content based on the selected tab */}
            {activeTab === 'tab1' && <p>Additional content for Tab 1.</p>}
            {activeTab === 'tab2' && <p>Additional content for Tab 2.</p>}
            {activeTab === 'tab3' && <p>Additional content for Tab 3.</p>}

        </div>
    );
};

export default LevelsDescription;
