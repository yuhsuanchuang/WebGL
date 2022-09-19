const vertices = [
  { x: -0.5, y: -0.5, z: 0.5 },
  { x: -0.5, y: 0.5, z: 0.5 },
  { x: 0.5, y: 0.5, z: 0.5 },
  { x: 0.5, y: -0.5, z: 0.5 },
  { x: -0.5, y: -0.5, z: -0.5 },
  { x: -0.5, y: 0.5, z: -0.5 },
  { x: 0.5, y: 0.5, z: -0.5 },
  { x: 0.5, y: -0.5, z: -0.5 },
];

const vertexColors = [
  { r: 0.0, g: 0.0, b: 0.0, a: 1 }, // black
  { r: 1.0, g: 0.0, b: 0.0, a: 1 }, // red
  { r: 1.0, g: 1.0, b: 0.0, a: 1 }, // yellow
  { r: 0.0, g: 1.0, b: 0.0, a: 1 }, // green
  { r: 0.0, g: 0.0, b: 1.0, a: 1 }, // blue
  { r: 1.0, g: 0.0, b: 1.0, a: 1 }, // magenta
  { r: 0.0, g: 1.0, b: 1.0, a: 1 }, // cyan
  { r: 1.0, g: 1.0, b: 1.0, a: 1 }, // white
];

const textureCord = [
  { x: 0, y: 0 }, // vertice 1
  { x: 1, y: 0 }, // 0
  { x: 1, y: 1 }, // 3
  { x: 0, y: 0 }, // 1
  { x: 1, y: 1 }, // 3
  { x: 0, y: 1 }, // 2
]; // https://ithelp.ithome.com.tw/articles/10260664 learn how to map texture coordinates

function createCube() {
  positionData = new Float32Array(42 * 3);
  colorData = new Float32Array(42 * 4);
  textureCordData = new Float32Array(42 * 2);

  quad(1, 0, 3, 2);
  quad(2, 3, 7, 6);
  quad(3, 0, 4, 7);
  quad(4, 5, 6, 7);
  quad(5, 4, 0, 1);
  quad(6, 5, 1, 2);

  const axes = [
    { x: 0, y: 0, z: 0 },
    { x: 100, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 100, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 100 },
  ];

  for (let i = 0; i < axes.length; ++i) {
    positionData[108 + 3 * i] = axes[i].x;
    positionData[108 + 3 * i + 1] = axes[i].y;
    positionData[108 + 3 * i + 2] = axes[i].z;
    colorData[144 + 4 * i] = vertexColors[7].r;
    colorData[144 + 4 * i + 1] = vertexColors[7].g;
    colorData[144 + 4 * i + 2] = vertexColors[7].b;
    colorData[144 + 4 * i + 3] = vertexColors[7].a;
    textureCordData[72 + 2 * i] = 0;
    textureCordData[72 + 2 * i + 1] = 0;
  }
}

function quad(a, b, c, d) {
  //vertex color assigned by the index of the vertex
  const indices = [a, b, c, a, c, d];

  for (let i = 0; i < indices.length; ++i) {
    positionData[18 * (a - 1) + 3 * i] = vertices[indices[i]].x;
    positionData[18 * (a - 1) + 3 * i + 1] = vertices[indices[i]].y;
    positionData[18 * (a - 1) + 3 * i + 2] = vertices[indices[i]].z;
    colorData[24 * (a - 1) + 4 * i] = vertexColors[a].r;
    colorData[24 * (a - 1) + 4 * i + 1] = vertexColors[a].g;
    colorData[24 * (a - 1) + 4 * i + 2] = vertexColors[a].b;
    colorData[24 * (a - 1) + 4 * i + 3] = vertexColors[a].a;
    textureCordData[12 * (a - 1) + 2 * i] = textureCord[i].x;
    textureCordData[12 * (a - 1) + 2 * i + 1] = textureCord[i].y;
  }
}
