import React from 'react';
import { BsLinkedin, BsGithub } from 'react-icons/bs';
// import { FaFacebookF } from 'react-icons/fa';

const SocialMedia = () => {
  return (
    <div className='app__social'>
      <div>
        <a href={'https://www.linkedin.com/in/christian-bermeo-679023185/'}>
          <BsLinkedin />
        </a>
      </div>
      <div>
        <a href={'https://github.com/christiancabp'}>
          <BsGithub />
        </a>
      </div>
    </div>
  );
};

export default SocialMedia;
