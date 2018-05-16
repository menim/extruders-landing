function Swipe(elem, callback) {
	var self = this;
	this.callback = callback;

	function handleEvent(e) {
		self.touchHandler(e);
	}

	elem.addEventListener('touchstart', handleEvent, false);
	elem.addEventListener('touchmove', handleEvent, false);
	elem.addEventListener('touchend', handleEvent, false);
}
Swipe.prototype.touches = {
	"touchstart": {"x":-1, "y":-1},
	"touchmove" : {"x":-1, "y":-1},
	"touchend"  : false,
	"direction" : "undetermined"
};
Swipe.prototype.touchHandler = function (event) {
	var touch;
	if (typeof event !== 'undefined'){
		if (typeof event.touches !== 'undefined') {
			touch = event.touches[0];
			switch (event.type) {
				case 'touchstart':
				case 'touchmove':
					this.touches[event.type].x = touch.pageX;
					this.touches[event.type].y = touch.pageY;
					break;
				case 'touchend':
					this.touches[event.type] = true;
					var x = (this.touches.touchstart.x - this.touches.touchmove.x),
						y = (this.touches.touchstart.y - this.touches.touchmove.y);
					if (x < 0) x /= -1;
					if (y < 0) y /= -1;
					if (x > y)
						this.touches.direction = this.touches.touchstart.x < this.touches.touchmove.x ? "right" : "left";
					else
						this.touches.direction = this.touches.touchstart.y < this.touches.touchmove.y ? "down" : "up";
					this.callback(event, this.touches.direction);
					break;
			}
		}
	}
};
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _class, _temp, _initialiseProps;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) {if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; }
 return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lightbox = (_temp = _class = function Lightbox(_ref) {
    var _ref$lazyload = _ref.lazyload;
    var lazyload = _ref$lazyload === undefined ? true : _ref$lazyload;
    var _ref$counter = _ref.counter;
    var counter = _ref$counter === undefined ? true : _ref$counter;
    var _ref$arrows = _ref.arrows;
    var arrows = _ref$arrows === undefined ? true : _ref$arrows;
    var _ref$slideSpeed = _ref.slideSpeed;
    var slideSpeed = _ref$slideSpeed === undefined ? 400 : _ref$slideSpeed;

    var options = _objectWithoutProperties(_ref, ['lazyload', 'counter', 'arrows', 'slideSpeed']);

    _classCallCheck(this, Lightbox);

    _initialiseProps.call(this);

    if (!options.selector) {
        console.error('Please add a valid css selector with the option "selector:"');
    } else if (typeof options.selector !== 'string') {
        console.error(options.selector, 'is not a string but a(n) ' + _typeof(options.selector));
    } else {
        this.selector = options.selector;
        this.lazyload = lazyload;
        this.counter = counter;
        this.arrows = arrows;
        this.slideSpeed = slideSpeed;

        this.links = Array.from(document.querySelectorAll('a' + options.selector));
        this.offsets = [];
        this.nodes = {};
        this.imageIndex = null;
        if (this.links.length > 0) {
            this.createLightbox();
            this.createNodes();
            this.eventListeners(this.links);
        } else {
            console.error('The selector \'' + this.selector + '\' did not yield results. Please make sure the selector is applied on an \'a\' element.');
        }
    }
}, _initialiseProps = function _initialiseProps() {
    var _this = this;

    this.goTo = function (num, event) {
        var _nodes = _this.nodes;
        var items = _nodes.items;
        var counter = _nodes.counter;
        var lightboxNode = _nodes.lightboxNode;

        if (_this.counter) {
            counter.innerHTML = num + 1 + '/' + _this.links.length;
        }
        var spinner = '<div class="spinner"></div>';
        var img = items[num].querySelector('img');
        if (_this.lazyload) {
            var src = img.getAttribute('data-src');
            items[num].insertAdjacentHTML('beforeend', spinner);
            // Set image attribute
            img.setAttribute('src', src);

            // Add class to slide item when image is completely loaded. Must be in this order.
            var imgLoad = new Image();
            imgLoad.onload = function () {
                items[num].classList.add('is-active');
                items[num].classList.add('is-loaded');
            };
            imgLoad.src = src;
        } else {
            items[num].classList.add('is-active');
            items[num].classList.add('is-loaded');
        }

        // Change the offset for each slide based on its index and the current index.
        for (var i = 0; i < _this.offsets.length; i++) {
            var offset = _this.offsets[i] - num * 100;

            items[i].style.transform = 'translateX(' + offset + 'vw)';

            // Add transition type based on which event was triggered
            if (event) {
                if (event.target.className === 'gallery__itemThumb') {
                    items[i].style.transition = 'opacity 0.4s ease';
                } else {
                    items[i].style.transition = 'transform ' + _this.slideSpeed + 'ms ease-out';
                }
            }
        }

    };

    this.createNodes = function (links) {
        // Find all the lightbox nodes and add them to an object
        Object.assign(_this.nodes, {
            lightboxNode: document.querySelector('.m-lightbox'),
            items: Array.from(document.querySelectorAll('.m-lightbox__slide')),
            next: document.querySelector('.m-lightbox__nextPrev--next'),
            prev: document.querySelector('.m-lightbox__nextPrev--prev'),
            close: document.querySelector('.m-lightbox__close')

        });

        Object.assign(_this.nodes, {
            counter: document.querySelector('.m-lightbox__counter')
        });
    };

    this.eventListeners = function (links) {
        var _nodes2 = _this.nodes;
        var lightboxNode = _nodes2.lightboxNode;
        var items = _nodes2.items;
        var next = _nodes2.next;
        var prev = _nodes2.prev;
        var close = _nodes2.close;

        links.forEach(function (item, index) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                lightboxNode.classList.add('is-active');
                document.body.style.overflow = 'hidden';
                _this.imageIndex = index;
                _this.goTo(index, e);
                _this.setNav(index);
            });
        });

        next.addEventListener('click', function (e) {
            _this.goToNext(e);
        });

        prev.addEventListener('click', function (e) {
            _this.goToPrev(e);
        });

        close.addEventListener('click', function () {
            _this.closeBox();
        });

        document.onkeydown = function (e) {
            switch (e.keyCode) {
                case 37:
                    _this.goToPrev(e);
                    break;
                case 39:
                    _this.goToNext(e);
                    break;
                case 27:
                    _this.closeBox();
                    break;
            };
        };

        items.forEach(function (item) {
            // https://gist.github.com/Tam/d44c87b3daeb07b15984ddc6127d4e34
            new Swipe(item.querySelector('img'), function (e, direction) {
                e.preventDefault();
                switch (direction) {
                    case "up":
                        // Handle Swipe Up
                        break;
                    case "down":
                        // Handle Swipe Down
                        break;
                    case "left":
                        _this.goToNext(e);
                        break;
                    case "right":
                        _this.goToPrev(e);
                        break;
                }
            });
        });
    };

    this.setNav = function (index) {
        if (_this.arrows) {
            var _nodes3 = _this.nodes;
            var next = _nodes3.next;
            var prev = _nodes3.prev;

            if (index < _this.links.length - 1) {
                next.classList.add('is-active');
            }
            if (index >= _this.links.length - 1) {
                next.classList.remove('is-active');
            }
            if (index > 0) {
                prev.classList.add('is-active');
            }
            if (index <= 0) {
                prev.classList.remove('is-active');
            }
        }
    };

    this.goToNext = function (e) {
        var items = _this.nodes.items;

        if (_this.imageIndex < items.length - 1) {
            _this.goTo(_this.imageIndex + 1, e);
            setTimeout(function () {
                items[_this.imageIndex - 1].classList.remove('is-active');
            }, _this.slideSpeed);
            _this.imageIndex += 1;
            _this.setNav(_this.imageIndex);
        }
    };

    this.goToPrev = function (e) {
        var items = _this.nodes.items;

        if (_this.imageIndex > 0) {
            _this.goTo(_this.imageIndex - 1, e);
            setTimeout(function () {
                items[_this.imageIndex + 1].classList.remove('is-active');
            }, _this.slideSpeed);
            _this.imageIndex -= 1;
            _this.setNav(_this.imageIndex);
        }
    };

    this.closeBox = function () {
        var _nodes4 = _this.nodes;
        var lightboxNode = _nodes4.lightboxNode;
        var items = _nodes4.items;

        lightboxNode.classList.remove('is-active');
        document.body.style.overflow = 'auto';
        setTimeout(function () {
            items.forEach(function (item) {
                return item.classList.remove('is-active');
            });
        }, _this.slideSpeed);
    };

    this.renderImages = function (images) {
        var imagesLinks = images.map(function (item, index) {
            var offset = index * 100;
            _this.offsets.push(offset);
            var imageSrc = item.getAttribute('href');
            return '\n                <li class=\'m-lightbox__slide\' style=\'transform: translateX(' + offset + 'vw)\'>\n                    ' + (_this.lazyload ? '\n                        <img data-src=\'' + imageSrc + '\'/>\n                    ' : '\n                        <img src=\'' + imageSrc + '\'/>\n                    ') + '\n                </li>\n            ';
        });
        return imagesLinks;
    };

    this.createLightbox = function () {
        var lightbox = '\n            <div class=\'m-lightbox\'>\n                <div class=\'m-lightbox__controls\'>\n                    <button class=\'m-lightbox__close\'>\n                        <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\n                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>\n                            <path d="M0 0h24v24H0z" fill="none"/>\n                        </svg>\n                    </button>\n                    <button class=\'m-lightbox__nextPrev m-lightbox__nextPrev--prev\'>\n                        <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\n                            <path d="M0 0h24v24H0z" fill="none"/>\n                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>\n                        </svg>\n                    </button>\n                    <button class=\'m-lightbox__nextPrev m-lightbox__nextPrev--next\'>\n                        <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">\n                            <path d="M0 0h24v24H0z" fill="none"/>\n                            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>\n                        </svg>\n                    </button>\n                </div>\n                <ul class=\'m-lightBox__slider\'>\n                    ' + _this.renderImages(_this.links).join('') + '\n                </ul>\n                <div class=\'m-lightbox__counter\'>\n                </div>\n            </div>\n        ';
        document.body.insertAdjacentHTML('beforeend', lightbox);
    };
}, _temp);



