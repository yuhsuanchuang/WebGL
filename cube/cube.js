let positionData = [],
  colorData = [],
  textureCordData = [];

const rotation = {
  x: 1,
  y: 0,
  z: 1,
  degree: 20,
};

const translation = {
  x: 0,
  y: 0,
  z: 0,
};

const scaling = {
  x: 0.5,
  y: 0.5,
  z: 0.5,
};

const orthographic = {
  left: -1,
  right: 1,
  bottom: -1,
  top: 1,
  near: -1,
  far: 1,
};

// const perspective = {
//   fov: 30,
//   aspect: 1,
//   near: 4,
//   far: -10,
// };

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

  bindTextureBuffer(gl, program);
  addGUI();
  render(program, gl);
}

async function bindTextureBuffer(gl, program) {
  const image = await loadImage(
    'https://assets.juksy.com/files/articles/102073/800x_100_w-61a617165c7e8.jpg'
  );
  var texcoordAttributeLocation = gl.getAttribLocation(program, 'a_texcoord');
  // create the texcoord buffer, make it the current ARRAY_BUFFER
  // and copy in the texcoord values
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

  // Turn on the attribute
  gl.enableVertexAttribArray(texcoordAttributeLocation);

  // Tell the attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
  gl.vertexAttribPointer(
    texcoordAttributeLocation,
    2, // size: 2 components per iteration
    gl.FLOAT, // type: the data is 32bit floating point values
    false, // normalize: convert from 0-255 to 0.0-1.0
    0, // stride: 0 = move forward size * sizeof(type) each iteration to get the next texcoord
    0 // offset: start at the beginning of the buffer
  );

  gl.bufferData(gl.ARRAY_BUFFER, textureCordData, gl.STATIC_DRAW);

  // Create a texture.
  var texture = gl.createTexture();

  // Now that the image has loaded make copy it to the texture.
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.generateMipmap(gl.TEXTURE_2D);
}

function addGUI() {
  let gui = new dat.GUI();

  const translate = gui.addFolder('Translate');
  translate.add(translation, 'x').min(-10).max(10).step(1);
  translate.add(translation, 'y').min(-10).max(10).step(1);
  translate.add(translation, 'z').min(-10).max(10).step(1);

  const rotate = gui.addFolder('Rotate');
  rotate.add(rotation, 'x').min(-10).max(10).step(1);
  rotate.add(rotation, 'y').min(-10).max(10).step(1);
  rotate.add(rotation, 'z').min(-10).max(10).step(1);
  rotate.add(rotation, 'degree').min(0).max(360).step(1);

  const scale = gui.addFolder('Scale');
  scale.add(scaling, 'x').min(0).max(10).step(0.1);
  scale.add(scaling, 'y').min(0).max(10).step(0.1);
  scale.add(scaling, 'z').min(0).max(10).step(0.1);

  const ortho = gui.addFolder('Orthographic Projection');
  ortho.add(orthographic, 'left').min(-10).max(10).step(1);
  ortho.add(orthographic, 'right').min(-10).max(10).step(1);
  ortho.add(orthographic, 'bottom').min(-10).max(10).step(1);
  ortho.add(orthographic, 'top').min(-10).max(10).step(1);
  ortho.add(orthographic, 'near').min(-10).max(10).step(1);
  ortho.add(orthographic, 'far').min(-10).max(10).step(1);

  // const perspect = gui.addFolder('Perspective Projection');
  // perspect.add(perspective, 'fov').min(0).max(180).step(1);
  // perspect.add(perspective, 'aspect').min(-10).max(10).step(1);
  // perspect.add(perspective, 'near').min(-10).max(10).step(1);
  // perspect.add(perspective, 'far').min(-10).max(10).step(1);
}

function render(program, gl) {
  // Model Matrix
  const model = mat4.create();
  mat4.translate(model, model, [translation.x, translation.y, translation.z]);
  mat4.rotate(model, model, toRadians(rotation.degree), [
    rotation.x,
    rotation.y,
    rotation.z,
  ]);
  mat4.scale(model, model, [scaling.x, scaling.y, scaling.z]);
  const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
  gl.uniformMatrix4fv(uModelMatrix, false, model);

  // View Matrix
  const view = mat4.create();
  mat4.lookAt(model, [0, 0, 1], [0, 0, 0], [0, 1, 0]); // eye, center, up
  const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
  gl.uniformMatrix4fv(uViewMatrix, false, view);

  // Projection Matrix
  const projection = mat4.create();
  const { left, right, bottom, top, near, far } = orthographic;
  mat4.ortho(projection, left, right, bottom, top, near, far); // projection, left, right, bottom, top, near, far

  // Perspective projection
  // const { fov, aspect, near, far } = perspective;
  // mat4.perspective(projection, toRadians(fov), aspect, near, far);

  const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
  gl.uniformMatrix4fv(uProjectionMatrix, false, projection);

  // Draw Triangles
  gl.drawArrays(gl.TRIANGLES, 0, 36);

  // Draw axis
  gl.drawArrays(gl.LINE_LOOP, 36, 6);

  requestAnimationFrame(() => render(program, gl));
}

window.onload = main;
