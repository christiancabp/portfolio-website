import React from 'react';
import { Navbar } from './components';
import { About, Footer, Header, Skills, Testimonial, Work } from './container';
import ThemeToggle from './components/ThemeToggle';
import './App.scss';

const App = () => {
  return (
    <div className='app'>
      {/* TEMP: moves into Navbar in Phase 6 */}
      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>
      <Navbar />
      <Header />
      <About />
      <Work />
      <Skills />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default App;
