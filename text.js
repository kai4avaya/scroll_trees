// Select the <p> element (or any other element containing text)
// var source = document.querySelector(".sample");
window.onload = function () {
var sbox = document.querySelectorAll(".sbox");
var textSboxes = [];

sbox.forEach(function (node) {
  textSboxes = textSboxes.concat(getTextNodes([node]));
});


initiate_get_lines(textSboxes);

  window.addEventListener('resize', function() {
    initiate_get_lines(textSboxes);
  });

// Create the observer.
var observer = new IntersectionObserver(callback, options);

// Get all elements with the class name "line" and observe them.
var lines = document.querySelectorAll('.line');
lines.forEach(function(line) {
  // Set the initial opacity to 0.
  line.style.opacity = '0';

  // Start observing the element.
  observer.observe(line);
});
}


function getTextNodes(nodes, textNodes = []) {
  nodes.forEach(function (node) {
    for (var i = 0; i < node.childNodes.length; i++) {
      var childNode = node.childNodes[i];
      if (childNode.nodeType === Node.TEXT_NODE) {
        // Check if the node is a text node
        textNodes.push(childNode);
      } else {
        // If the node is not a text node, check its child nodes
        getTextNodes([childNode], textNodes);
      }
    }
  });
  return textNodes;
}


function initiate_get_lines(textNodes){
  textNodes.forEach(function (textNode) {
    var lines = extractLinesFromTextNode(textNode);
    // logLines(lines);
  });
}


function extractLinesFromTextNode(textNode) {
  if (textNode.nodeType !== 3) {
    throw new Error("Lines can only be extracted from text nodes.");
  }


  

  // BECAUSE SAFARI: None of the "modern" browsers seem to care about the actual
  // layout of the underlying markup. However, Safari seems to create range
  // rectangles based on the physical structure of the markup (even when it
  // makes no difference in the rendering of the text). As such, let's rewrite
  // the text content of the node to REMOVE SUPERFLUOS WHITE-SPACE. This will
  // allow Safari's .getClientRects() to work like the other modern browsers.
  textNode.textContent = collapseWhiteSpace(textNode.textContent);

  // A Range represents a fragment of the document which contains nodes and
  // parts of text nodes. One thing that's really cool about a Range is that we
  // can access the bounding boxes that contain the contents of the Range. By
  // incrementally adding characters - from our text node - into the range, and
  // then looking at the Range's client rectangles, we can determine which
  // characters belong in which rendered line.
  var textContent = textNode.textContent;
  var range = document.createRange();
  var lines = [];
  var lineCharacters = [];

  // Iterate over every character in the text node.
  for (var i = 0; i < textContent.length; i++) {
    // Set the range to span from the beginning of the text node up to and
    // including the current character (offset).
    range.setStart(textNode, 0);
    range.setEnd(textNode, i + 1);

    // At this point, the Range's client rectangles will include a rectangle
    // for each visually-rendered line of text. Which means, the last
    // character in our Range (the current character in our for-loop) will be
    // the last character in the last line of text (in our Range). As such, we
    // can use the current rectangle count to determine the line of text.
    var lineIndex = range.getClientRects().length - 1;

    // If this is the first character in this line, create a new buffer for
    // this line.
    if (!lines[lineIndex]) {
      lines.push((lineCharacters = []));
    }

    // Add this character to the currently pending line of text.
    lineCharacters.push(textContent.charAt(i));
  }

  // At this point, we have an array (lines) of arrays (characters). Let's
  // collapse the character buffers down into a single text value.
  lines = lines.map(function operator(characters) {
    return collapseWhiteSpace(characters.join(""));
  });

  // DEBUGGING: Draw boxes around our client rectangles.
  // drawRectBoxes(range.getClientRects(), lines);
  placeLinesInDivs(range, lines)

  return lines;
}

/**
 * I normalize the white-space in the given value such that the amount of white-
 * space matches the rendered white-space (browsers collapse strings of white-space
 * down to single space character, visually, and this is just updating the text to
 * match that behavior).
 */
function collapseWhiteSpace(value) {
  return value.trim().replace(/\s+/g, " ");
}
function placeLinesInDivs(range, lines) {
  // Get the parent of the start node of the range.
  var parent = range.startContainer.parentNode;

  if(!parent) return

  try {
  // Clear the innerHTML of the parent.
  parent.innerHTML = "";  
  } catch (error) {
    console.log("error", error)
  }

  // Iterate over each line.
  lines.forEach(function(line) {
    // Create a new div.
    var div = document.createElement('div');

    // Set the text content of the div to the line of text.
    div.textContent = line;

    div.className = "line"

    // Append the div to the parent.
    parent.appendChild(div);
  });
}
function logLines(lines) {
  console.group("Rendered Lines of Text");

  lines.forEach(function iterator(line, i) {
    console.log(i, line);
  });

  console.groupEnd();
}

/**
 * I create a true array from the given array-like data. Array.from() if you are on
 * modern browsers.
 */
function arrayFrom(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
}


// Define the options for the observer.
var options = {
  root: null, // Use the viewport as the root.
  rootMargin: '0px', // No margins.
  threshold: 1 // Trigger the callback when the element is 5/6 in view.
};

// Define the callback for the observer.
var callback = function(entries, observer) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      // The element is in view, so start the animation.
      entry.target.style.transition = 'opacity 1s';
      entry.target.style.opacity = '1';
    } else {
      // The element is not in view, so reset its opacity.
      entry.target.style.opacity = '0';
    }
  });
};

function adjustTextSize() {
  var textElements = document.querySelectorAll('.responsive-text');

  textElements.forEach(function(element) {
      var parentWidth = element.parentNode.offsetWidth;
      var optimalFontSize = Math.max(12, parentWidth / 20); // Example calculation
      
      element.style.fontSize = optimalFontSize + 'px';
  });
}

// Adjust text size initially and on window resize
window.onload = adjustTextSize;
window.addEventListener('resize', adjustTextSize);
