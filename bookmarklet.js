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
    this.bmContainer.class = 'bookmarklet-widget';
    this.bmShowButtonContainer = new Object();
    this.bmShowButton = new Object();
    this.bmHideButton = new Object();

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
    };

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

      // Add the event listeners again when the original page is shown
      this.bmShowButton = document.getElementById(
        'bookmarklet-show-button');
      this.bmShowButton.onclick =
        function() {
          self.toggle();
        }

      this.quitButton = document.getElementById(
        'bookmarklet-quit-button');
      this.quitButton.onclick =
        function() {
          self.quit();
        }

      // this.bmShowButton = document.getElementById(
      //   'bookmarklet-show-button');
      // this._setShowButtonProperties(this.bmShowButton, self);
    };


    /**
       Toggles the bookmarklet's functionality.
    */
    this.toggle = function() {
      if (this.isActive) {
        this.hide();
        this.isActive = false;
      } else {
        this.show();
        this.isActive = true;
      }
    };

    // Alternative to custom stylesheets; currently not used
    // this._setShowButtonProperties = function(element) {
    //   var self = this;
    //   element.onclick = function() {
    //     self.toggle();
    //   }
    //   element.onmouseover = function() {
    //     element.style.backgroundColor = '#0000FF';
    //   }
    //   element.onmouseout = function() {
    //     element.style.backgroundColor = '#FF0000';
    //   }
    // };

    this._removeBody = function() {
      // if (document.body.id = 'bookmarklet-container') {
      //   this.bmContainer = document.body.cloneNode(true);
      // } else {
      //   this.pageBody = document.body.cloneNode(true);
      // }
      document.body.parentNode.removeChild(document.body);
    };

    this._enableStyleSheets = function() {
      for(i = 0; i < document.styleSheets.length; ++i) {
        document.styleSheets[i].disabled = false;
      }
    };

    this._disaleStyleSheets = function() {
      for(i = 0; i < document.styleSheets.length; ++i) {
        document.styleSheets[i].disabled = true;
      }
    };

    this._makeButton = function(text, id, onclick, properties) {
      var button = document.createElement('a');
      button.id = id;
      button.class = 'bookmarklet-widget';
      button.onclick = onclick;

      button.innerHTML = text;
      var props = Object.keys(properties);
      for (var i = 0; i < props.length; ++i) {
        property = props[i];
        button.style[property] = properties[property];
      }

      return button;
    };

    this.quit = function() {
      console.log('QUIT');  // DEBUG
      var container = document.getElementById(
        'bookmarklet-show-button-container');
      container.parentNode.removeChild(container);
    };

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
          'cursor': 'pointer',
          'position': 'absolute',
        });
      
      this.quitButton = this._makeButton(
        'Close', 'bookmarklet-quit-button', function() {
          self.quit();
        }, {
          'textAlign': 'right',
          'top': '0',
          'right': '0',
          'zIndex': '99999999',
          'cursor': 'pointer',
          'position': 'absolute',
        });

      // this.bmShowButton = document.getElementById(
      //   'bookmarklet-show-button');
      // this._setShowButtonProperties(this.bmShowButton, self);

      this.bmHideButton = this._makeButton(
        'Show original page', 'bookmarklet-hide-button', function() {
          self.toggle();
        }, {
          'textAlign': 'center',
          'width': '100%',
          'backgroundColor': '#00FF00',
          'top': '0',
          'zIndex': '99999999',
          'cursor': 'pointer',
          'position': 'absolute',
        });

      this.bmShowButtonContainer = document.createElement('div');
      this.bmShowButtonContainer.id = 'bookmarklet-show-button-container';
      this.bmShowButtonContainer.class = 'bookmarklet-widget';
      this.bmShowButtonContainer.appendChild(this.bmShowButton);
      this.bmShowButtonContainer.appendChild(this.quitButton);

      // Show the bookmarklet button
      document.body.insertBefore(this.bmShowButtonContainer,
                                 document.body.childNodes[0]);
      var css = document.createElement('style');
      css.type = 'text/css';
      css.innerHTML =
        '#bookmarklet-show-button {\
color: #FFFFFF !important;\
background-color: #FF0000 !important;\
box-shadow: 0px 0px 10px 6px #FF0000 !important;\
box-shadow: inset 0px 8px 15px -5px #FFFFFF !important;\
box-shadow: 0px 0px 10px 6px #000000, inset 0px -18px 15px -5px #FF0000 !important;\
font-size: 1.8125em !important;\
font-family: Arial, Helvetica, sans-serif !important;\
text-decoration: none !important;\
padding-top: 3px !important;\
padding-bottom: 3px !important;\
transition: box-shadow 2s !important;\
transition: padding 0.5s !important;\
}\
\
#bookmarklet-show-button:hover {\
box-shadow: 0px -5px 10px 6px #000000, inset 0px -18px 15px -5px #AA0000 !important;\
box-shadow: 0px 0px 15px 6px #000000 !important;\
padding-top: 24px !important;\
padding-bottom: 14px !important;\
text-decoration: none !important;\
font-family: Arial, Helvetica, sans-serif !important;\
transition: box-shadow 2s !important;\
transition: padding 0.5s !important;\
}\
\
#bookmarklet-quit-button {\
color: #000000 !important;\
background-color: #FF0000 !important;\
font-family: Arial, Helvetica, sans-serif !important;\
font-size: 0.75em !important;\
float: right !important;\
text-align: right !important;\
padding-right: 3px !important;\
}\
\
#bookmarklet-quit-button:hover {\
color: #FFFFFF !important;\
background-color: #FF0000 !important;\
font-family: Arial, Helvetica, sans-serif !important;\
font-size: 0.75em !important;\
}\
'
      css.id = 'bookmarklet-css-rules';
      css.class = 'bookmarklet-widget';
      document.head.appendChild(css);

      this.pageBody = document.body.cloneNode(true);

      // Call user-defined actions on `this.bmContainer'
      callback(this.bmContainer);
    };

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
