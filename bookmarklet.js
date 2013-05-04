//#########################################################################
// 
// Description:
//
//   1. Hide the whole document (assumes the document has a single root
//      which should be the `document.documentElement').
//   2. Create a `bookmarklet-container' div which wraps the whole
//      bookmarklet.
//   3. Append the `bookmarklet-container' to the document *after* the
//      `head' element.
//   4. Toggle the visibility of the `bookmarklet-container' with the
//      bookmarklet button.
// 
//#########################################################################

var Bookmarklet = (function() {
  var Bookmarklet = function() {

  };

  Bookmarklet.prototype = new (function() {
    this.children = document.documentElement.childNodes;
    this.childElements = [];

    this.bmContainer = document.createElement('div');
    this.bmContainer.id = 'bookmarklet-container';

    this.bmButton = document.createElement('a');
    this.bmButton.id = 'bookmarklet-button';

    this.isActive = false;
    this.isAppended = false;

    /**
       Hides all `document.documentElement' children. If elements are
       already invisible, then they will still be invisible, but their
       visibility will be represented in the `childElements' object
       for for later use of the `hide' function.
    */
    this.show = function() {
      // Append the `bmContainer'
      if (!this.isAppended) {
        document.documentElement.insertBefore(
          this.bmContainer, document.getElementById('head'));
        this.isAppended = true;
      }

      // Hide every child of `document.documentElement'
      var child;
      for (var i = 0; i < this.children.length; ++i) {
        child = this.children[i];
        child.style = new Object();
        child.style.display = 'none';
      }

      this.bmContainer.style.display = 'inline';
      this.bmButton.style.display = 'inline';
      this._setButton('Show original page', {
        'textAlign': 'center',
        'width': '100%',
        'backgroundColor': '#00FF00',
        'top': '0',
      });
    }

    /**
       Shows all `document.documentElement' children after they have been
       hidden using the `show' function. Initial visibility will be
       restored, i.e. originally hidden elements will stay invisible.
    */
    this.hide = function() {
      document.getElementById('bookmarklet-container').style.display =
        'none';
      for (var i = 0; i < this.childElements.length; ++i) {
        // children[i].style.display = childElements[i]['display'];
        this.children[i].style.display = 'inline';
      }

      this._setButton('Show bookmarklet', {
        'textAlign': 'center',
        'width': '100%',
        'backgroundColor': '#FF0000',
        'top': '0',
      });

      document.documentElement.insertBefore(this.bmButton,
                                            document.body);
    }

    /**
       Toggles the bookmarklet's functionality.
    */
    this.toggle = function() {
      var self = this;

      if (this.isActive) {
        this.bmContainer.appendChild(this.bmButton);
        this.hide();
        this.isActive = false;
      } else {
        document.documentElement.insertBefore(this.bmButton,
                                              document.body);
        this.show();
        this.isActive = true;
      }
    }

    this._collectVisibilityInfo = function() {
      var child;
      var childElement = new Object();

      for (var i = 0; i < this.children.length; ++i) {
        child = this.children[i];
        childElement['element'] = child.cloneNode(true);;

        if (typeof child.style != 'undefined' &&
            typeof child.style.display != 'undefined' &&
            child.style.display != '') {
          childElement['display'] = child.style.display;
        } else {
          childElement['display'] = 'inline';
        }

        this.childElements[i] = childElement;
      }
    }

    this._setButton = function(text, properties) {
      this.bmButton.innerHTML = text;
      var props = Object.keys(properties);
      for (var i = 0; i < props.length; ++i) {
        property = props[i];
        this.bmButton.style[property] = properties[property];
      }
    }

    this.init = function(callback) {
      var self = this;

      // Store the `display' CSS property of every child of
      // `document.documentElement'

      this._collectVisibilityInfo();

      // Initial button setting
      this.bmButton.onclick = function() {
        self.toggle();
      }
      this._setButton('Show bookmarklet', {
        'textAlign': 'center',
        'width': '100%',
        'backgroundColor': '#FF0000',
        'top': '0',
      });

      // Show the bookmarklet button
      document.documentElement.insertBefore(this.bmButton,
                                            document.body);

      // Call user-defined actions on `this.bmContainer'
      callback(this.bmContainer);
    }

  });

  return Bookmarklet;
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