"use strict";

// polyfill for ie

(function() {
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }

  var openBtnList = document.querySelectorAll(".is-open");
  var modal = document.querySelector(".modal");
  var overlay = document.querySelector(".overlay");

  openBtnList.forEach(function(item) {
    item.addEventListener("click", function() {
      modal.classList.toggle("hide");
      overlay.classList.toggle("hide");
    });
  });

  overlay.addEventListener("click", function() {
    modal.classList.toggle("hide");
    overlay.classList.toggle("hide");
  });
})();

(function() {
  var button = document.querySelector(".form button");
  var emailField = document.getElementById("tel-email");
  var text = document.getElementById("name");

  var link = document.createElement("a");
  link.setAttribute("type", "hidden");
  link.href = "catalog.pdf";
  if (typeof link.download != "undefined") {
    link.download = "catalog.pdf";
  } else {
    link.target = "_blank";
  }

                        /* Form validation */
  var regObj = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    tel: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
    name: /^[а-яА-яіІЇїЄєґҐёЁA-Za-z]+$/
  };

  var contactInputs = document.querySelectorAll('.form__input');

  var hasError = function(field) {
    if(field.type === 'button' || field.type === 'submit') {
      return ;
    }
    
    var emailTest = regObj.email.test(field.value);
    var telephoneTest = regObj.tel.test(field.value);

    if(field.value === '') {
      return 'Пожалуйста заполните поле';
    }
    if(field.name === 'tel-email' && !telephoneTest && !emailTest) { 
      return 'Вы ввели неверный телефон или email'
    }

    if(field.name === 'name' && (field.value.length > 20 || field.value.length < 3 || !regObj.name.test(field.value))) {
      return 'Вы ввели неправильное имя'
    }
  };

  var showError = function (field, error) {

      // Add error class to field
      field.classList.add('form__error');

      // Get field id or name
      var id = field.id || field.name;
      if (!id) return;

      // Check if error message field already exists
      // If not, create one
      var message = field.form.querySelector('.form__error-message#error-for-' + id );
      if (!message) {
          message = document.createElement('div');
          message.className = 'form__error-message';
          message.id = 'error-for-' + id;
          field.parentNode.insertBefore(message, field.nextSibling );
      }

      // Add ARIA role to the field
      field.setAttribute('aria-describedby', 'error-for-' + id);

      // Update error message
      message.innerHTML = error;

      // Show error message
      message.style.display = 'block';
      message.style.visibility = 'visible';
  };

  var removeError = function(field) {
    // Remove error class to field
    field.classList.remove('form__error');

    // Remove ARIA role from the field
    field.removeAttribute('aria-describedby');

    // Get field id or name
    var id = field.id || field.name;
    if (!id) return;

    // Check if an error message is in the DOM
    var message = field.form.querySelector('.form__error-message#error-for-' + id + '');
    if (!message) return;

    // If so, hide it
    message.innerHTML = '';
    message.style.display = 'none';
    message.style.visibility = 'hidden';
  }

    var sendData = function(form) {
    var formData = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", form.action);
    xhr.send(formData);
    
    var len = form.length;
    for(var i = 0; i < len; i++) {
      if(form[i].type !== 'submit') {
        form[i].value = '';
      }
    }
  }

  document.addEventListener('blur', function (event) {
    var error = hasError(event.target);
    if(error) {
      showError(event.target, error);
      return ;
    }
    removeError(event.target);
   }, true);

  document.addEventListener('submit', function(event) {
    // Get all of the form elements
    var fields = event.target.elements;
    // Validate each field
    // Store the first field with an error to a variable so we can bring it into focus later
    var error, hasErrors;
    for (var i = 0; i < fields.length; i++) {
        error = hasError(fields[i]);
        if (error) {
            showError(fields[i], error);
            if (!hasErrors) {
                hasErrors = fields[i];
            }
        }
    }

    // If there are errrors, don't submit form and focus on first element with error
    if(hasErrors) {
        event.preventDefault();
        hasErrors.focus();
    } else if(link.className === "pdf-link") {
      event.preventDefault()
      sendData(event.target);
      link.click();
    } else {
      event.preventDefault();
      sendData(event.target);
      document.body.appendChild(link);
      link.click();
    } 
  }, false);

})();

(function() {
  var lb = new Lightbox({
    selector: '[data-rel="aiLightbox"]', // string
    lazyload: true, // boolean
    arrows: true, // boolean
    counter: true, // boolean
    slideSpeed: 500
  });
})();
