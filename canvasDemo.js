window.onload = init; // Wait for the page to load before we begin animation
var canvas;
var ctx;
var balls = [];
var num_balls = 20;

function init(){
  //get the canvas
  canvas = document.getElementById('cnv');
  // Set the dimensions of the canvas
  canvas.width = 900;
  canvas.height = 600 ;
  canvas.style.marginTop = canvas.height * 0.08 + 'px';
  canvas.style.marginBottom = canvas.height * 0.08 + 'px';
  canvas.style.marginRight = canvas.width * 0.08 + 'px';
  canvas.style.marginLeft = canvas.width * 0.08 + 'px';
  canvas.style.border = 'solid black 2px';
  canvas.style.backgroundColor = 'rgba(0,44,55, .5)';
  // get the context
  ctx = canvas.getContext('2d'); // This is the context
  //create array of balls
  for (var i = 0; i < num_balls; i++){
      var ball;
    while(true) {
        var radius = Math.random()*20 + 10;
        var color = randomColor();
        //set location vector
        var x = Math.random() * (canvas.width-2*radius) + radius;
        var y = Math.random() * (canvas.height-2*radius) + radius;
        var loc = new vector2d(x, y);
        //set velocity vector
        var r = (Math.random()* 4 + 0.5);
        var theta = Math.random() * 2 * Math.PI;
        var vel = new vector2d(undefined, undefined, r, theta);
        var acc = new vector2d(0, 0);
        ball = new Mover(radius, loc, vel, acc, color);
        // check that this new ball does not collide with any other ball
        for(var j = 0;  j < balls.length; j++){
            if(vector2d.distance(balls[j].loc,ball.loc) <= (balls[j].radius + ball.radius))
                break;  // collision
        }
        if(j === balls.length)
            break;  // no collision
        }

    balls[i] = ball;
  }
  logEnergy();
  animate(); // Call to your animate function
}

function logEnergy() {
    console.log(`totalKineticEnergy ${totalKineticEnergy().toFixed(2)}`);
    setTimeout(logEnergy, 5000);  // five seconds
}

function totalKineticEnergy() {
  var sum = 0;
  for(var i = 0; i < balls.length; i++){
    sum += balls[i].kineticEnergy();
  }
  return sum;
}

//returns a random pastel color
function randomColor(){
  var hue = Math.floor(Math.random() * 360);
  var l = Math.random() * 15 + 70;
  var pastel = 'hsl(' + hue + ', 100%, ' + l + '%)';
  return pastel;
}

