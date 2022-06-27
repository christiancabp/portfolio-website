import React, { Component } from 'react';
import * as THREE from 'three';
import * as dat from 'lil-gui'; // gui debugger
import gsap from 'gsap';

import { AppWrap, MotionWrap } from '../../wrapper';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class ThreeScene extends Component {
  componentDidMount() {
    // Editor GUI
    const gui = new dat.GUI({ width: 400 });
    gui.close();

    // console.log(gui)

    const debugObject = {
      colorLight: 0x1e00ff,
      colorStars: 0x000000,
      spin: () => {
        console.log('spin');

        gsap.to(this.scene.rotation, {
          duration: 1,
          z: this.scene.rotation.z + 6,
        });
        controls.update();
      },
    };

    // Adding spin button
    gui.add(debugObject, 'spin').name('Do a spin! ');

    //Color GUI
    gui
      .addColor(debugObject, 'colorLight')
      .onChange(() => {
        console.log('color has changed!');
        spotLight.color.set(debugObject.colorLight);
      })
      .name('Spot light Color: ');

    // scene
    this.scene = new THREE.Scene();

    // renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.mount.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth * 0.8) / (window.innerHeight * 0.8),
      0.5,
      1000
    );
    this.camera.position.z = 80;
    this.camera.position.x = 80;
    this.camera.position.y = 60;

    // Test Box
    // const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    // const boxMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    // });
    // this.cube = new THREE.Mesh(boxGeometry, boxMaterial);

    // Adding cube to scene
    // this.scene.add(this.cube);

    // ADDING STAR FIGHTER GLTF format

    // gltf Loader
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      '../../../scene.gltf',
      (gltf) => {
        console.log(gltf);

        gltf.scene.scale.set(0.25, 0.25, 0.25);
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

    /**
     * Particles
     */

    // Geometry
    const count = 800;
    const positions = new Float32Array(count * 3);

    const objectsDistance = 400;

    for (let i = 0; i < count; i++) {
      // Creating random coordinates
      positions[i * 3 + 0] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] =
        objectsDistance * 0.5 - Math.random() * objectsDistance;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
      color: debugObject.colorStars,
      sizeAttenuation: true,
      size: 0.6,
    });

    //Particles
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);

    this.scene.add(particles);

    // Ambiant Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 4);

    this.scene.add(ambientLight);

    // Directional light

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
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

    const spotLight = new THREE.SpotLight(
      debugObject.colorLight,
      2,
      1000,
      Math.PI * 0.2,
      0.25,
      1
    );
    // SpotLight(color, intentsity, distance, angle, penumbra, decay)
    spotLight.position.set(50, 50, 30);
    //changing spotlight target
    // spotLight.target.position.x = -0.75;
    // const spotHelper = new THREE.SpotLightHelper(spotLight);

    this.scene.add(spotLight); // if  helper or target needed add it here

    // gui
    gui
      .add(spotLight, 'intensity')
      .min(0)
      .max(100)
      .step(0.01)
      .name('Spot light Intensity: ');

    //Color GUI
    gui
      .addColor(debugObject, 'colorStars')
      .onChange(() => {
        console.log('color has changed!');
        particlesMaterial.color.set(debugObject.colorStars);
      })
      .name('Stars Color: ');

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
    this.camera.aspect = (window.innerWidth * 0.8) / (window.innerHeight * 0.8);
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div>
        <div>
          <h2 className='head-text'>
            Excited about <span> 3D Animation </span>
            <br />
            Technologies &<span> The Metaverse</span>
          </h2>
          <br />
        </div>
        <div
          ref={(mount) => {
            this.mount = mount;
          }}
          className='app__three-canvas'
        ></div>
      </div>
    );
  }
}

export default AppWrap(MotionWrap(ThreeScene), 'three-scene', 'app__primarybg');
