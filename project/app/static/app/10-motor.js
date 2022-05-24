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

// ------ Global variables
let model, gridHelper

// ------ Renderer
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
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

// ------ Loading manager
const manager = new THREE.LoadingManager();
manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onLoad = function () {
    // Fade out using CSS class properties
    let loadingScreen = $('#loading-screen')
    loadingScreen.addClass('fade-out')
    console.log('Loading complete!');
    setTimeout(
        function () {
            loadingScreen.remove()
        }, 1000);
};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

manager.onError = function (url) {
    console.log('There was an error loading ' + url);
};

// ------ Load GLTF model
const loader = new GLTFLoader(manager)

loader.setPath('static/app/10-model/');
loader.load('scene.gltf', function (gltf) {
    model = gltf.scene;

    // Get model dimensions for outline cube and grid translation
    let bbox = new THREE.Box3().setFromObject(model);
    let modelSize = bbox.getSize(new THREE.Vector3());

    // Model outline cube
    let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
    // scene.add(helper);

    scene.add(model);
    render();

    // ------ Grid
    const size = 10;
    const divisions = 20;
    gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.position.y = -modelSize.y / 2
    scene.add(gridHelper);

}, undefined, function (error) {
    console.error(error);
});

// ------ Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enablePan = false;

{ // ------ Lighting
    const lightAmbient = new THREE.AmbientLight(0xdedede)
    lightAmbient.intensity = 7.5

    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-18, 2.6, 22);

    scene.add(lightAmbient, light);
}

// ------ Resize render if canvas size not as displayed
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

    // Responsive + scaling
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);

}

// ------ Action buttons

$('#btn-reset').on('click', function () {
    position_default(camera, controls)
})

$('#btn-side').on('click', function () {
    controls.autoRotate = false
    model.rotation.y = 0
    gsap.to(controls.object.position, {
        duration: 1,
        x: 3,
        y: 0,
        z: 0,
    });
})

$('#btn-back').on('click', function () {
    controls.autoRotate = false
    model.rotation.y = 0
    gsap.to(camera.position, {
        duration: 1,
        ease: "power4.out",
        x: 0,
        y: 0,
        z: -3,
    });
    gsap.to(camera.rotation, {
        duration: 1,
        ease: "power4.out",
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

function position_default(camera) {
    controls.autoRotate = true
    controls.autoRotateSpeed = -1.62
    gsap.to(camera.position, {
        duration: 2,
        ease: "power4.out",
        x: -1.8,
        y: 0.26,
        z: 2.2,
    });
}

function animate() {
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
    controls.update()
}

// ------ Initializations
position_default(camera, controls) // set the camera & controls to the default position
animate()