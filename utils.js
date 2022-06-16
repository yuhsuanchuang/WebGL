function getCompiledShader({ gl, source, shaderType }) {
  const shader = gl.createShader(shaderType);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!compiled && !gl.isContextLost()) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram({ gl, vertexShaderSrc, fragmentShaderSrc }) {
  const program = gl.createProgram();

  // Get compiled shaders
  const vertexShader = getCompiledShader({
    gl,
    source: vertexShaderSrc,
    shaderType: gl.VERTEX_SHADER,
  });
  const fragmentShader = getCompiledShader({
    gl,
    source: fragmentShaderSrc,
    shaderType: gl.FRAGMENT_SHADER,
  });

  // Attach and link shaders with program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked && !gl.isContextLost()) {
    alert(gl.getProgramInfoLog(program));
    return;
  }
  return program;
}

function toRadians(degrees) {
  return (degrees * 3.1415) / 180;
}
