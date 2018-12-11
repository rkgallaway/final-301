'use strict';

$('.hamburger').on('click', () => {

  $('.nav').animate({
    height: 'toggle',
    color: 'green',
  },100);

});

function toggleFunction() {
  let $class = $(".hideStuff");
  let $plus = $(".plus");
  let $minus = $(".minus");
  if ($class.css("display") === 'flex') {
    $class.css("display", "none");
    $plus.css("display", "flex");
    $minus.css("display", "none");
  } else {
    $class.css("display", "flex");
    $plus.css("display", "none");
    $minus.css("display", "flex");
  }
}


