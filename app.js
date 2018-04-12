//handler
let scene;
let camera=[];
let controls=[];
let renderer;
//objetos
let isla;
let islaCollider;
let grua = [];
let contenedor = [];
let barcoModelo;
let water;
let box;

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

//Inicializar fisicas
Physijs.scripts.worker = 'physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

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


  scene = new Physijs.Scene;
  scene.setGravity(new THREE.Vector3(0, -9, 0))

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
	directionalLight.position.set( - 1, 1, 1 );
	scene.add( directionalLight );


  for (let j = 0; j < 1; j++){
    contenedor[j] = new Physijs.BoxMesh(
      new THREE.CubeGeometry(2,2,4),
      new THREE.MeshPhongMaterial({color:0xfff}), 10
    )
    contenedor[j].position.y = 40;
    contenedor[j].position.x = 15*j + 15;
    scene.add(contenedor[j]);
  }


  //load assets
  let loader = new THREE.ColladaLoader();
  //isla
  loader.load( './Objetos/Isla/isla.dae', function (collada) {
    let model = collada.scene;
    //isla = new Physijs.ConvexMesh(model.children[0].geometry, model.children[0].material);
    isla = model;
    isla.scale.add(new THREE.Vector3(10, 10, 10));
    islaCollider = new Physijs.BoxMesh(
      new THREE.CubeGeometry(90, 30, 110),
      new THREE.MeshBasicMaterial({ color: 0x000, visible: false }), 0
    );
    islaCollider.position.y = 15.4;
    islaCollider.position.x = 12;
    scene.add(islaCollider)
    scene.add(isla)
  });
  //Grua Carro
  loader.load( './Objetos/carro.dae', function (collada) {
    let model = collada.scene;
    grua[0] = model;
    grua[0].position.y = 0;
    central = new Physijs.BoxMesh(
  			new THREE.CubeGeometry( 5.2, 0.55, 5 ),
  			new THREE.MeshBasicMaterial({ color: 0x888888, visible: false })
  	);
    central.position.y = 31.5;

    //grua[0].rotation.z += 2.355;

    camera[1].position.x = grua[0].position.x - 12;
    camera[1].position.y = grua[0].position.y + 12;
    camera[1].position.z = grua[0].position.z - 5;

    var x = camera[1].position.x;
    var y = camera[1].position.y;
    var z = camera[1].position.z;

    //collider.add(grua[0]);

    /*
    let t = 3.14/1.5

    camera[1].position.y =  y * Math.cos(t) - z * Math.sin(t);
    camera[1].position.z =  y * Math.sin(t) + z * Math.cos(t);
    */

    controls[1].target = new THREE.Vector3(grua[0].position.x, grua[0].position.y + 2, grua[0].position.z);
    central.add(grua[0])
    central.add(camera[1]);
    scene.add(central);
  });
  //plano
  suelo = new Physijs.BoxMesh(
    new THREE.CubeGeometry(1000, 0.5, 1000),
    new THREE.MeshBasicMaterial({ color: 0xfff, visible: false }),
    0
  );
  suelo.position.y = 22
  scene.add(suelo);

  loader.load( './Objetos/palo.dae', function (collada) {
    let model = collada.scene;
    grua[1] = model;
    grua[1].position.y = 0;

    palo.add(grua[1])
    central.add(palo);
  });

  loader.load( './Objetos/paloInterno.dae', function (collada) {
    let model = collada.scene;
    grua[2] = model;
    grua[2].position.y = 0

    paloInterno.add(grua[2])
    palo.add(paloInterno);
  });

  loader.load( './Objetos/horizontal.dae', function (collada) {
    let model = collada.scene;
    grua[3] = model;
    grua[3].position.y = 0

    grua[4] = new Physijs.BoxMesh(
        new THREE.CubeGeometry( 1.5, 1.5, 1.5 ),
        new THREE.MeshBasicMaterial({ color: 0xfff }), 10
    );
    grua[4].addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
      // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
      console.log("asdasdasdasdas");
      for (let j = 0; j < contenedor.length; j++){
        if (other_object == contenedor[j]){
          console.log("Colision");
          central.add(other_object);
        }
      }
    });

    grua[4].position.y += 5;
    grua[4].position.x += 5;

    horizontal.add(grua[3]);
    horizontal.add(grua[4])
    paloInterno.add(horizontal);
  });





  //BARCO
  loader.load( './Objetos/barco2.dae', function (collada) {
    let model = collada.scene;

    barcoModelo = model;
    barcoModelo.position.y = 3;
    barcoModelo.position.x = 0;
    barcoModelo.rotateZ(3.14/2);
    barcoModelo.scale.add(new THREE.Vector3(12, 12, 12))

    //barcoModelo.material = new THREE.MeshPhongMaterial( { map: barcoModelo.material.map } );

    camera[2].position.x = barcoModelo.position.x;
    camera[2].position.y = barcoModelo.position.y + 12;
    camera[2].position.z = barcoModelo.position.z + 35;

    controls[2].target = new THREE.Vector3(barcoModelo.position.x, barcoModelo.position.y + 2, barcoModelo.position.z);


    barco = new Physijs.ConvexMesh(
      new THREE.CubeGeometry(8, 3, 48),
      new THREE.MeshBasicMaterial({ color: 0x888888, visible: false }),
      100000
    );

    barco.position.y = -3

    barco.add(barcoModelo);
    barco.add(camera[2]);

    barco.translateX(-38);
    barco.translateY(28);

    scene.add(barco);
  });

  //AGUA
  let waterGeometry = new THREE.PlaneBufferGeometry(750,750);

	water = new THREE.Water( waterGeometry, {
    waterNormals: new THREE.TextureLoader().load('waternormals.jpg', function(texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWraping;
    }),
    alpha: 0.5,
		color: '#a2f9ff',
		scale: 1,
		textureWidth: 512,
		textureHeight: 512
	} );

	water.position.y = 25;
	water.rotation.x = Math.PI * - 0.5;
	scene.add( water );


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
    inclination: 0.49, // elevation / inclination
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

    //renderer.render( scene, camera );

  }

  guiChanged();
}


function render() {
  //mirrorCamera.updateCubeMap( renderer, scene );
  renderer.render(scene, camera[i]);
}


function setTransforms() {

  central.__dirtyPosition = true;
  central.__dirtyRotation = true;
  central.setLinearVelocity(new THREE.Vector3(0, 0, 0));
  central.setAngularVelocity(new THREE.Vector3(0, 0, 0));

  grua[4].__dirtyPosition = true;
  grua[4].__dirtyRotation = true;
  grua[4].setLinearVelocity(new THREE.Vector3(0, 0, 0));
  grua[4].setAngularVelocity(new THREE.Vector3(0, 0, 0));


  barco.setLinearVelocity(new THREE.Vector3(0, 0, 0));
  barco.setAngularVelocity(new THREE.Vector3(0, 0, 0));
  //barco.rotation.y = 0;

}

var animate = function(){
  requestAnimationFrame(animate);
  //debug
  controls[i].update();
  water.material.uniforms.time.value += 1.0/60;

  setTransforms();
  scene.simulate();
  render();

}

animate();