//check if balls should bounce off each other
function checkBallBounces () {

  //update collisionTracker
  // for(var i = 0; i < balls.length; i++){
  //   for(var j = 0; j < balls[i].collisionTracker.length; j++){
  //     balls[i].collisionTracker[j]++;
  //   }
  // }

  for(var i = 0; i < balls.length ; i++){
    for(var j = i + 1; j < balls.length; j++){

      //check if balls collided in last 10 frames
    //   if(balls[j].collisionTracker[i] < 10){continue;}

      //check if edges of 2 balls are touching
      var dist = vector2d.distance(balls[i].loc, balls[j].loc);
      if( dist <= balls[i].radius + balls[j].radius){
        var b1 = balls[i];
        var b2 = balls[j];

        // sometimes the balls will stick together if there is
        // too much overlap initially.  So separate them enough
        // that they are just touching
        var vec = vector2d.subtract(b1.loc, b2.loc);
        vec.setMag((b1.radius+b2.radius - vec.magnitude())/2);
        b1.loc.add(vec);
        vec.scalarMult(-1);
        b2.loc.add(vec);

        // note the total momentum before the collision
        var p_initial = vector2d.add(b1.momentum(), b2.momentum());

        //momentum & velocity of center of mass
        var total_mass = b1.mass + b2.mass;
        var vel_cm = vector2d.scalarDiv(p_initial, total_mass);
        //calculate velocities after collision using vf = 2*v_cm - vi
        //http://courses.ncssm.edu/apb11o/resources/guides/G09-4b.com.htm

        // Where is the center of mass?  It must lie on a line
        // connecting the two colliding objects with a magnitude
        // proportionate to the two masses.
        var vec_cm = vector2d.subtract(b1.loc, b2.loc);
        vec_cm.setMag(vec_cm.magnitude() * (b1.mass/(b1.mass+b2.mass)));
        vec_cm.add(b2.loc); // location of CM

        // For each ball, what is the component of its velocity towards
        // the center of mass and what is the component that is not
        // in the direction of the center of mass?

        // get a vector from  ball 1 to the center of mass
        var vel_b1_cm = vector2d.subtract(vec_cm, b1.loc);
        // its magnitude should be the magnitude of the balls velocity
        // times the cosine of the angle between itself and the
        // velocity of the ball
        var angleBetween = vector2d.angleBetween(b1.vel,vel_b1_cm);
        var cos = Math.cos(angleBetween);
        // component of b1 velocity on a line to the CM
        vel_b1_cm.setMag(b1.vel.magnitude() * Math.cos(vector2d.angleBetween(b1.vel,vel_b1_cm)));
        // component of the CM's velocity on a line towards b1
        var vel_cm_b1 = vector2d.copy(vel_b1_cm); // on the same line as vel_b1_cm
        vel_cm_b1.setMag(vel_cm.magnitude() * Math.cos(vector2d.angleBetween(vel_cm,vel_cm_b1)));

        // The component of the ball's velocity not in the direction of the
        // center of mass should be the difference between its total velocity
        // and the component in the direction of the center of mass
        var vel_b1_not_cm = vector2d.subtract(b1.vel,vel_b1_cm);
        // is it the same as the sine of the angle between? Yes
        // var vel_b1_not_cm_mag = b1.vel.magnitude() * Math.sin(vector2d.angleBetween(b1.vel,vel_b1_cm));
        // console.log(vel_b1_not_cm.magnitude(), vel_b1_not_cm_mag);

        // Now repeat for the second ball
        var vel_b2_cm = vector2d.subtract(vec_cm, b2.loc);
        vel_b2_cm.setMag(b2.vel.magnitude() * Math.cos(vector2d.angleBetween(b2.vel,vel_b2_cm)));
        var vel_b2_not_cm = vector2d.subtract(b2.vel,vel_b2_cm);

        // console.log(`b1 initial velocity ${b1.vel}`);
        // console.log(`b1 component velocity ${vel_b1_cm}`);
        // console.log(`center of mass velocity ${vel_cm}`);
        // console.log(`CM component velocity ${vel_cm_b1}`);
        // console.log(`b2 initial velocity ${b2.vel}`);
        // console.log(`b2 component velocity ${vel_b2_cm}`);

        var v1_final = vector2d.scalarMult(vel_cm_b1, 2);
        v1_final.subtract(vel_b1_cm);   // subtract velocity towards the CM
        v1_final.add(vel_b1_not_cm);    // add back the velocity not towards the CM
        // console.log(`b1 final velocity ${v1_final}`);

        var v2_final = vector2d.scalarMult(vel_cm_b1, 2);
        v2_final.subtract(vel_b2_cm);   // subtract velocity towards the CM
        v2_final.add(vel_b2_not_cm);    // add back the velocity not towards the CM

        // console.log(`b2 final velocity ${v2_final}`);
        // var init_momentum = vector2d.add(vector2d.scalarMult(vel_b1_cm,b1.mass),
        //                                     vector2d.scalarMult(vel_b2_cm,b2.mass));
        //
        // var final_momentum = vector2d.add(vector2d.scalarMult(v1_final,b1.mass),
        //                                     vector2d.scalarMult(v2_final,b2.mass));
        // // console.log(`initial momentum ${init_momentum}`);
        // console.log(`final momentum ${final_momentum}`);

        b1.vel = v1_final;
        b2.vel = v2_final;

        // note the total momentum after the collision
        var p_final = vector2d.add(b1.momentum(), b2.momentum());
        // console.log(`initial momentum ${p_initial}`);
        // console.log(`final momentum ${p_final}`);
        // console.log(totalKineticEnergy());
        // console.log(p_final.x, p_final.y);

        //reset frames since collision to 0
        // b1.collisionTracker[j] = 0;
        // b2.collisionTracker[i] = 0;
      }
    }
  }

}

function printMouseLoc(e){
  var mouseX = e.clientX;
  var mouseY = e.clientY;
  console.log("x:", mouseX, "y:", mouseY);
}

function mouseAttract(){
  console.log("clicked!");
}

function animate(){
  requestAnimationFrame(animate);
  checkBallBounces();
  canvas.onclick = mouseAttract;

  // canvas.onmousemove = function(event) {
  //   printMouseLoc(event);
  // }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(var i = 0; i < balls.length; i++){
    balls[i].draw();
  }
}
