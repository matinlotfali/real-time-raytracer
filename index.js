
var canvas;
var gl;

var lightPositionLoc;
var lightPosition = vec4(1.0,1.0,1.0, 1.0 );

var spherePositionLoc;
var spherePosition = vec4(0.0,0.0,0.0, 1.0 );

var TIME = 0.0 ; // Realtime
var prevTime = 0.0 ;
var resetTimerFlag = true ;
var animFlag = false ;

var RX = 2 ;
var RY = 2 ;
var RZ = 3 ;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL 2.0 isn't available" ); }

    // Four Vertices

    var vertices = [
        vec2( -1, -1 ),
        vec2(  -1,  1 ),
        vec2(  1, 1 ),
        vec2( 1, -1)
    ];


     //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variable with our data buffer

    var aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( aPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray(aPosition);

    
    
    document.getElementById("sliderXi").oninput = function() {
        RX = this.value ;
        window.requestAnimFrame(render);
    }
    
    document.getElementById("sliderYi").oninput = function() {
        RY = this.value;
        window.requestAnimFrame(render);
    };
    document.getElementById("sliderZi").oninput = function() {
        RZ =  this.value;
        window.requestAnimFrame(render);
    };

    document.getElementById("animToggleButton").onclick = function() {
        if( animFlag ) {
            animFlag = false;
        }
        else {
            animFlag = true  ;
            resetTimerFlag = true ;
            window.requestAnimFrame(render);
        }
        console.log(animFlag) ;
    };

    lightPositionLoc = gl.getUniformLocation(program, "lightPosition")

    spherePositionLoc = gl.getUniformLocation(program, "spherePosition")

     render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    var curTime ;
    if( animFlag )
    {
        curTime = (new Date()).getTime() /1000 ;
        if( resetTimerFlag ) {
            prevTime = curTime ;
            resetTimerFlag = false ;
        }
        TIME = TIME + curTime - prevTime ;
        prevTime = curTime ;
    }

    lightPosition = vec4(RX,RY,RZ,1.0);

    spherePosition = vec4(Math.cos(TIME * 2.1)*2, Math.sin(TIME)*2, 4.0, 1.0);

    gl.uniform4fv( lightPositionLoc,flatten(lightPosition) );
    gl.uniform4fv( spherePositionLoc,flatten(spherePosition) );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    
    if( animFlag )
        window.requestAnimFrame(render);
}