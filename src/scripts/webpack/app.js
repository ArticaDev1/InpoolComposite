const Dev = true;

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

window.onload = function() {
  Resources.init();
  Preloader.init();
  //
  TouchHoverEvents.init();
  Mask.init();
  Scroll.init();

  const activeFunctions = new ActiveFunctions();
  activeFunctions.create();
  activeFunctions.add(SectionVideoAnimation, '.section-video-animation');
  activeFunctions.init();
}

//effects
gsap.registerEffect({
  name: "slidingText",
  effect: ($text) => {
    let anim = gsap.timeline({paused: true, defaults:{duration:1, ease:'none'}})
      .fromTo($text, {autoAlpha:0}, {autoAlpha:1, duration:0.2, stagger:{amount:0.1}})
      .fromTo($text, {y:50}, {y:-50}, `-=0.3`)
      .to($text, {autoAlpha:0, duration:0.2, stagger:{amount:0.1}}, `-=0.3`)
    return anim;
  },
  extendTimeline: true
});

const Resources = {
  init: function() {
    this.framesCount = 0;
    this.framesLoaded = 0;
    this.sources = {
      0: {
        src: './img/drone_video/',
        framesCount: 38,
        frames: []
      }
    }

    this.load = () => {
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

    this.check = () => {
      if(window.innerWidth >= brakepoints.lg && !this.initialized) {
        this.load();
        this.initialized = true;
        console.log('load')
      }
    }

    this.check();
    window.addEventListener('resize', this.check);
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

class ActiveFunctions {
  create() {
    this.functions = [];
  }
  add(clss, blocks) {
    let $blocks = document.querySelectorAll(blocks);
    if($blocks.length) {
      $blocks.forEach($block => {
        this.functions.push(new clss($block));
      });
    }
  }
  init() {
    this.functions.forEach(func => {
      func.init();
    })
  }
  destroy() {
    this.functions.forEach(func => {
      func.destroy();
    })
    this.functions = [];
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
    $body.classList.add('hidden');
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
    
    this.finish = () => {
      if(!Dev) {
        gsap.timeline({onComplete:()=>{
          this.$element.remove();
        }})
          .to(this.$element, {autoAlpha:0, duration:0.5})
          .to($wrapper, {autoAlpha:1})
      } else {
        this.$element.remove();
        gsap.set($wrapper, {autoAlpha:1})
      }

      if(mobile()) {
        $body.style.cssText = 'position:initial;height:initial;width:initial;overflow:auto;';
      }
    }

    if(!Dev) {
      //desktop
      if(window.innerWidth >= brakepoints.lg) {
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
    
    else {
      this.finish();
    }
  }
}

class SectionVideoAnimation {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.check = ()=> {
      if(window.innerWidth >= brakepoints.lg && (!this.initialized || !this.flag)) {
        this.initDesktop();
        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        if(this.initialized) {
          this.destroyDesktop();
        }
        this.flag = false;
      }
    }
    this.check();
    window.addEventListener('resize', this.check);
    this.initialized = true;
  }

  initDesktop() {
    let pinType = Scroll.scrollbar?'transform':'fixed';
    this.$scene = this.$parent.querySelector('.section-video-animation__scene');
    this.$canvas = this.$parent.querySelector('.section-video-animation__scene canvas');
    this.$text = this.$parent.querySelectorAll('.section-video-animation__title, .section-video-animation__text');
    this.context = this.$canvas.getContext("2d");
    this.$canvas.width=1280;
    this.$canvas.height=720;
    this.framesCount = Resources.sources[0].framesCount;
    this.frames = Resources.sources[0].frames;
    this.activeFrame = this.frames[0];
    this.sceneRender = ()=> {
      this.context.drawImage(this.activeFrame, 0, 0);
      this.animationFrame = requestAnimationFrame(this.sceneRender);
    }
    this.sceneRender();

    this.resizeEvent = () => {
      let h = this.$parent.getBoundingClientRect().height,
          w = this.$parent.getBoundingClientRect().width,
          res = this.$canvas.height/this.$canvas.width;

      if (h / w < res) {
        this.$canvas.style.width = `${w}px`;
        this.$canvas.style.height = `${w*res}px`;
      } else {
        this.$canvas.style.width = `${h/res}px`;
        this.$canvas.style.height = `${h}px`;
      }
    }
    this.resizeEvent();
    window.addEventListener('resize', this.resizeEvent);

    this.animation_text = gsap.effects.slidingText(this.$text);
    this.animation_fade_scene = gsap.timeline({paused:true})
      .fromTo(this.$scene, {autoAlpha:0}, {autoAlpha:1, duration:0.3})
      .to(this.$scene, {autoAlpha:0, duration:0.3}, `+=0.4`)


    this.trigger = ScrollTrigger.create({
      trigger: this.$parent,
      start: "top top",
      end: "top+=1500 top",
      pin: true,
      pinType: pinType,
      onUpdate: self => {
        let index = Math.round(self.progress*(this.framesCount-1));
        this.activeFrame = this.frames[index];
        this.animation_text.progress(self.progress);
        this.animation_fade_scene.progress(self.progress);
      }
    });
  }

  destroyDesktop() {
    
  }
}