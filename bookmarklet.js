// Description:
//
//   1. e the whole document (assumes the document to have a single root
//      which should be the `document.documentElement').
//   2. Create a `bookmarklet-container' div which wraps the whole
//      bookmarklet.
//   3. Append the `bookmarklet-container' to the
//      `document.documentElement'
//   4. Set the `bookmarklet-container' to be visible.

// document.documentElement.style.visibility = 'hidden';
// document.documentElement.style.display = 'none';

var children = document.documentElement.childNodes;
var child;
var childElements = [];
var childElement = new Object();


/**
   Hides all `document.documentElement' children. If elements are already
   invisible, then they will still be invisible, but their visibility will
   be represented in the `childElements' object for for later use of the
   `showPage' function.
*/
var hidePage = function() {
  for (var i = 0; i < children.length; ++i) {
    // Store the `display' CSS property away for later
    child = children[i];
    childElement['element'] = child.cloneNode(true);;

    if (typeof child.style != 'undefined' &&
        typeof child.style.display != 'undefined' &&
        child.style.display != '') {
      childElement['display'] = child.style.display;
    } else {
      childElement['display'] = 'inline';
    }

    childElements[i] = childElement;
    // Hide every child
    child.style = new Object();
    child.style.display = 'none';
  }
}

/**
   Shows all `document.documentElement' children after they have been
   hidden using the `hidePage' function. Initial visibility will be
   restored, i.e. originally hidden elements will stay invisible.
*/
var showPage = function() {
  document.getElementById('bookmarklet-container').style.display = 'none';
  for (var i = 0; i < childElements.length; ++i) {
    // children[i].style.display = childElements[i]['display'];
    children[i].style.display = 'inline';
  }
}

hidePage();

var bmContainer = document.createElement('div');
bmContainer.id = 'bookmarklet-container';
document.documentElement.insertBefore(
  bmContainer, document.getElementById('head'));
// bmContainer.style.visibility = 'visible';
bmContainer.style.display = 'inline';

// Show original page button
var bmButton = document.createElement('a');
bmButton.innerHTML = 'Show original page';
bmButton.onclick = function() {
  showPage();
}
bmButton.style.textAlign = 'center';
bmButton.style.width = '100%';
bmButton.style.backgroundColor = '#FF0000'
bmButton.style.top = '0';
bmContainer.appendChild(bmButton);

// Test paragraph
var p = document.createElement('p');
p.innerHTML = 'This is a test.';
bmContainer.appendChild(p);

var ul = document.createElement('ul');
var li;
var links = document.links;

for (var i = 0; i < links.length; ++i) {
  li = document.createElement('li');
  li.appendChild(links[i].cloneNode(true));
  ul.appendChild(li);
}

bmContainer.appendChild(ul);

