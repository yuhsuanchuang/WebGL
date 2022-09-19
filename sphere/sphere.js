let scene, renderer, camera, controls;
let circle, point;

function main() {
  let gui = new dat.GUI();

  scene = new THREE.Scene();

  const canvas = document.querySelector('#gl-canvas');
  let gl = canvas.getContext('webgl2');

  renderer = new THREE.WebGLRenderer({ canvas, context: gl });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x21333d, 1.0);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 0, 40);
  camera.lookAt(scene.position);

  let pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(10, 10, 50);
  pointLight.intensity = 1;
  scene.add(pointLight);

  const light = gui.addFolder('Light');
  light.add(pointLight.position, 'x').min(-10).max(10).step(0.1);
  light.add(pointLight.position, 'y').min(-10).max(10).step(0.1);
  light.add(pointLight.position, 'z').min(-10).max(50).step(0.1);
  light.add(pointLight, 'intensity').min(-10).max(10).step(0.1);

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  scene.add(pointLightHelper);

  let geometry = new THREE.SphereGeometry(10, 50, 50);
  let material = new THREE.MeshPhongMaterial();

  material.map = new THREE.TextureLoader().load('earth.jpeg');
  material.bumpMap = new THREE.TextureLoader().load('bump.jpeg');
  material.bumpScale = 1;

  circle = new THREE.Mesh(geometry, material);
  circle.position.set(0, 0, 0);
  scene.add(circle);
}

function animate() {
  circle.rotation.x += 0.005;
  circle.rotation.y += 0.005;
}

function render() {
  animate();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

function setupAttributes(geometry) {
  const color = new THREE.Vector4(1, 1, 0, 1);

  var position = geometry.attributes.position;
  var colors = new Float32Array(position.count * 4);

  for (var i = 0, l = position.count; i < l; i++) {
    color.toArray(colors, i * 4);
  }

  geometry.addAttribute('color', new THREE.BufferAttribute(colors, 4));
}

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

main();
render();
