import React, { Component } from 'react';
import * as THREE from 'three';

import { AppWrap } from '../../wrapper';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './ThreeProduct.css';

let mixer = null;
class ThreeProducts extends Component {
  componentDidMount() {
    // scene
    this.scene = new THREE.Scene();

    // renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
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
    this.camera.position.y = 3;
    this.camera.position.x = -5;

    // Test Box
    // const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
    // const boxMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    // });
    // this.cube = new THREE.Mesh(boxGeometry, boxMaterial);

    // Adding cube to scene
    // this.scene.add(this.cube);

    // ADDING GLTF 3D format

    // gltf Loader
    const gltfLoader = new GLTFLoader();

    // Mandalorian Helmet
    // gltfLoader.load(
    //   '../../../mandalorian_helmet/scene.gltf',
    //   (gltf) => {
    //     gltf.scene.scale.set(4, 4, 4);
    //     gltf.scene.position.y = -4;
    //     // gltf.scene.children[0].castShadow = true;        //Shadows not working for this 3D
    //     // gltf.scene.receiveShadow = true;
    //     // gltf.scene.castShadow = true;
    //     this.scene.add(gltf.scene);
    //   },
    //   () => {
    //     // progress callback func
    //     console.log('Progressing!');
    //   },
    //   () => {
    //     // error callback func
    //     console.log('Cant load this Crap!');
    //   }
    // );

    // Lightsaber

    gltfLoader.load(
      '../../../pacman_arcade__animation/scene.gltf',
      (gltf) => {
        // console.log(gltf);
        console.log('Success!');
        gltf.scene.scale.set(0.15, 0.15, 0.15);
        // gltf.scene.position.x = ;
        gltf.scene.position.y = -5;

        mixer = new THREE.AnimationMixer(gltf.scene); // Animation handler
        const action = mixer.clipAction(gltf.animations[0]);

        // console.log(mixer);

        action.play();

        this.scene.add(gltf.scene);
      },
      () => {
        // progress callback func
        console.log('Loading 3D model!');
      },
      () => {
        // error callback func
        console.log('Cant load this Crap!');
      }
    );

    // Ambiant Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    this.scene.add(ambientLight);

    // Directional light

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // SPOT LIGHT
    // SpotLight(color, intentsity, distance, angle, penumbra, decay)

    const spotLight = new THREE.SpotLight(
      0xffffff,
      1,
      200,
      Math.PI * 0.2,
      0.25,
      1
    );
    spotLight.position.set(0, 20, 20);

    //changing spotlight target
    spotLight.target.position.x = -0.75;
    // const spotHelper = new THREE.SpotLightHelper(spotLight);

    this.scene.add(spotLight); // if  helper or target needed add it here

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

    // Updating Animation Mixer
    // console.log(mixer);

    if (mixer) {
      mixer.update(0.008);
    }

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
        <h4 className='head-text'>
          This <span>could</span> be <span> Your </span>
          <br />
          Product
        </h4>
      </div>
    );
  }
}

export default AppWrap(ThreeProducts, 'three-products');
