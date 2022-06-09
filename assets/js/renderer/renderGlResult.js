function vertexShader(gl) {
    // vertex shader source code
    var vertCode =
        `attribute vec3 coordinates;

        void main(void) {
          gl_Position = vec4(coordinates, 1.0);
        gl_PointSize = 10.0;
        }`;

    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);


    // Compile the vertex shader
    gl.compileShader(vertShader);

    return vertShader;
}

function fragmentShader(gl) {
    // fragment shader source code
    var fragCode =
        `void main(void) {
         gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
        }`;

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);

    // Compile the fragmentt shader
    gl.compileShader(fragShader);

    return fragShader;
}

function createCircle(scaleW = 1, scaleH = 1, offsetX = 0, offsetY = 0, offsetZ = 0) {
    let a = [];

    for (let i = 1; i <= 360; i++) {
        // const x = Math.sin(i) / (w);
        const x = Math.sin(i);
        const y = Math.cos(i);

        const finalX = (scaleW * x) + offsetX;
        const finalY = (scaleH * y) + offsetY;

        // console.log(finalX, finalY);
        // debugger;

        a.push(finalX, finalY);
    }
    // console.log(a);
    // debugger;
    return a;
}

function draw(gl, dots, mode = gl.POINTS) {
    const vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dots), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /*=========================Shaders========================*/
    // Create a shader program object to store
    // the combined shader program
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader(gl));
    gl.attachShader(shaderProgram, fragmentShader(gl));
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    /*======== Associating shaders to buffer objects ========*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    /*============= Drawing the primitive ===============*/

    // Clear the canvas
    // gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    // Draw the triangle
    gl.drawArrays(mode, 0, dots.length);
}

function drawShapes(gl, shapesArray) {
    for (const shape of shapesArray) {
        draw(gl, shape, gl.POINTS);
    }
}

export default (gl, dots, connections) => {
    return new Promise((res, rej) => {
        // console.log(gl);




        // Pass the vertex data to the buffer
        const positions = [];
        for (let d of dots) {
            let { x, y, r } = d;
            x = (x / window.innerWidth);
            y = (y / window.innerHeight);

            // console.log(x, y);
            // debugger;

            positions.push(x, y, (r - 2) / 10);

            // positions.push(createCircle(0.01, 0.01, x, y));
        }

        // debugger;
        // console.log(positions);
        const g = [];
        // for (const 

        // drawShapes(gl, positions);
        draw(gl, positions, gl.POINTS);

        // debugger;

        // console.log(positions);



        // Unbind the buffer







        res();
    });
}