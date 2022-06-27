import React from 'react';
import { Navbar } from './components';
import { About, Footer, Header, Skills, Testimonial, Work } from './container';
import './App.scss';
import ThreeScene from './components/threeJS/ThreeScene';

const App = () => {
  return (
    <div className='app'>
      <Navbar />
      <Header />
      <About />
      <Work />
      <Skills />
      <div>
        <ThreeScene />
      </div>
      <Testimonial />
      <Footer />
    </div>
  );
};

export default App;
