const vertices = [
  {
    position: { x: 0, y: 0, z: 0 },
    color: { r: 1, g: 0, b: 0, a: 1 },
  },
  {
    position: { x: 0, y: 0.5, z: 0 },
    color: { r: 0, g: 1, b: 0, a: 1 },
  },
  {
    position: { x: 0.5, y: 0, z: 0 },
    color: { r: 0, g: 0, b: 1, a: 1 },
  },
];

function main() {
  const canvas = document.querySelector('#gl-canvas');

  // Get WebGL rendering context
  let gl = canvas.getContext('webgl2');

  // specifies the affine transformation of x and y from normalized device coordinates to window coordinates.
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Get vertex shader src
  const vertexShaderSrc = document.getElementById('vertex-shader');

  // Get fragment shader src
  const fragmentShaderSrc = document.getElementById('fragment-shader');

  // Create WebGL program
  const program = createProgram({
    gl,
    vertexShaderSrc: vertexShaderSrc.text,
    fragmentShaderSrc: fragmentShaderSrc.text,
  });
  gl.useProgram(program);

  // Create color buffer, associate vColor attribute with color buffer
  let colorData = new Float32Array(vertices.length * 4);
  vertices.forEach((vertex, i) => {
    colorData[4 * i] = vertex.color.r;
    colorData[4 * i + 1] = vertex.color.g;
    colorData[4 * i + 2] = vertex.color.b;
    colorData[4 * i + 3] = vertex.color.a;
  });

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);

  const vColorLoc = gl.getAttribLocation(program, 'vColor');
  gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColorLoc);

  // Create position buffer, associate vPosition attribute with position buffer
  let positionData = new Float32Array(vertices.length * 3);
  vertices.forEach((vertex, i) => {
    positionData[3 * i] = vertex.position.x;
    positionData[3 * i + 1] = vertex.position.y;
    positionData[3 * i + 2] = vertex.position.z;
  });
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

  const vPositionLoc = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPositionLoc, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPositionLoc);

  // Model Matrix
  let model = mat4.create();
  // translate, rotate, scale...
  const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
  gl.uniformMatrix4fv(uModelMatrix, false, model);

  // View Matrix
  let view = mat4.create();
  mat4.lookAt(view, [0, 0, 1], [0, 0, 0], [0, 1, 0]); // eye, center, up
  const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
  gl.uniformMatrix4fv(uViewMatrix, false, view);

  // Projection Matrix
  const projection = mat4.create();
  mat4.ortho(projection, -1, 1, -1, 1, -1, 1); // projection, left, right, bottom, top, near, far
  const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  gl.uniformMatrix4fv(uProjectionMatrix, false, projection);

  // Draw Triangle
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

window.onload = main;
