// InformationPage.js
import React, {useState} from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import '../style/LevelsDescription.css'
import Navbar from "./Navbar";

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
                        <p className="tab-text">Content for Tab 1 goes here.</p>
                    </Tab>
                    <Tab eventKey="tab2" title="Level Medium">
                        <p className="tab-text">Content for Tab 2 goes here.</p>
                    </Tab>
                    <Tab eventKey="tab3" title="Level Hard">
                        <p className="tab-text">Content for Tab 3 goes here.</p>
                    </Tab>
                    {/* Add more tabs as needed */}
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
