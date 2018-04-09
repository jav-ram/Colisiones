//handler
let scene;
let camera=[];
let controls=[];
let renderer;
//objetos
let isla;
let grua = [];
let barcoModelo;
let water;

let central = new THREE.Group();
let palo = new THREE.Group();
let paloInterno = new THREE.Group();
let horizontal = new THREE.Group();
let barco = new THREE.Group();
let i = 2;

//Macros
const T_FACTOR = 1;
const T_ROTATE = 0.1;
const T_SCALE =  0.01;
const T_SHEAR =  0.01;

//comenzar
init();

function init() {
  camera[0] = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.1, 20000000);
  camera[1] = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.1, 20000000);
  camera[2] = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.1, 20000000);

  controls[0] = new THREE.TrackballControls(camera[0]);
  controls[0].addEventListener('change', render);
  controls[1] = new THREE.TrackballControls(camera[1]);
  controls[1].addEventListener('change', render);
  controls[2] = new THREE.TrackballControls(camera[2]);
  controls[2].addEventListener('change', render);


  scene = new THREE.Scene();

  var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
	directionalLight.position.set( - 1, 1, 1 );
	scene.add( directionalLight );


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

  //BARCO
  loader.load( './Objetos/barco2.dae', function (collada) {
    let model = collada.scene;
    barcoModelo = model;
    barcoModelo.position.y = 0;
    barcoModelo.position.x = 0;
    barcoModelo.rotateZ(3.14/2);
    barcoModelo.scale.add(new THREE.Vector3(12, 12, 12))

    //barcoModelo.material = new THREE.MeshPhongMaterial( { map: barcoModelo.material.map } );

    camera[2].position.x = barcoModelo.position.x;
    camera[2].position.y = barcoModelo.position.y + 12;
    camera[2].position.z = barcoModelo.position.z + 35;

    controls[2].target = new THREE.Vector3(barcoModelo.position.x, barcoModelo.position.y + 2, barcoModelo.position.z);


    barco.add(barcoModelo);
    barco.add(camera[2]);

    barco.translateX(-38);
    barco.translateY(28);

    scene.add(barco);
  });

  //AGUA
  let waterGeometry = new THREE.PlaneBufferGeometry(750,750);

	water = new THREE.Water( waterGeometry, {
		color: '#a2f9ff',
		scale: 1,
		flowDirection: new THREE.Vector2( 1, 1 ),
		textureWidth: 1024,
		textureHeight: 1024
	} );

	water.position.y = 25;
	water.rotation.x = Math.PI * - 0.5;
	scene.add( water );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  initSky();

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
  } else if (i == 2){
    barcoControl(keyCode);
  }
  console.log(keyCode);
}


function initSky() {

  // Add Sky
  sky = new THREE.Sky();
  sky.scale.setScalar( 450000 );
  scene.add( sky );

  // Add Sun Helper
  sunSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry( 20000, 16, 8 ),
    new THREE.MeshBasicMaterial( { color: 0xffffff } )
  );
  sunSphere.position.y = - 700000;
  sunSphere.visible = false;
  scene.add( sunSphere );

  /// GUI

  var effectController  = {
    turbidity: 10,
    rayleigh: 2,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.8,
    luminance: 1,
    inclination: 0.1931, // elevation / inclination
    azimuth: 0.25, // Facing front,
    sun: ! true
  };

  var distance = 400000;

  function guiChanged() {

    var uniforms = sky.material.uniforms;
    uniforms.turbidity.value = effectController.turbidity;
    uniforms.rayleigh.value = effectController.rayleigh;
    uniforms.luminance.value = effectController.luminance;
    uniforms.mieCoefficient.value = effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

    var theta = Math.PI * ( effectController.inclination - 0.5 );
    var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );

    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );

    sunSphere.visible = effectController.sun;

    uniforms.sunPosition.value.copy( sunSphere.position );

    renderer.render( scene, camera );

  }

  guiChanged();
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
