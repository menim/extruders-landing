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
    tel: /^\d{3}-\d{3}-\d{4}$/,
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
          field.parentNode.insertBefore( message, field.nextSibling );
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
        link.click();
    } else {      
      document.body.appendChild(link);
      link.click();
    } 

    // Otherwise, let the form submit normally
    // You could also bolt in an Ajax form submit process here

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
