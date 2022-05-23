import * as THREE from 'https://unpkg.com/three@0.140.2/build/three.module.js';
import * as TWEEN from 'https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.esm.js'


import {
    OrbitControls
} from "./OrbitControls.js";

import {
    GLTFLoader
} from "./GLTFLoader.js";

// import {
//     RGBELoader
// } from "./RGBELoader.js"


// ------ Renderer
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({
    canvas,
});

// ------ Camera
const fov = 50;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// ------ Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xAAAAAA);

const loader = new GLTFLoader().setPath('static/app/10-model/');
console.log(loader)

loader.load('scene.glb', function (gltf) {
    scene.add(gltf.scene);
    render();

}, undefined, function (error) {
    console.error(error);
});


// ------ Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enablePan = false;

// Check current camera position
controls.addEventListener("change", event => {
    // console.log('controls.object.position:', controls.object.position);
    // console.log('controls.object.rotation:', controls.object.rotation);
})


{ // Lighting
    const lightAmbient = new THREE.AmbientLight(0xdedede)
    lightAmbient.intensity = 7.5

    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-18, 2.6, 22);

    scene.add(lightAmbient, light);

}

// Cube parameters
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

// Function to create cubes
function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({
        color
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
}

// Create cubes
const cubes = [
    // makeInstance(geometry, 0x44aa88, 0),
    // makeInstance(geometry, 0x8844aa, -2),
    // makeInstance(geometry, 0xaa8844, 2),
];

// Resize render if canvas size not as displayed
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function render(time) {
    time *= 0.001; // convert time to seconds

    // Responsive + scaling
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, i) => {
        //const speed = .1 + i * .1;
        const speed = 0.1
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

$('#btn-reset').on('click', function () {
    position_default(camera, controls)
})

$('#btn-side').on('click', function () {
    gsap.to(controls.object.position, {
        duration: 1,
        x: 2.5,
        y: 0,
        z: 0,
    });
})

$('#btn-back').on('click', function () {
    gsap.to(camera.position, {
        duration: 1,
        x: 0,
        y: 0,
        z: -2.5,
    });
    gsap.to(camera.rotation, {
        duration: 1,
        x: 2.5,
        y: 0,
        z: 0,
    });
})

$('#btn-checkCam').on('click', function () {
    console.log('controls.object:', controls.object.position);
    console.log('camera.position:', camera.position);
    console.log('camera.rotation:', camera.rotation);
})

function animate(time) {
    // console.log('animate function')
    renderer.render(scene, camera)
    TWEEN.update(time)
    requestAnimationFrame(animate)
    controls.update()

}

function position_default(camera) {
    // gsap.to(camera.rotation, {
    //     duration: 2,
    //     x: -0.1,
    //     y: -0.7,
    //     z: -0.1,
    // });
    gsap.to(camera.position, {
        duration: 2,
        x: -1.8,
        y: 0.26,
        z: 2.2,
    });
}

// ------ Initializations
position_default(camera, controls) // set the camera & controls to the default position
requestAnimationFrame(render);
animate()