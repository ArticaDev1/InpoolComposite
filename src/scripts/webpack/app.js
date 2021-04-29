const Dev = false;

import 'lazysizes';
//gsap
import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({
  ease: "power2.inOut", 
  duration: 1
});
import Scrollbar from 'smooth-scrollbar';
const validate = require("validate.js");
import scrollLock from 'scroll-lock';
import Inputmask from "inputmask";

const brakepoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1600
}
const $body = document.body;
const $wrapper = document.querySelector('.wrapper');
const $header = document.querySelector('.header');

//check device
function mobile() {
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    return true;
  } else {
    return false;
  }
}

window.onload = function(){
  TouchHoverEvents.init();
  Mask.init();
  Scroll.init();
  Preloader.init();
}

const Resources = {
  load: function() {
    this.framesCount = 0;
    this.framesLoaded = 0;
    this.sources = {
      0: {
        src: './img/drone_video/',
        framesCount: 38,
        frames: []
      }
    }
    for(let source in this.sources) {
      for(let i = 0; i < this.sources[source].framesCount; i++) {
        this.sources[source].frames[i] = new Image();
        this.sources[source].frames[i].onload = ()=> {
          this.framesLoaded++;
        }
        this.sources[source].frames[i].src = `${this.sources[source].src+(1+i)}.jpg`;
      }
      this.framesCount+=this.sources[source].framesCount;
    }
  }
};

const TouchHoverEvents = {
  targets: 'a, button, label, tr, [data-touch-hover], .scrollbar-track, .scrollbar-thumb',
  touched: false,
  touchEndDelay: 100, //ms
  init: function() {
    document.addEventListener('touchstart',  (event)=>{this.events(event)});
    document.addEventListener('touchend',    (event)=>{this.events(event)});
    document.addEventListener('mouseenter',  (event)=>{this.events(event)},true);
    document.addEventListener('mouseleave',  (event)=>{this.events(event)},true);
    document.addEventListener('mousedown',   (event)=>{this.events(event)});
    document.addEventListener('mouseup',     (event)=>{this.events(event)});
    document.addEventListener('contextmenu', (event)=>{this.events(event)});
  },
  events: function(event) {
    let $targets = [];
    $targets[0] = event.target!==document?event.target.closest(this.targets):null;
    let $element = $targets[0], i = 0;

    while($targets[0]) {
      $element = $element.parentNode;
      if($element!==document) {
        if($element.matches(this.targets)) {
          i++;
          $targets[i] = $element;
        }
      } 
      else {
        break;
      }
    }

    //touchstart
    if(event.type=='touchstart') {
      this.touched = true;
      if(this.timeout) clearTimeout(this.timeout);
      if($targets[0]) {
        for(let $target of $targets) $target.setAttribute('data-touch', '');
      }
    } 
    //touchend
    else if(event.type=='touchend' || (event.type=='contextmenu' && this.touched)) {
      this.timeout = setTimeout(() => {this.touched = false}, 500);
      if($targets[0]) {
        setTimeout(()=>{
          for(let $target of $targets) {
            $target.dispatchEvent(new CustomEvent("customTouchend"));
            $target.removeAttribute('data-touch');
          }
        }, this.touchEndDelay)
      }
    } 
    
    //mouseenter
    if(event.type=='mouseenter' && !this.touched && $targets[0] && $targets[0]==event.target) {
      $targets[0].setAttribute('data-hover', '');
    }
    //mouseleave
    else if(event.type=='mouseleave' && !this.touched && $targets[0] && $targets[0]==event.target) {
      $targets[0].removeAttribute('data-focus');
      $targets[0].removeAttribute('data-hover');
    }
    //mousedown
    if(event.type=='mousedown' && !this.touched && $targets[0]) {
      $targets[0].setAttribute('data-focus', '');
    } 
    //mouseup
    else if(event.type=='mouseup' && !this.touched  && $targets[0]) {
      $targets[0].removeAttribute('data-focus');
    }
  }
}

