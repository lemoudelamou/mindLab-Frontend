import React from 'react';
import '../style/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import mindLab from '../assets/mindlab.png';
import Logo from '../assets/mindlab.png';
import Person from '../assets/person.png';
import Settings from '../assets/settings.png';
import Experience from '../assets/experience.png';





function Home() {
  return (
    <div className='home-container'>
      {/* Banner Section */}
      <div className="banner-section">
          <div className="first-part">
            <div className="logo-container">
              {/* Include your logo image here */}
              <img src={mindLab} alt="MindLab Logo" className="logo-img" />
            </div>
            <h1 className="home-title">"React, Reflect, Uncover: Exploring Minds Through Time"</h1>
            {/* Add any additional content or styling for this section */}
        </div>
      </div>

      {/* White Box with Carousel */}
      <div className="white-box">
          <div className="carousel-container">
            <Carousel>
              <Carousel.Item>
                <img className="d-block w-100" src={Logo} alt="First slide" />
                <Carousel.Caption>
                  <h2>Container 1 Title</h2>
                  <p>Container 1 text goes here.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src={Logo} alt="Second slide" />
                <Carousel.Caption>
                  <h2>Container 2 Title</h2>
                  <p>Container 2 text goes here.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img className="d-block w-100" src={Logo} alt="Third slide" />
                <Carousel.Caption>
                  <h2>Container 3 Title</h2>
                  <p>Container 3 text goes here.</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
        </div>
      </div>

      {/* Light Gray Box with Three Sections */}
      <div className="light-gray-box">
        <div className="section">
        <img className="d-block w-100" src={Person} alt="First slide" />
          <h4>Patient's personal details</h4>
          <p className='section-text'>The patient is asked to fill in the form with his/her personal information.</p>
        </div>
        <div className="section">
        <img className="d-block w-100" src={Settings} alt="First slide" />
          <h4>Set the experiment Parameters</h4>
          <p className='section-text'>The test supervisor defines the parameters of the experiment according to the nature of the results he wants to achieve.</p>
        </div>
        <div className="section">
        <img className="d-block w-100" src={Experience} alt="First slide" />

          <h4>Perform the experiment</h4>
          <p className='section-text'>Finally, the patient is asked to read the instructions and then carry out the experiment.</p>
        </div>
      </div>

      {/* transparent Box */}
      <div className="transparent-box">
        <h1 className='bottom-text'>"Unlocking Minds, Timing Reactions: The Essence of Psychological Experiments."</h1>
      </div>


    </div>
  );
}

export default Home;
