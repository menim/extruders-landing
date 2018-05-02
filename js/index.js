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
  var link = document.createElement("a");
  link.setAttribute("type", "hidden");
  link.href = "catalog.pdf";
  if (typeof link.download != "undefined") {
    link.download = "catalog.pdf";
  } else {
    link.target = "_blank";
  }
  button.addEventListener("click", function() {
    if (link.className === "pdf-link") {
      link.click();
    } else {
      document.body.appendChild(link);
      link.click();
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