const Scroll = {
  init: function() {
    this.y = 0;
    if(mobile()) {
      this.native();
    } else {
      this.custom(); 
    }
  },
  custom: function() {
    this.scrollbar = Scrollbar.init($wrapper, {
      damping: 0.2
    })
    this.scrollbar.addListener(()=>{
      if(Dev) localStorage.setItem('scroll', this.scrollbar.offset.y);
      this.y = this.scrollbar.offset.y;
    })
    if(Dev) this.scrollbar.setPosition(0, +localStorage.getItem('scroll'));
    this.$scrollbar = document.querySelector('.scrollbar-track-y');
    //gsap trigger
    let scrollbar = this.scrollbar;
    ScrollTrigger.scrollerProxy($body, {
      scrollTop(value) {
        if (arguments.length) {
          scrollbar.scrollTop = value
        }
        return scrollbar.scrollTop;
      },
      getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
      }
    });
    this.scrollbar.addListener(ScrollTrigger.update);
  },
  native: function() {
    window.addEventListener('scroll', ()=>{
      this.y = window.pageYOffset;
    })
  },
  scrollTop: function(y, speed) {
    if(speed>0) this.inScroll=true;
    //custom
    if(this.scrollbar) {
      if(speed>0) {
        this.animation = gsap.to(this.scrollbar, {scrollTop:y, duration:speed, ease:'power2.inOut', onComplete:()=>{
          this.inScroll=false;
        }});
      } else {
        gsap.set(this.scrollbar, {scrollTop:y});
      }
    } 
    //native
    else {
      let scroll = {y:this.y};
      if(speed>0) {
        this.animation = gsap.to(scroll, {y:y, duration:speed, ease:'power2.inOut', onComplete:()=>{
          this.inScroll=false;
          cancelAnimationFrame(this.frame);
        }})
        this.checkScroll = ()=>{
          window.scrollTo(0, scroll.y);
          this.frame = requestAnimationFrame(()=>{this.checkScroll()});
        }
        this.checkScroll();
      } else {
        window.scrollTo(0, y);
      }
    }
  },
  stop: function() {
    this.inScroll=false;
    if(this.animation) this.animation.pause();
    if(this.frame) cancelAnimationFrame(this.frame);
  },
  addListener: function(func) {
    //custom
    if(this.scrollbar) {
      this.scrollbar.addListener(func);
    }
    //native
    else {
      window.addEventListener('scroll', func);
    }
  }, 
  removeListener: function(func) {
    //custom
    if(this.scrollbar) {
      this.scrollbar.removeListener(func);
    }
    //native 
    else {
      window.removeEventListener('scroll', func);
    }
  }
}

const Mask = {
  init: function() {
    Inputmask({
      mask: "+7 999 999-9999",
      showMaskOnHover: false,
      clearIncomplete: false
    }).mask('[data-phone]');
  }
}

const Preloader = {
  init: function() {
    this.$element = document.querySelector('.preloader');
    this.$item = document.querySelector('.preloader__item');
    
    if(!Dev) {
      //desktop
      if(!mobile()) {
        Resources.load();
        this.check = () => {
          this.time = 50;
          this.timer = setInterval(() => {
            this.time+=50;
          }, 50);
          this.animationFrame = requestAnimationFrame(this.check);
          //animation
          this.$item.style.opacity = '1';
          this.$item.setAttribute('y', `${100-(Resources.framesLoaded/Resources.framesCount*100)}%`);
          //
          if(Resources.framesLoaded==Resources.framesCount) {
            cancelAnimationFrame(this.animationFrame);
            clearInterval(this.timer);
            if(this.time<500) {
              setTimeout(() => {
                this.finish();
              }, 500-this.time);
            } else {
              this.finish();
            }
          } 
        }
        this.check();
      }
      //mobile
      else {
        this.$item.style.transition = 'initial';
        this.$item.setAttribute('y', '0');
        gsap.to(this.$item, {autoAlpha:1, duration:0.5, onComplete:()=>{
          this.finish();
        }})
      }
    }

    this.finish = () => {
      gsap.timeline({onComplete:()=>{
        this.$element.remove();
      }})
        .to(this.$element, {autoAlpha:0, duration:0.5})
        .to($wrapper, {autoAlpha:1})
        

      if(mobile()) {
        $body.style.cssText = 'position:initial;height:initial;width:initial;overflow:auto;';
      }
    }
  }
}