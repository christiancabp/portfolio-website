import React, { useState } from 'react';
import './Navbar.scss';
import { images } from '../../constants';
import { HiMenuAlt4, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <nav className='app__navbar'>
      <div className='app__navbar-logo'>
        <img src={images.logo} alt='logo' />
        <img src={images.logo2} alt='' />
        <img src={images.logo3} alt='' />
        <img src={images.logo4} alt='' />
        <img src={images.logo5} alt='' />
      </div>
      <ul className='app__navbar-links'>
        {[
          'home',
          'about',
          'work',
          'skills',
          'three-scene',
          'testimonial',
          'contact',
        ].map((item) => (
          <li className='app__flex p-text' key={`link-${item}`}>
            <div />
            <a href={`#${item}`}>
              {item === 'three-scene' ? '3D Scene' : item}
            </a>
          </li>
        ))}
      </ul>
      <div className='app__navbar-menu'>
        <HiMenuAlt4 onClick={() => setToggle(true)} />
        {toggle && (
          <motion.div
            whileInView={{ x: [300, 0] }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            <HiX onClick={() => setToggle(false)} />
            <ul>
              {[
                'home',
                'about',
                'work',
                'skills',
                'three-scene',
                'testimonial',
                'contact',
              ].map((item) => (
                <li key={item}>
                  <a href={`#${item}`} onClick={() => setToggle(false)}>
                    {item === 'three-scene' ? '3D Scene' : item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
