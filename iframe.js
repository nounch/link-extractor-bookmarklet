// This is only stub!
//
// Here is the general idea:
//
// 1. Use an `iframe' as the container for the bookmarklet so its styles
//    and code do not pollute the original website.
// 2  Access the website by communicating with the parent document from
//    inside the `iframe'.
//
// There are many hurdles, though (non-sandboxed CSS/JS, restricted
// `iframe' - owner document communication etc.). Advances such as the
// shadow DOM might bring some relief.


var Bookmarklet = (function() {
  var Bookmarklet = function() {
    this.bmContainer = new Object();
  }

  Bookmarklet.prototype = function() {
    this.init = function(callback) {
      callback(this.bmContainer);
    }
  }
}).call(this);

var bookmarklet = new Bookmarklet();
bookmarklet.init(function(bmContainer) {

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

});
