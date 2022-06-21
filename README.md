# WebGL Notes

WebGL enables web content to use an API based on **OpenGL ES** (version 3.0 for WebGL2) to perform 2D and 3D rendering in an HTML canvas in browsers that support it without the use of plug-ins. 

### Shaders
Written using the OpenGL ES Shading Language (GLSL). 
There are two shader functions run when drawing WebGL content: 
   - **Vertex Shader**: Transform vertices from object space to [clip space](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection#clip_space) coordinate system.
   - **Fragment Shader**: Compute a color for a pixel.

#### 4 ways a shader can receive data.
  1. **Attributes and Buffers**: Attributes serve as containers for the data that travels from JavaScript into the shader programs. Buffers are the pipes that connect JavaScript to those containers.
  2. **Uniforms**: global variables you set before you execute your shader program.
  3. **Textures**: arrays of data you can randomly access in your shader program. The most common thing to put in a texture is image data but textures are just data and can just as easily contain something other than colors.
  4. **Varyings**: a way for a vertex shader to pass data to a fragment shader.

![image](https://user-images.githubusercontent.com/21137152/173292705-87e35df5-957c-4330-8580-ed7979679ce2.png)

![image](https://user-images.githubusercontent.com/21137152/173796300-58425551-9748-4142-bf06-6259d2c522cc.png)

 ([Precision: lowp, medium, highp](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#be_precise_with_glsl_precision_annotations))


<details><summary>Vertex shader example</summary>

```
#version 300 es

in vec3 position;
in vec4 color;

uniform float size;

out lowp vec4 vColor;

void main(void) {
    gl_PointSize = size;
    gl_Position = vec4(position, 1.0);
    vColor = color;
}
```
</details>


<details><summary>Fragment shader example</summary>

```
#version 300 es
precision mediump float;

in lowp vec4 vColor;

out lowp vec4 outColor;

void main(void) {
    outColor = vColor;
}
```
</details>

---

### Create a simple WebGL program
1. Create a HTML canvas element
2. Get WebGL rendering context and create a WebGL program
    ```js
    const gl = canvas.getContext('webgl2');
    const program = gl.createProgram();
    ```
3. Link program with compiled shaders
    ```js
    // Create shader
    const shader = gl.createShader(shaderType);
    
    // Set GLSL source
    gl.shaderSource(shader, source);
    
    // Compile shader
    gl.compileShader(shader);
    
    // Attach to program
    gl.attachShader(program, shader);
    
    // Link program
    gl.linkProgram(program);
    ```
4. Bind attributes with data buffers and set uniforms
    ```js
    // Get attribute location (index) in the program
    const vPositionLoc = gl.getAttribLocation(program, 'vPosition');
    
    // Attributes are disabled by default, need to enable attributes so that they can be used
    gl.enableVertexAttribArray(vPositionLoc);
    
    // Create buffer and bind buffer with data
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
    
    // Binds the buffer currently bound to gl.ARRAY_BUFFER to a generic vertex attribute of the current vertex buffer object and specifies its layout
    // (attribute index, size, type, normalized, stride, offset)
    gl.vertexAttribPointer(vPositionLoc, 3, gl.FLOAT, false, 0, 0); 
    ```
    ```js
    // Get uniform location (index) in the program
    const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
    
    // Set a 4-component floats matrix to the target uniform
    gl.uniformMatrix4fv(uViewMatrix, false, matrix); // uniform location, transpose, value
    ```
5. Draw (gl.drawArrays, gl.drawElements ...)
    Draw a triangle
    ```js
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    ```
    
    Draw a square with shared vertices
    ```js
    const indexBuffer = gl.createBuffer();
    // make this buffer the current 'ELEMENT_ARRAY_BUFFER'
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);  
    const indices = [
      0, 1, 2, // first triangle
      2, 1, 3, // second triangle
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    ```

---

### Object Transformation - Model View Projection Matrices (MVP)
A transformation pipeline converts each drawing vertex into the clip space (-1 to 1 on every axis). 
- **Model matrix**: Defines **translation**, **rotation**, and **scale** of the model vertices.
- **View matrix**: Defines position and orientation of the "camera".
   ```js
   mat4.translate(receive_matrix, matrix_to_translate, translate_vector);
   mat4.rotate(receive_matrix, matrix_to_rotate, raduan, axis);
   mat4.scale(receive_matrix, matrix_to_scale, scale_vector);
   ```
- **Projection matrix**: Maps what the "camera" sees to the clip space.
    - [Perspective projection](http://learnwebgl.brown37.net/08_projections/projections_perspective.html): 
    ```js
    mat4.perspective(matrix, fovy, aspect, near, far);
    ```
    - [Orthographic projection](http://learnwebgl.brown37.net/08_projections/projections_ortho.html): 
    ```js
    mat4.ortho(matrix, left, right, bottom, top, near, far);
    ```

(Library [gl-matrix](https://glmatrix.net/): A Javascript Matrix and Vector library for High Performance WebGL apps)
