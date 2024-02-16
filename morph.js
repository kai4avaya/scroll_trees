document.addEventListener("DOMContentLoaded", () => {
  const morphs = document.querySelectorAll(".morph");

  createMorphShapes("morph", 20); // Adjust the number of shapes as needed

  const options = {
    root: null,
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
      }
    });
  }, options);

  morphs.forEach((morphShape) => {
    observer.observe(morphShape);
  });

  function resizeMorphShapeWrappers() {
    document.querySelectorAll(".morph").forEach((container) => {
      const wrapper = container.querySelector(".morph-shape-wrapper");
      if (wrapper) {
        const containerRect = container.getBoundingClientRect();
        wrapper.style.width = `${containerRect.width}px`; // Width is generally accurate
        // wrapper.style.height = `${containerRect.height}px`; // More accurate height
        wrapper.style.height = `100%`
      }
    });
  }

  // Call the resize function initially and on every window resize
  resizeMorphShapeWrappers();
  window.addEventListener("resize", resizeMorphShapeWrappers);

  function initializePoppies(canvas, numberOfPoppies) {
    let localPoppies = []; // Use a local array for each canvas
    for (let i = 0; i < numberOfPoppies; i++) {
      const posX = Math.random() * canvas.width;
      const posY = Math.random() * canvas.height + canvas.height * 0.1;
      const color = getRandomBrightColor();
      const angle = 0;
      localPoppies.push({ posX, posY, color, angle });
    }

    canvas.poppies = localPoppies; // Attach the poppies data to the canvas
    localPoppies.forEach((poppy) =>
      drawPoppy(canvas, poppy.posX, poppy.posY, poppy.color, poppy.angle)
    );
  }
  function createMorphShapes(containerClass, numberOfPoppies) {
    const morphs = document.querySelectorAll(`.${containerClass}`);
    if (!morphs) return;
    if (morphs.length === 0) return;

    morphs.forEach(container => {
        const wrapper = document.createElement('div');
        wrapper.className = 'morph-shape-wrapper';
        wrapper.style.position = 'relative';

        let canvas = document.createElement('canvas');
        canvas.className = 'morph-shape';

        // Use the container's offsetWidth for the canvas width, applying a maximum width if needed
        const halfContainerWidth = container.offsetWidth;
        const maxWidth = 300; // Adjust as needed
        canvas.width = Math.min(halfContainerWidth, maxWidth);

        console.log("container.offsetHeight;",container.offsetHeight)
        // Dynamically set the canvas height to match the parent container's height
        canvas.height = container.offsetHeight; // Adjust the height dynamically

        wrapper.appendChild(canvas);
        container.appendChild(wrapper);

        // Initialize poppies for this specific canvas
        initializePoppies(canvas, numberOfPoppies);
        
        // Start the animation loop for this specific canvas
        animatePoppies(canvas);
    });
}



  //   function drawFieldOfPoppies(canvas, numberOfPoppies) {
  //     // Increase the number of poppies drawn on each canvas
  //     for (let i = 0; i < numberOfPoppies; i++) {
  //         // Adjust positioning logic if needed to fit more poppies
  //         const posX = Math.random() * canvas.width;
  //         const posY = Math.random() * canvas.height + canvas.height * 0.1; // Distribute poppies more evenly
  //         drawPoppy(canvas, posX, posY);
  //     }
  // }

  function drawPoppy(canvas, posX, posY, color, angle) {
    const ctx = canvas.getContext("2d");
    const stemHeight = 100; // Example fixed stem height
    const radius = 40; // Example fixed radius

    // Draw the stem
    ctx.beginPath();
    ctx.moveTo(posX, posY);
    ctx.lineTo(posX, posY - stemHeight);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Apply rotation for the flower top
    ctx.save(); // Save current context state
    ctx.translate(posX, posY - stemHeight); // Move to the top of the stem
    ctx.rotate(angle); // Apply rotation

    // Draw the flower top
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      // Assume 5 sides for simplicity
      const x = radius * Math.cos((i * 2 * Math.PI) / 5);
      const y = radius * Math.sin((i * 2 * Math.PI) / 5);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.restore(); // Restore context to its original state
  }

  // function animatePoppies(canvas) {
  //   canvas.poppies = canvas.poppies.map((poppy) => {
  //     let hue = (parseInt(poppy.color.slice(4), 10) + 1) % 360; // Adjust color change rate
  //     poppy.color = `hsl(${hue}, 100%, 50%)`;
  //     poppy.angle += (Math.random() - 0.5) * 0.02; // Adjust angle change rate
  //     return poppy;
  //   });

  //   canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  //   canvas.poppies.forEach((poppy) =>
  //     drawPoppy(canvas, poppy.posX, poppy.posY, poppy.color, poppy.angle)
  //   );

  //   requestAnimationFrame(() => animatePoppies(canvas)); // Continue the animation loop
  // }

  function animatePoppies(canvas) {
    // Initialize or update a shared hue for the canvas if it's not already set
    if (typeof canvas.sharedHue === 'undefined') {
        canvas.sharedHue = 0; // Start from an arbitrary hue
    } else {
        canvas.sharedHue = (canvas.sharedHue + 0.1) % 360; // Slowly shift the hue over time
    }

    canvas.poppies = canvas.poppies.map((poppy) => {
        // Use the shared hue for all poppies
        poppy.color = `hsl(${canvas.sharedHue}, 100%, 50%)`;

        // Adjust angle slightly to simulate wind
        poppy.angle += (Math.random() - 0.5) * 0.02;

        return poppy;
    });

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    canvas.poppies.forEach((poppy) =>
        drawPoppy(canvas, poppy.posX, poppy.posY, poppy.color, poppy.angle)
    );

    requestAnimationFrame(() => animatePoppies(canvas));
}


});

function getRandomBrightColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 100;
  const l = 50;
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function generateDynamicClipPath(scrollY, index) {
  // Example: Create a dynamic polygon based on scroll position and index
  // This is a simplified example; adjust the logic to suit your design
  const size = 3 + ((scrollY / 1000 + index) % 5); // Dynamic number of sides based on scroll
  let clipPath = "polygon(";
  for (let i = 0; i < size; i++) {
    const angle = ((2 * Math.PI) / size) * i; // Angle in radians
    const x = 50 + 40 * Math.cos(angle); // Adjust the radius and center as needed
    const y = 50 + 40 * Math.sin(angle);
    clipPath += `${x}% ${y}%, `;
  }
  clipPath = clipPath.slice(0, -2) + ")"; // Remove the last comma and space, then close the parenthesis
  return clipPath;
}

// function createMorphShapes(containerClass, numberOfShapes) {
//   const morphs = document.querySelectorAll(`.${containerClass}`);
//   if (!morphs) return;
//   if (morphs.length === 0) return;

//   morphs.forEach(container => {
//     const wrapper = document.createElement('div');
//     wrapper.className = 'morph-shape-wrapper';
//     wrapper.style.position = 'relative';

//     for (let i = 0; i < numberOfShapes; i++) {
//       const shape = document.createElement('div');
//       shape.className = 'morph-shape';
//       shape.id = `${containerClass}-polygon${i + 1}`;
//       shape.style.backgroundColor = getRandomColor();

//       // Position shapes absolutely within the wrapper
//       shape.style.position = 'absolute';
//       shape.style.top = '50%'; // Center the shape or choose a strategy for overlap
//       shape.style.left = '50%';
//       shape.style.transform = 'translate(-50%, -50%)'; // Center the shape

//       wrapper.appendChild(shape);
//     }

//     container.appendChild(wrapper);
//   });
// }

console.log("morph again");
