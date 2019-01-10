let scene,
    camera,
    renderer,
    controls,
    loader,
    logoMaterial,
    logoMesh,
    albumMaterial,
    albumMesh,
    texture;

let stars,
    moon;

let width = window.innerWidth,
    height = window.innerHeight;

var colors = [0xFFB6C1, 0xC71585, 0xFF69B4];

init();
animate();
// Sets up the scene.
function init() {
  scene = new THREE.Scene();

  // Create a camera, zoom it out from the model a bit, and add it to the scene.
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.lookAt(scene.position);
  camera.position.z = 450;

// Create a renderer and add it to the DOM.
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  // Set the background color of the scene
  renderer.setClearColor(0x000000);
  renderer.shadowMap.enabled = true;

  // Add OrbitControls to pan around with the mouse.
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);

  // Create a light and adds it to the scene.
  const light = new THREE.DirectionalLight();
  light.position.set(200, 100, 200);
  light.castShadow = true;
  light.shadow.camera.left = -100;
  light.shadow.camera.right = 100;
  light.shadow.camera.top = 100;
  light.shadow.camera.bottom = -100;
  scene.add(light);

  // Load the logo into the mesh and add it to the scene.
  loader = new THREE.JSONLoader();
  loader.load( "models/pinkfloydlogo.json", function(geometry){
  logoMaterial = new THREE.MeshLambertMaterial({color: 0xFF1493});
  logoMesh = new THREE.Mesh(geometry, logoMaterial);
  scene.add(logoMesh);
  logoMesh.position.set(-5, 30, 130);
});

  // Load album text mesh and add it to the scene.
  loader = new THREE.JSONLoader();
  loader.load( "models/thedarksideofthemoon.json", function(geometry){
  albumMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
  albumMesh = new THREE.Mesh(geometry, albumMaterial);
  scene.add(albumMesh);
  albumMesh.position.set(0, -32, 130);
  // var morphTarget = albumMesh.scale.set(2, 2, 2);
  // albumMesh.scale.set(1, 1, 1);
  //
  // albumMesh.morphTarget[0] = morphTarget;
  // albumMesh.computeMorphNormals();
  // morphTargets: true;
  });

  drawStars();
  drawMoon();

  document.getElementById('space').appendChild(renderer.domElement);

 // Event listener for the onResize function.
  window.addEventListener('resize', onResize);


}

// Resizes the render when browser window changes size.
function onResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
// Updates the render as needed.
function animate() {
  requestAnimationFrame(animate);

  render();
}
// Renders the scene.
function render() {
  stars.rotation.x += 0.002;
  stars.rotation.y -= 0.005;
  moon.rotation.y += 0.006;
  renderer.render(scene, camera);

}

//Function that holds the properties of the Moon object.
function drawMoon() {
  moon = new THREE.Group();
  moon.rotation.set(0.3, 0.3, 0);
  scene.add(moon);

  //creates the spherical geometry (SphereGeometry is less smooth)
  const planetGeometry = new THREE.IcosahedronGeometry(100, 5);

  // old version, without texture
  // const planetMaterial = new THREE.MeshPhongMaterial({
  //   color: 0xC0C0C0,
  //   shading: THREE.FlatShading
  //   });

  //
  texture = new THREE.TextureLoader().load( 'textures/moon.jpg' );
  const planetMaterial = new THREE.MeshBasicMaterial({map: texture});
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  planet.castShadow = true;
  planet.receiveShadow = true;
  planet.position.set(0, 40, 0);
  moon.add(planet);

}

//Function that creates the Stars around the moon
function drawStars() {
  stars = new THREE.Group();
  scene.add(stars);
  const geometry = new THREE.TetrahedronGeometry(2, 2);

  for (let i = 0; i < 300; i ++) {
    const material = new THREE.MeshPhongMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      shading: THREE.FlatShading
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set((Math.random() - 0.5) * 1000,
                      (Math.random() - 0.5) * 1000,
                      (Math.random() - 0.5) * 1000);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    stars.add(mesh);
  }

  // $(document).mousemove(function(e) {
  //   var $width = ($(document).width())/(252 - 23);
  //   var $height = ($(document).height())/(253 - 2);
  //   var $pageX = parseInt(e.pageX / $width, 10) + 23;
  //   var $pageY = parseInt(e.pageY / $height, 10) + 2;
  //   colors = "(" + $pageX + "," + $pageY + "," + $pageX + ")";
  //   console.log(colors);
  // });
}
