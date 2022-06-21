let positionData = [];
let colorData = [];
let rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  rotateRange = 0;

let translateX = 0,
  translateY = 0,
  translateZ = 0;

let scaleX = 1,
  scaleY = 1,
  scaleZ = 1;

let orth_left = -1,
  orth_right = 1,
  orth_bottom = -1,
  orth_top = 1,
  orth_near = 1,
  orth_far = -1;

function main() {
  const canvas = document.querySelector('#gl-canvas');

  // Get WebGL rendering context
  let gl = canvas.getContext('webgl2');

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

  gl.enable(gl.DEPTH_TEST);

  createCube();

  const vColorLoc = gl.getAttribLocation(program, 'vColor');
  gl.enableVertexAttribArray(vColorLoc);
  const vPositionLoc = gl.getAttribLocation(program, 'vPosition');
  gl.enableVertexAttribArray(vPositionLoc);

  // Create color buffer, associate vColor attribute with color buffer
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);

  gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 4 * 4, 0);

  // Create position buffer, associate vPosition attribute with position buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

  gl.vertexAttribPointer(vPositionLoc, 3, gl.FLOAT, false, 3 * 4, 0);

  //Model View Matrix
  const view = mat4.create();
  mat4.translate(view, view, [translateX, translateY, translateZ]);
  mat4.rotate(view, view, toRadians(rotateRange), [rotateX, rotateY, rotateZ]);
  mat4.scale(view, view, [scaleX, scaleY, scaleZ]);
  const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
  gl.uniformMatrix4fv(uViewMatrix, false, view);

  // Projection Matrix
  const projection = mat4.create();
  mat4.ortho(
    projection,
    orth_left,
    orth_right,
    orth_bottom,
    orth_top,
    orth_near,
    orth_far
  ); // projection, left, right, bottom, top, near, far
  const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  gl.uniformMatrix4fv(uProjectionMatrix, false, projection);

  // Draw Triangles
  gl.drawArrays(gl.TRIANGLES, 0, 36);

  // Draw axis
  gl.drawArrays(gl.LINE_LOOP, 36, 6);

  // event listener
  document.getElementById('translate_x').onchange = function () {
    translateX = this.value;
    main();
  };
  document.getElementById('translate_y').onchange = function () {
    translateY = this.value;
    main();
  };
  document.getElementById('translate_z').onchange = function () {
    translateZ = this.value;
    main();
  };

  document.getElementById('slide_rotate').onchange = function () {
    rotateRange = parseInt(this.value);
    main();
  };
  document.getElementById('rotate_x').onchange = function () {
    rotateX = this.value;
    main();
  };
  document.getElementById('rotate_y').onchange = function () {
    rotateY = this.value;
    main();
  };
  document.getElementById('rotate_z').onchange = function () {
    rotateZ = this.value;
    main();
  };

  document.getElementById('scale_x').onchange = function () {
    scaleX = this.value;
    main();
  };
  document.getElementById('scale_y').onchange = function () {
    scaleY = this.value;
    main();
  };
  document.getElementById('scale_z').onchange = function () {
    scaleZ = this.value;
    main();
  };

  document.getElementById('slide_left').onchange = function () {
    orth_left = parseFloat(this.value);
    main();
  };
  document.getElementById('slide_right').onchange = function () {
    orth_right = parseFloat(this.value);
    main();
  };
  document.getElementById('slide_bottom').onchange = function () {
    orth_bottom = parseFloat(this.value);
    main();
  };
  document.getElementById('slide_top').onchange = function () {
    orth_top = parseFloat(this.value);
    main();
  };
  document.getElementById('slide_near').onchange = function () {
    orth_near = parseFloat(this.value);
    main();
  };
  document.getElementById('slide_far').onchange = function () {
    orth_far = parseFloat(this.value);
    main();
  };
}

window.onload = main;
