import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
//Controls

//Create scene
const scene = new THREE.Scene();
var timer = 0

//Get Canva
const myCanva = document.querySelector('#bg')
//Sizes
const width = myCanva.clientWidth;
const height = myCanva.clientHeight;
//Camera and render
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer(
  {
    canvas: myCanva,
    antialias: true
  }
);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width,height);
camera.position.setZ(10);



scene.background = new THREE.Color( 0x2f3542);


//Lights
const pointLight = new THREE.PointLight(0xffffff, 200, 1);
pointLight.position.set(10, 2, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(pointLight,ambientLight);
// const lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper);``


function addStar(){
  const geometry = new THREE.SphereBufferGeometry(0.1, 16, 16);
  var material = new THREE.MeshStandardMaterial({ color: 0xffffff});
  material = new THREE.MeshBasicMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry,material);

  const[x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// const spaceTexture = new THREE.TextureLoader().load('imgs/space.jpg');
// scene.background = spaceTexture;


//Geometry and Scene Objects
const geometry = new THREE.TorusBufferGeometry(4, 0.5, 2, 100);
const material = new THREE.MeshStandardMaterial({ color:0xffffff,wireframe:true });
const torus = new THREE.Mesh(geometry,material);
scene.add(torus);

//Sun
const sun = new THREE.Mesh(
  new THREE.SphereBufferGeometry(2, 32, 32),
  new THREE.MeshStandardMaterial({ color:0xe67e22}))
scene.add(sun);



var myPlanets = []
function addPlanets(){
  for(let i = 4; i < 10; i++)
  {
    let planetSize = Math.random()
    const planet = new THREE.Mesh(
      new THREE.SphereBufferGeometry(planetSize, 32, 32),
      new THREE.MeshStandardMaterial({color: Math.random() * 0xffffff })
    )
    var radFromCenter = i + 10*planetSize;
    const newPlanetObj ={planetMesh:planet,
                  speed : Math.random() / 2,
                  position : new THREE.Vector3(radFromCenter,0,0),
                  radFromCenter : radFromCenter}
    myPlanets.push(newPlanetObj)
  }
}
function planetsInit(){
  for(let i = 0; i < myPlanets.length; i++){
    myPlanets[i].planetMesh.position.x = myPlanets[i].position.x
    scene.add(myPlanets[i].planetMesh)
  }
}

function planetsUpdate(){
  for(let i = 0; i < myPlanets.length; i++){
    myPlanets[i].planetMesh.position.x = Math.cos(timer * myPlanets[i].speed) *  myPlanets[i].radFromCenter
    myPlanets[i].planetMesh.position.z = Math.sin(timer * myPlanets[i].speed) * myPlanets[i].radFromCenter
  }
}
addPlanets();
planetsInit();

animate();
function animate() {
  requestAnimationFrame(animate);
  planetsUpdate();
  timer += 0.1
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  renderer.render(scene, camera);
}

const controls = new OrbitControls(camera, renderer.domElement);
