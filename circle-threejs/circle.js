let scene, renderer, camera;
let circle, point;

function main() {
  scene = new THREE.Scene();

  const canvas = document.querySelector('#gl-canvas');
  let gl = canvas.getContext('webgl2');

  renderer = new THREE.WebGLRenderer({ canvas, context: gl });
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera = new THREE.OrthographicCamera(
    -window.innerWidth,
    window.innerWidth,
    window.innerHeight,
    -window.innerHeight,
    -100,
    100
  );

  // camera = new THREE.PerspectiveCamera(
  //   45,
  //   window.innerWidth / window.innerHeight,
  //   0.1,
  //   1000
  // );
  camera.position.set(0, 0, 40);
  camera.lookAt(scene.position);

  let pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(0, 0, 20);
  scene.add(pointLight);

  let geometry = new THREE.CircleGeometry(100, 60);
  let material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
  });
  circle = new THREE.Mesh(geometry, material);
  circle.position.set(0, 0, 0);
  scene.add(circle);

  // ring
  const ringGeometry = new THREE.RingGeometry(100, 102, 60);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
  });
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
  ringMesh.position.set(0, 0, 0);
  scene.add(ringMesh);

  ////////////////////////// custom shader
  geometry = new THREE.BufferGeometry();
  geometry.addAttribute(
    'position',
    new THREE.Float32BufferAttribute([500, 0, 0], 3)
  );
  // geometry = new THREE.BufferGeometry().fromGeometry(
  //   new THREE.CircleGeometry(10, 60)
  // );
  setupAttributes(geometry);
  material = new THREE.ShaderMaterial({
    // uniforms: {
    //   ...
    // },
    vertexShader: document.getElementById('vertex-shader').text,
    fragmentShader: document.getElementById('fragment-shader').text,
  });
  point = new THREE.Points(geometry, material);
  scene.add(point);

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

window.onload = main;
