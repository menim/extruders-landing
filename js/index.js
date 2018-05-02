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

  function checkValidity(field) {
    var regObj = {
      email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      tel: /^\d{3}-\d{3}-\d{4}$/
    };

    var errors = {
      name: 'Вы ввели слишком длинное имя или слишком короткое имя',
      empty: 'Введите значение в поле',
      emailTel: 'Вы ввели неверный телефон или email'
    };
    
    var len = field.value.length;

    function isEmpty(value) {
      return !!value;
    }

    function showError(error, field) {
      field.classList.add('error');

      var id = field.id || field.name;
      if (!id) return;

      // Check if error message field already exists
      // If not, create one
      var message = field.form.querySelector('.error-message#error-for-' + id );
      if (!message) {
          message = document.createElement('div');
          message.className = 'error-message';
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
    }

    if (!isEmpty(field.value)) {
      showError(errors.empty, field);
      return false;
    }

    switch (field.name) {
      case "tel-email":
        if (!regObj.email.test(field.value) && !regObj.tel.test(field.value)) {
          console.log("вы ввели неправильный телефон или email");
          return false;
        }
        break;
      case "name":
        if (len > 20 && len < 3) {
          console.log("превышена длина имени. Максимальная длина 20 символов.");
          return false;
        }
    }
    return true;
  }

  button.addEventListener("click", function() {
    if (checkValidity(text) && checkValidity(emailField) ) {
      if (link.className === "pdf-link") {
        link.click();
      } else {
        document.body.appendChild(link);
        link.click();
      }
    }
  });
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
