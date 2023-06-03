window.onload = function() {
  var canvasContainer = document.getElementById("canvasContainer");
  var canvas = document.getElementById("myCanvas", { alpha: false });
  var resetButton = document.getElementById("resetButton");
  var ctx = canvas.getContext("2d");

  // Set the canvas size to match the container size
  canvas.width = canvasContainer.offsetWidth;
  canvas.height = canvasContainer.offsetHeight;

  // Calculate the circle positions based on canvas size
  var circleRadius = Math.min(canvas.height) * 0.1;
  var circleSpacing = 24; // Adjust the spacing between circles
  var circleX = circleRadius + circleSpacing;
  var circleY1 = circleRadius + circleSpacing;
  var circleY2 = circleY1 + circleRadius * 2 + circleSpacing;
  var circleY3 = circleY2 + circleRadius * 2 + circleSpacing;
  var circleY4 = circleY3 + circleRadius * 2 + circleSpacing;

  // Calculate the initial arrow positions based on canvas size
  var arrowStartX = canvas.width - 100;
  var arrowEndX =  canvas.width - 150;
  var arrowWidth = 5;
  var arrowHeadX = arrowEndX;
  var arrowTailX = arrowStartX;
  var targetX = circleX + circleRadius;

  // array data for circles
  var circleArray = [
    { x: circleX, y: circleY1, radius: circleRadius, color: "red" },
    { x: circleX, y: circleY2, radius: circleRadius, color: "yellow" },
    { x: circleX, y: circleY3, radius: circleRadius, color: "green" },
    { x: circleX, y: circleY4, radius: circleRadius, color: "blue" }
  ];

  // array data for Initial postion of arrows 
  var initialArrowArray = [
    { startX: arrowStartX, startY: circleY1, endX: arrowEndX, endY: circleY1, width: arrowWidth, color: "black" },
    { startX: arrowStartX, startY: circleY2, endX: arrowEndX, endY: circleY2, width: arrowWidth, color: "black" },
    { startX: arrowStartX, startY: circleY3, endX: arrowEndX, endY: circleY3, width: arrowWidth, color: "black" },
    { startX: arrowStartX, startY: circleY4, endX: arrowEndX, endY: circleY4, width: arrowWidth, color: "black" }
  ];

  // Draw circles using forEach loop.
  circleArray.forEach(function(circle){
    drawCircle(circle.x, circle.y, circle.radius, circle.color);
  });

  // Draw arrows using forEach loop.
  initialArrowArray.forEach(function(arrow){
    drawArrow(arrow.startX, arrow.startY, arrow.endX, arrow.endY, arrow.width, arrow.color);
  });
 
  // Function to draw a circle
  function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
  }

  
  // Function to draw arrow
  function drawArrow(fromx, fromy, tox, toy, arrowWidth, color){
    //variables to be used when creating the arrow
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);
    ctx.save();
    ctx.strokeStyle = color;

    //starting path of the arrow from the start square to the end square and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = arrowWidth;
    ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
              toy-headlen*Math.sin(angle-Math.PI/7));

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
              toy-headlen*Math.sin(angle+Math.PI/7));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
              toy-headlen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    ctx.stroke();
    ctx.restore();
  }  

  // Function to update the arrow position
  function updateArrowPosition(index) {
    var arrow = initialArrowArray[index];
    var targetCircle = circleArray[index];
    
    if (!arrow.reachedTarget) {
      if (arrow.startX > targetX) {
        arrow.startX -= 1;
        arrow.endX -= 1;
      } else {
        arrow.reachedTarget = true;
        targetCircle.clicked = true;
      }
    } else {
      if (arrow.startX < arrowTailX) {
        arrow.startX += 1;
        arrow.endX += 1;
      } else {
        // Animation complete
        return;
      }
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circles using forEach loop
    circleArray.forEach(function(circle){
      drawCircle(circle.x, circle.y, circle.radius, circle.clicked ? "purple" : circle.color);
    });

    // Draw arrows using forEach loop
    initialArrowArray.forEach(function(arrow){
      drawArrow(arrow.startX, arrow.startY, arrow.endX, arrow.endY, arrow.width, arrow.color);
    });

    // Request next frame
    requestAnimationFrame(function() {
      updateArrowPosition(index);
    });
  }

  // Event listeners for circle clicks
  canvas.addEventListener("click", function(event) {
    var rect = canvas.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;

    // Check if the click is inside any circle
    circleArray.forEach(function(circle, index){
      if (isInsideCircle(clickX, clickY, circle.x, circle.y, circle.radius) && !circle.clicked) {
        updateArrowPosition(index);
      }
    });
  });

  // Function to check if a point is inside a circle
  function isInsideCircle(x, y, circleX, circleY, radius) {
    var distanceSq = (x - circleX) ** 2 + (y - circleY) ** 2;
    return distanceSq <= radius ** 2;
  }

  // Reset button click event listener
  var resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", function() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset circle clicked state
    circleArray.forEach(function(circle) {
      circle.clicked = false;
    });

    // Draw circles using forEach loop
    circleArray.forEach(function(circle){
      drawCircle(circle.x, circle.y, circle.radius, circle.color);
    });

    // Draw arrows using forEach loop
    initialArrowArray.forEach(function(arrow){
      drawArrow(arrow.startX, arrow.startY, arrow.endX, arrow.endY, arrow.width, arrow.color);
    });
  });


};
  

