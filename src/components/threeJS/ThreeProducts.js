import React, { Component } from 'react';
import * as THREE from 'three';
// import * as dat from 'lil-gui'; // gui debugger
// import gsap from 'gsap';

import { AppWrap } from '../../wrapper';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class ThreeProducts extends Component {
  componentDidMount() {
    // scene
    this.scene = new THREE.Scene();

    // renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: false });
    this.renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.mount.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth * 0.8) / (window.innerHeight * 0.6),
      0.5,
      1000
    );
    this.camera.position.z = 10;
    this.camera.position.y = 2;

    // Test Box
    // const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
    // const boxMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    // });
    // this.cube = new THREE.Mesh(boxGeometry, boxMaterial);

    // Adding cube to scene
    // this.scene.add(this.cube);

    // ADDING GLTF format

    // gltf Loader
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      '../../../mandalorian_helmet/scene.gltf',
      (gltf) => {
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.position.y = -2;
        gltf.scene.position.x = 5;
        // gltf.scene.children[0].castShadow = true;        //Shadows not working for this 3D
        // gltf.scene.receiveShadow = true;
        // gltf.scene.castShadow = true;
        // this.scene.add(gltf.scene);
      },
      () => {
        // progress callback func
        console.log('Progressing!');
      },
      () => {
        // error callback func
        console.log('Cant load this Crap!');
      }
    );

    gltfLoader.load(
      '../../../boba_fett_helmet/scene.gltf',
      (gltf) => {
        gltf.scene.scale.set(0.5, 0.5, 0.5);
        gltf.scene.position.x = -5;
        gltf.scene.position.y = 1;
        // gltf.scene.children[0].castShadow = true;        //Shadows not working for this 3D
        // gltf.scene.receiveShadow = true;
        // gltf.scene.castShadow = true;
        this.scene.add(gltf.scene);
      },
      () => {
        // progress callback func
        console.log('Progressing!');
      },
      () => {
        // error callback func
        console.log('Cant load this Crap!');
      }
    );

    // Ambiant Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 20);

    this.scene.add(ambientLight);

    // Directional light

    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Call Animation function
    this.animation();

    // Render Scene
    this.renderer.render(this.scene, this.camera);

    // Orbit Controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Window resizing event handler
    window.addEventListener('resize', this.handleWindowResize);

    controls.update();
  }

  // Box animaton
  animation = () => {
    requestAnimationFrame(this.animation);
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    // this.scene.rotation.y += 0.003;

    this.renderer.render(this.scene, this.camera);
  };

  handleWindowResize = () => {
    this.camera.aspect = (window.innerWidth * 0.8) / (window.innerHeight * 0.6);
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6);
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div>
        <div>
          <h2 className='head-text'>
            The <span> Posibilities </span>
            are
            <br />
            Endless !
          </h2>
          <br />
        </div>
        <div
          ref={(mount) => {
            this.mount = mount;
          }}
        ></div>
      </div>
    );
  }
}

export default AppWrap(ThreeProducts, 'three-products');
