//#########################################################################
//
// Description:
//
//   1. Append a `Show bookmarklet' button to the original `body' element
//   2. If the user clicks the `Show bookmarklet' button, remove the
//      original `body' element; store it in memory for later use.
//   3. Insert the `bmContainer' bookmarklet wrapper which is a custom
//      `body' element and includes a `Show original page' button
//   4. If the user clicks the `Show original page' button, remove the
//      custom `bmContainer' and insert the original `body' element again.
//
//#########################################################################

var Bookmarklet = (function() {
  var Bookmarklet = function() {

  };

  Bookmarklet.prototype = new (function() {

    this.pageBody = new Object();

    // this.bmContainer = document.createElement('div');
    this.bmContainer = new Object();
    this.bmContainer.id = 'bookmarklet-container';
    this.bmShowButton = new Object();
    this.bmHideButton = new Object();

    this.bmButton = document.createElement('a');
    this.bmButton.id = 'bookmarklet-button';

    this.isActive = false;
    this.buttonIsInserted = false;

    /**
       Hides all `document.documentElement' children. If elements are
       already invisible, then they will still be invisible, but their
       visibility will be represented in the `childElements' object
       for for later use of the `hide' function.
    */
    this.show = function() {
      var self = this;

      this._disaleStyleSheets();

      // Store the current state of the `body' element of the page
      this.pageBody = document.body.cloneNode(true);

      // Append the `bmContainer'
      this._removeBody();
      document.documentElement.appendChild(this.bmContainer);

      // Insert the `bmButton' only once
      if (!this.buttonIsInserted) {
        this.bmContainer.insertBefore(this.bmHideButton,
                                      this.bmContainer.childNodes[0]);
        this.buttonIsInserted = true;
      }
    }

    /**
       Shows all `document.documentElement' children after they have been
       hidden using the `show' function. Initial visibility will be
       restored, i.e. originally hidden elements will stay invisible.
    */
    this.hide = function() {
      var self = this;

      this._enableStyleSheets();

      // Append the `pageBody'
      this._removeBody();
      document.documentElement.appendChild(this.pageBody);

      // Add the event listener again when the original page is shown
      document.getElementById('bookmarklet-show-button').onclick =
        function() {
          self.toggle();
        }
    }

    /**
       Toggles the bookmarklet's functionality.
    */
    this.toggle = function() {
      console.log('Click');  // DEBUG
      if (this.isActive) {
        this.hide();
        this.isActive = false;
      } else {
        this.show();
        this.isActive = true;
      }
    }

    this._removeBody = function() {
      // if (document.body.id = 'bookmarklet-container') {
      //   this.bmContainer = document.body.cloneNode(true);
      // } else {
      //   this.pageBody = document.body.cloneNode(true);
      // }
      document.body.parentNode.removeChild(document.body);
    }

    this._enableStyleSheets = function() {
      for(i = 0; i < document.styleSheets.length; ++i) {
        document.styleSheets[i].disabled = false;
      }
    }

    this._disaleStyleSheets = function() {
      for(i = 0; i < document.styleSheets.length; ++i) {
        document.styleSheets[i].disabled = true;
      }
    }

    this._makeButton = function(text, id, onclick, properties) {
      var button = document.createElement('a');
      button.id = id;
      button.onclick = onclick;

      button.innerHTML = text;
      var props = Object.keys(properties);
      for (var i = 0; i < props.length; ++i) {
        property = props[i];
        button.style[property] = properties[property];
      }

      return button;
    }

    this.init = function(callback) {
      var self = this;
      this.bmContainer = document.createElement('body');

      this.bmShowButton = this._makeButton(
        'Show bookmarklet', 'bookmarklet-show-button', function() {
          self.toggle();
        }, {
          'textAlign': 'center',
          'width': '100%',
          'backgroundColor': '#FF0000',
          'top': '0',
          'zIndex': '99999999',
          'position': 'absolute',
        });
      this.bmHideButton = this._makeButton(
        'Show original page', 'bookmarklet-hide-button', function() {
          self.toggle();
        }, {
          'textAlign': 'center',
          'width': '100%',
          'backgroundColor': '#00FF00',
          'top': '0',
          'zIndex': '99999999',
          'position': 'absolute',
        });

      // Show the bookmarklet button
      document.body.insertBefore(this.bmShowButton,
                                 document.body.childNodes[0]);

      this.pageBody = document.body.cloneNode(true);

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

