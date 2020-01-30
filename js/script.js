/*magc*/

$('#mostrar-nav').on('click',function(){
	$('nav').toggleClass('mostrar');
})
// Hover-Carousel jQuery plugin
// By Yair Even-Or
// https://github.com/yairEO/hover-carousel
// http://dropthebit.com

;(function($){
  "use strict";

  var bindToClass      = 'carousel',
      containerWidth   = 0,
      scrollWidth      = 0,
      posFromLeft      = 0,    // Stripe position from the left of the screen
      stripePos        = 0,    // When relative mouse position inside the thumbs stripe
      animated         = null,
      $indicator, $carousel, el, $el, ratio, scrollPos, nextMore, prevMore, pos, padding;

  // calculate the thumbs container width
  function calc(e){
      $el = $(this).find(' > .wrap');
      el  = $el[0];
      $carousel = $el.parent();
      $indicator = $el.prev('.indicator');

      nextMore = prevMore  = false; // reset

      containerWidth       = el.clientWidth;
      scrollWidth          = el.scrollWidth; // the "<ul>"" width
      padding              = 0.2 * containerWidth; // padding in percentage of the area which the mouse movement affects
      posFromLeft          = $el.offset().left;
      stripePos            = e.pageX - padding - posFromLeft;
      pos                  = stripePos / (containerWidth - padding*2);
      scrollPos            = (scrollWidth - containerWidth ) * pos;
      
      if( scrollPos < 0 )
        scrollPos = 0;
      if( scrollPos > (scrollWidth - containerWidth) )
        scrollPos = scrollWidth - containerWidth;
    
      $el.animate({scrollLeft:scrollPos}, 200, 'swing');
      
      if( $indicator.length )
          $indicator.css({
              width: (containerWidth / scrollWidth) * 100 + '%',
              left: (scrollPos / scrollWidth ) * 100 + '%'
          });

      clearTimeout(animated);
      animated = setTimeout(function(){
          animated = null;
      }, 200);

      return this;
  }

  // move the stripe left or right according to mouse position
  function move(e){
      // don't move anything until inital movement on 'mouseenter' has finished
      if( animated ) return;

      ratio     = scrollWidth / containerWidth;
      stripePos = e.pageX - padding - posFromLeft; // the mouse X position, "normalized" to the carousel position

      if( stripePos < 0)
          stripePos = 0;

      pos = stripePos / (containerWidth - padding*2); // calculated position between 0 to 1
      // calculate the percentage of the mouse position within the carousel
      scrollPos = (scrollWidth - containerWidth ) * pos;   

      el.scrollLeft = scrollPos;
      if( $indicator[0] && scrollPos < (scrollWidth - containerWidth) )
        $indicator[0].style.left = (scrollPos / scrollWidth ) * 100 + '%';

      // check if element has reached an edge
      prevMore = el.scrollLeft > 0;
      nextMore = el.scrollLeft < (scrollWidth - containerWidth);

      $carousel.toggleClass('left', prevMore);
      $carousel.toggleClass('right', nextMore);
  }

  $.fn.carousel = function(options){
      $(document)
          .on('mouseenter.carousel', '.' + bindToClass, calc)
          .on('mousemove.carousel', '.' + bindToClass, move);
  };

  // automatic binding to all elements which have the class that is assigned to "bindToClass"
  $.fn.carousel();

})(jQuery);


  
/*terminal*/
var bind = Function.prototype.bind,
    $append = bind.call(Element.prototype.appendChild, document.querySelector("output")),
    $new = bind.call(Document.prototype.createElement, document),
    $text = bind.call(Document.prototype.createTextNode, document),
    $rnd = function() { return (Math.random() * 125 + 0)|0; }, 
    $promise = function(thenFn) {
      var args, promise, wait, slice=Array.prototype.slice, isResolved = false;
      var promise = {
        wait: function(ms) {
          wait = ms;
          return promise;
        },
        then: function() {
          args = slice.call(arguments);
          return promise = $promise(thenFn);
        },
        resolve: function() {
          isResolved = true;
          if(args) {
            var next = Function.prototype.bind.apply(thenFn, [undefined].concat(args).concat([promise]));
            wait ? setTimeout(next, wait) : next();
          }

        }
      };
      return promise;
    };

var process = function(target, chars, promise) {
  var first = chars[0], rest = chars.slice(1);
  if(!first) {
    promise.resolve();
    return;
  }
  target.appendChild(first);
  setTimeout(process.bind(undefined, target, rest, promise), $rnd());
}

var type = function(text, promise) {
  var chars = text.split("").map($text);
  promise = promise || $promise(type);
  $append($new("br"));
  process($append($new("q")), chars, promise);
  return promise;
};

type("</>Probando....")
  .wait(500)
  .then("Este es el sitio web de DYDETEC...")
  .then("Creado especialmente para ti...")
  .wait(1500)
  .then("Sabemos que tienes ideas nuevas, por ello facilitamos el diseño y desarrollo de tus proyectos de Software, Hardware, Firmware e industria 4.0; y complementamos con Diseño Mecánico, Gráfico e Industrial.")
.wait(0);

/*typing effect*/
var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};
