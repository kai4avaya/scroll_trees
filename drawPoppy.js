document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    function drawPoppy(x, y) {
      // Draw stem
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 100); // Adjust length as needed
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
  
      // Draw flower top with random polygonal shape
      const petals = Math.floor(Math.random() * 5) + 5; // 5 to 9 petals
      const petalLength = Math.floor(Math.random() * 20) + 30; // Adjust size as needed
      const colors = ['#FF0000', '#FFA500', '#FFFF00', '#FFC0CB', '#800080']; // Example colors
      const color = colors[Math.floor(Math.random() * colors.length)]; // Pick random color
  
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < petals; i++) {
        const angle = i * (2 * Math.PI / petals);
        const petalX = x + Math.cos(angle) * petalLength;
        const petalY = y + Math.sin(angle) * petalLength;
        ctx.lineTo(petalX, petalY);
      }
      ctx.closePath();
      ctx.fill();
    }
  
    // Draw multiple poppies
    for (let i = 0; i < 50; i++) { // Adjust number of poppies as needed
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      drawPoppy(x, y);
    }
  });
  