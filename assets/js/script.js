(function ($) {
  'use strict';

  // Preloader js    
  $(window).on('load', function () {
    $('.preloader').fadeOut(100);
  });

  // navigation
  $(document).ready(function () {
    // Apply class based on initial scroll position
    if ($(window).scrollTop() > 1) {
      $('.navigation').addClass('nav-bg');
    } else {
      $('.navigation').removeClass('nav-bg');
    }
  
    // Apply class on scroll
    $(window).scroll(function () {
      if ($(window).scrollTop() > 1) {
        $('.navigation').addClass('nav-bg');
      } else {
        $('.navigation').removeClass('nav-bg');
      }
    });
  });
})(jQuery);

$('.navbar-nav>li>a').on('click', function(){
  $('.navbar-collapse').collapse('hide');
});

const words = ["Digital", "Artificial Intelligence", "Software", "Data"];
let i = 0;
let timer;

function typingEffect() {
    let word = words[i].split("");
    var loopTyping = function() {
        if (word.length > 0) {
            document.getElementById('word').innerHTML += word.shift();
        } else {
            // After typing a word, wait for 2 seconds before starting deletion
            setTimeout(deletingEffect, 3000);
            return false;
        };
        timer = setTimeout(loopTyping, 100);
    };
    loopTyping();
};

function deletingEffect() {
    let word = words[i].split("");
    var loopDeleting = function() {
        if (word.length > 0) {
            word.pop();
            document.getElementById('word').innerHTML = word.join("");
        } else {
            if (words.length > (i + 1)) {
                i++;
            } else {
                i = 0;
            };
            typingEffect();
            return false;
        };
        timer = setTimeout(loopDeleting, 50);
    };
    loopDeleting();
};

typingEffect();
