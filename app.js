//handler
let scene;
let camera=[];
let controls=[];
let renderer;
//objetos
let isla;
let grua = [];
let central = new THREE.Group();
let palo = new THREE.Group();
let paloInterno = new THREE.Group();
let horizontal = new THREE.Group();
let i = 1;

//Macros
const T_FACTOR = 1;
const T_ROTATE = 0.1;
const T_SCALE =  0.01;
const T_SHEAR =  0.01;

//comenzar
init();

function init() {
  camera[0] = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
  camera[1] = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);

  controls[0] = new THREE.TrackballControls(camera[0]);
  controls[0].addEventListener('change', render);
  controls[1] = new THREE.TrackballControls(camera[1]);
  controls[1].addEventListener('change', render);
  camera[1].up = new THREE.Vector3(0,1,0);


  scene = new THREE.Scene();

  let lights = [];
	lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
	lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
	lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

	lights[ 0 ].position.set( 0, 200, 0 );
	lights[ 1 ].position.set( 100, 200, 100 );
	lights[ 2 ].position.set( - 100, - 200, - 100 );

	scene.add( lights[ 0 ] );
	scene.add( lights[ 1 ] );
	scene.add( lights[ 2 ] );

  //load assets
  let loader = new THREE.ColladaLoader();
  //isla
  loader.load( './Objetos/Isla/isla.dae', function (collada) {
    let model = collada.scene;
    isla = model;
    isla.scale.add(new THREE.Vector3(10, 10, 10));
    scene.add(isla)
  });
  //Grua Carro
  loader.load( './Objetos/carro.dae', function (collada) {
    let model = collada.scene;
    grua[0] = model;
    grua[0].position.y = 31.5;

    //grua[0].rotation.z += 2.355;

    camera[1].position.x = grua[0].position.x - 12;
    camera[1].position.y = grua[0].position.y + 12;
    camera[1].position.z = grua[0].position.z - 5;

    var x = camera[1].position.x;
    var y = camera[1].position.y;
    var z = camera[1].position.z;
    /*
    let t = 3.14/1.5

    camera[1].position.y =  y * Math.cos(t) - z * Math.sin(t);
    camera[1].position.z =  y * Math.sin(t) + z * Math.cos(t);
    */

    controls[1].target = new THREE.Vector3(grua[0].position.x, grua[0].position.y + 2, grua[0].position.z);
    central.add(grua[0]);
    central.add(camera[1]);
    scene.add(central);
  });

  loader.load( './Objetos/palo.dae', function (collada) {
    let model = collada.scene;
    grua[1] = model;
    grua[1].position.y = 31.5

    palo.add(grua[1])
    central.add(palo);
  });

  loader.load( './Objetos/paloInterno.dae', function (collada) {
    let model = collada.scene;
    grua[2] = model;
    grua[2].position.y = 31.5

    paloInterno.add(grua[2])
    palo.add(paloInterno);
  });

  loader.load( './Objetos/horizontal.dae', function (collada) {
    let model = collada.scene;
    grua[3] = model;
    grua[3].position.y = 31.5

    horizontal.add(grua[3])
    paloInterno.add(horizontal);
  });

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera[0].position.z = 100;

}

let onProgress = function ( xhr ) {
	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
};

let onError = function ( xhr ) { };

//Lsitener
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 13){
    i = (i + 1) % camera.length;
  } else if (i == 0) {
    freeControl(keyCode);
  } else if (i == 1){
    gruaControl(keyCode)
  }
  console.log(keyCode);
}


function render() {
  //mirrorCamera.updateCubeMap( renderer, scene );
  renderer.render(scene, camera[i]);
}



var animate = function(){
  requestAnimationFrame(animate);
  //debug
  controls[i].update();

  render();

}

animate();
