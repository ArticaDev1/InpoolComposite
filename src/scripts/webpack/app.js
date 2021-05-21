const Dev = true;

import 'lazysizes';
lazySizes.cfg.preloadAfterLoad = true;
//gsap
import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
gsap.defaults({
  ease: "power2.inOut", 
  duration: 1
});
import Scrollbar, {ScrollbarPlugin} from 'smooth-scrollbar';
class SoftScrollPlugin extends ScrollbarPlugin {
  static pluginName = 'SoftScroll';
  transformDelta(delta, fromEvent) {
    const dirX = delta.x > 0 ? 1 : -1;
    const dirY = delta.y > 0 ? 1 : -1;
    if (dirX === this.lockX || dirY === this.lockY) {
      return {x: 0, y: 0};
    } else {
      this.lockX = null;
      this.lockY = null;
    }
    return delta;
  }
  onRender(Data2d) {
    const {x, y} = Data2d;
    if(y<0 && !this.lockY && Math.abs(y) >= this.scrollbar.scrollTop) {
      this.scrollbar.setMomentum(0, -this.scrollbar.scrollTop);
      this.lockY = -1;
    }
    if(x<0 && !this.lockX && Math.abs(x) >= this.scrollbar.scrollLeft) {
      this.scrollbar.setMomentum(-this.scrollbar.scrollLeft, 0);
      this.lockX = -1;
    }
    if(x>0 && !this.lockX && Math.abs(x) >= (this.scrollbar.limit.x - this.scrollbar.scrollLeft)) {
      this.scrollbar.setMomentum((this.scrollbar.limit.x - this.scrollbar.scrollLeft), 0);
      this.lockX = 1;
    }
    if(y>0 && !this.lockY && Math.abs(y) >= (this.scrollbar.limit.y - this.scrollbar.scrollTop)) {
      this.scrollbar.setMomentum(0, (this.scrollbar.limit.y - this.scrollbar.scrollTop));
      this.lockY = 1;
    }
    if(y === 0) this.lockY = null;
    if(x === 0) this.lockX = null;
  }
}
Scrollbar.use(SoftScrollPlugin);

const validate = require("validate.js");
import SwipeListener from 'swipe-listener';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import Inputmask from "inputmask";
import autosize from 'autosize';
import Swiper, {Pagination, Lazy, EffectFade} from 'swiper/core';
Swiper.use([Pagination, Lazy, EffectFade]);

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
const $consol = document.querySelector('.consol');

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
  Validation.init();
  inputs();
  TouchHoverEvents.init();
  Scroll.init();
  Modal.init();

  if(!mobile()) {
    Parallax.init();
    Cursor.init();
  } else {
    windowSize.init();
  }

  const activeFunctions = new ActiveFunctions();
  activeFunctions.create();
  activeFunctions.add(Section3d, '.section-3d');
  activeFunctions.add(SectionAnimated, '.section-animated');
  activeFunctions.add(DesktopModelsList, '.desktop-models-list');
  activeFunctions.add(ColorsSlider, '.colors-slider');
  activeFunctions.add(SectionVideoAnimation, '.section-video-animation');
  activeFunctions.add(SectionTechnologies, '.section-technologies');
  activeFunctions.add(ModelsSlider, '.models-slider');
  activeFunctions.add(Map, '.contacts-block__map');
  activeFunctions.add(ParallaxImage, '.parallax-image');
  activeFunctions.init();

  //preload
  Preloader.init();
}

//effects
gsap.registerEffect({
  name: "slidingText", //1500px
  effect: ($outer, $inner) => {
    let anim = gsap.timeline({paused: true})
      .fromTo($outer, {autoAlpha:0}, {autoAlpha:1, duration:0.33, ease:'power2.in'})
      .fromTo($inner, {y:50}, {y:-50, ease:'none'}, `-=0.33`)
      .to($outer, {autoAlpha:0, duration:0.3, ease:'power2.out'}, `-=0.33`)
    return anim;
  },
  extendTimeline: true
});
gsap.registerEffect({
  name: "slidingTextSlow", //2500px
  effect: ($outer, $inner) => {
    let anim = gsap.timeline({paused: true})
      .fromTo($outer, {autoAlpha:0}, {autoAlpha:1, duration:0.2, ease:'power2.in'})
      .fromTo($inner, {y:83}, {y:-83, ease:'none'}, `-=0.2`)
      .to($outer, {autoAlpha:0, duration:0.2, ease:'power2.out'}, `-=0.2`)
    return anim;
  },
  extendTimeline: true
});

function inputs() {
  autosize(document.querySelectorAll('textarea.input__element'));
  
  let events = (event)=> {
    let $input = event.target!==document?event.target.closest('.input__element'):null;
    if($input) {
      if(event.type=='focus') {
        $input.parentNode.classList.add('focused', 'filled');
      } else {
        $input.parentNode.classList.remove('focused');
        let value = $input.value;
        if (validate.single(value, {presence: {allowEmpty: false}}) !== undefined) {
          $input.value = '';
          $input.parentNode.classList.remove('filled');
          //textarea
          if($input.tagName=='TEXTAREA') {
            if(window.innerWidth>=brakepoints.xxl) {
              $input.style.height = '68px';
            } else if(window.innerWidth>=brakepoints.xl) {
              $input.style.height = '62px';
            } else {
              $input.style.height = '56px';
            } 
          }
        }
      }
    }
  }
  document.addEventListener('focus',  (event)=>{events(event)}, true);
  document.addEventListener('blur',   (event)=>{events(event)}, true);
}

const windowSize = {
  init: function() {
    let $el = document.createElement('div');
    $el.style.cssText = 'position:fixed;height:100%;';
    $body.insertAdjacentElement('beforeend', $el);
    let h = $el.getBoundingClientRect().height;

    document.querySelectorAll('.js-mobile-screen').forEach($this => {
      $this.style.height = `${h}px`;
    })
  }
}

const Resources = {
  init: function() {
    this.framesLoaded = 0;
    this.sources = {
      0: {
        src: './img/model/1/',
        type: 'png',
        framesCount: 98,
        frames: []
      },
      1: {
        src: './img/model/2/',
        type: 'png',
        framesCount: 84,
        frames: []
      },
      2: {
        src: './img/model/3/',
        type: 'jpg',
        framesCount: 100,
        frames: []
      },
      3: {
        src: './img/model/4/',
        type: 'png',
        framesCount: 22,
        frames: []
      },
      4: {
        src: './img/drone_video/',
        type: 'jpg',
        framesCount: 40,
        frames: []
      },
    }

    this.load = () => {
      //load first scene
      for(let i = 0; i < this.sources[0].framesCount; i++) {
        this.sources[0].frames[i] = new Image();
        this.sources[0].frames[i].onload = ()=> {
          this.framesLoaded++;
          //dirst loaded
          if(this.framesLoaded==this.sources[0].framesCount) {
            //load else
            for(let source in this.sources) {
              if(source>0) {
                for(let i = 0; i < this.sources[source].framesCount; i++) {
                  this.sources[source].frames[i] = new Image();
                  this.sources[source].frames[i].onload = ()=> {
                    this.framesLoaded++;
                  }
                  let name = (i + 1).toString().padStart(3, '0'),
                      type = this.sources[source].type;
                  this.sources[source].frames[i].src = `${this.sources[source].src+name}.${type}`;
                }
              }
            }

          }
        }
        let name = (i + 1).toString().padStart(3, '0'),
            type = this.sources[0].type;
        this.sources[0].frames[i].src = `${this.sources[0].src+name}.${type}`;
      }
    }

    this.check = () => {
      if(window.innerWidth >= brakepoints.lg && !this.initialized) {
        this.load();
        this.initialized = true;
      }
    }

    this.check();
    window.addEventListener('resize', this.check);
  }
};

const TouchHoverEvents = {
  targets: 'a, button, [data-touch-hover], .scrollbar-track, .scrollbar-thumb, .input',
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
      window.dispatchEvent(new CustomEvent("cursorMouseenter", {
        detail:{target:$targets[0]}
      }));
    }
    //mouseleave
    else if(event.type=='mouseleave' && !this.touched && $targets[0] && $targets[0]==event.target) {
      $targets[0].removeAttribute('data-hover');
      $targets[0].removeAttribute('data-click');
      window.dispatchEvent(new CustomEvent("cursorMouseleave", {
        detail:{target:$targets[0]}
      }));
    }
    //mousedown
    if(event.type=='mousedown' && !this.touched && $targets[0]) {
      $targets[0].setAttribute('data-click', '');
      window.dispatchEvent(new CustomEvent("cursorMousedown", {
        detail:{target:$targets[0]}
      }));
    } 
    //mouseup
    else if(event.type=='mouseup' && !this.touched  && $targets[0]) {
      $targets[0].removeAttribute('data-click');
      window.dispatchEvent(new CustomEvent("cursorMouseup", {
        detail:{target:$targets[0]}
      }));
    }
  }
}

const Parallax = {
  init: function() {
    Scroll.addListener(this.update);
  },
  update: function() {
    let $items = document.querySelectorAll('[data-parallax]');
    $items.forEach(($this)=>{
      let y = $this.getBoundingClientRect().y,
          h1 = window.innerHeight,
          h2 = $this.getBoundingClientRect().height,
          scroll = Scroll.y,
          factor = +$this.getAttribute('data-parallax'),
          val = ((scroll+h1/2) - (y+scroll+h2/2)) * factor;
      $this.style.transform = `translate3d(0, ${val}px, 0)`;
    })
  }
}

const Validation = {
  init: function () {
    this.namspaces = {
      name: 'name',
      phone: 'phone',
      email: 'email',
      message: 'message'
    }
    this.constraints = {
      name: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваше имя'
        },
        format: {
          pattern: /[A-zА-яЁё ]+/,
          message: '^Введите корректное имя'
        },
        length: {
          minimum: 2,
          tooShort: "^Имя слишком короткое (минимум %{count} символа)",
          maximum: 20,
          tooLong: "^Имя слишком длинное (максимум %{count} символов)"
        }
      },
      phone: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваш номер телефона'
        },
        format: {
          pattern: /^\+7 \d{3}\ \d{3}\-\d{4}$/,
          message: '^Введите корректный номер телефона'
        }
      },
      email: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваш email'
        },
        email: {
          message: '^Неправильный формат email-адреса'
        }
      },
      message: {
        presence: {
          allowEmpty: false,
          message: '^Введите ваше сообщение'
        },
        length: {
          minimum: 2,
          tooShort: "^Сообщение слишком короткое (минимум %{count} символа)",
          maximum: 100,
          tooLong: "^Сообщение слишком длинное (максимум %{count} символов)"
        }
      }
    };
    Inputmask({
      mask: "+7 999 999-9999",
      showMaskOnHover: false,
      clearIncomplete: false
    }).mask('[data-validate="phone"]');

    gsap.registerEffect({
      name: "fadeMessages",
      effect: ($message) => {
        return gsap.timeline({paused:true})
          .fromTo($message, {autoAlpha: 0}, {autoAlpha:1, duration:0.3, ease:'power2.inOut'})
      }
    });

    document.addEventListener('submit', (event) => {
      let $form = event.target,
        $inputs = $form.querySelectorAll('input, textarea'),
        l = $inputs.length,
        i = 0;
      while (i < l) {
        if ($inputs[i].getAttribute('data-validate')) {
          event.preventDefault();
          let flag = 0;
          $inputs.forEach(($input) => {
            if (!this.validInput($input)) flag++;
          })
          if (!flag) this.submitEvent($form);
          break;
        } else i++
      }
    })

    document.addEventListener('input', (event) => {
      let $input = event.target,
        $parent = $input.parentNode;
      if ($parent.classList.contains('error')) {
        this.validInput($input);
      }
    })

  },
  validInput: function ($input) {
    let $parent = $input.parentNode,
      type = $input.getAttribute('data-validate'),
      required = $input.getAttribute('data-required') !== null,
      value = $input.value,
      empty = validate.single(value, {
        presence: {
          allowEmpty: false
        }
      }) !== undefined,
      resault;

    for (let key in this.namspaces) {
      if (type == key && (required || !empty)) {
        resault = validate.single(value, this.constraints[key]);
        break;
      }
    }
    //если есть ошибки
    if (resault) {
      if (!$parent.classList.contains('error')) {
        $parent.classList.add('error');
        $parent.insertAdjacentHTML('beforeend', `<span class="input__message">${resault[0]}</span>`);
        let $message = $parent.querySelector('.input__message');
        gsap.effects.fadeMessages($message).play();
      } else {
        $parent.querySelector('.input__message').textContent = `${resault[0]}`;
      }
      return false;
    }
    //если нет ошибок
    else {
      if ($parent.classList.contains('error')) {
        $parent.classList.remove('error');
        let $message = $parent.querySelector('.input__message');
        gsap.effects.fadeMessages($message).reverse(1).eventCallback('onReverseComplete', () => {
          $message.remove();
        });
      }
      return true;
    }
  },
  reset: function ($form) {
    let $inputs = $form.querySelectorAll('input, textarea');
    $inputs.forEach(($input) => {
      let $parent = $input.parentNode;
      $input.value = '';
      //textarea
      if($input.tagName=='TEXTAREA') {
        if(window.innerWidth>=brakepoints.xxl) {
          $input.style.height = '68px';
        } else if(window.innerWidth>=brakepoints.xl) {
          $input.style.height = '62px';
        } else {
          $input.style.height = '56px';
        } 
      }
      $parent.classList.remove('focused', 'filled');
      
      if ($parent.classList.contains('error')) {
        $parent.classList.remove('error');
        let $message = $parent.querySelector('.input__message');
        gsap.effects.fadeMessages($message).reverse(1).eventCallback('onReverseComplete', ()=>{
          $message.remove();
        });
      }
    })
  },
  submitEvent: function ($form) {
    let $submit = $form.querySelector('button'),
        $inputs = $form.querySelectorAll('input, textarea');
    $inputs.forEach(($input) => {
      $input.parentNode.classList.add('loading');
    })
    $submit.classList.add('loading');
    //test
    setTimeout(() => {
      $inputs.forEach(($input) => {
        $input.parentNode.classList.remove('loading');
      })
      $submit.classList.remove('loading');
      this.reset($form);
      Modal.open(document.querySelector('#modal-succes'));
      setTimeout(()=>{
        Modal.close();
      }, 2000)
    }, 2000)
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
      damping: 0.1,
      thumbMinSize: 100,
      plugins: {
        SoftScroll:{}
      }
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

const Preloader = {
  init: function() {
    this.$element = document.querySelector('.preloader');
    this.$item = document.querySelector('.preloader__item');
    
    this.finish = () => {
      if(!Dev) {
        gsap.timeline({onComplete:()=>{
          window.dispatchEvent(new Event("start"));
          this.$element.remove();
        }})
          .to(this.$element, {autoAlpha:0, duration:0.5})
          .to($wrapper, {autoAlpha:1}, '-=0.5')
      } 
      else {
        window.dispatchEvent(new Event("start"));
        this.$element.remove();
        gsap.set($wrapper, {autoAlpha:1});
      }

      if(mobile()) {
        $body.style.cssText = 'position:initial;height:initial;width:initial;overflow:auto;';
      }
    }

    if(!Dev) {
      //desktop
      if(window.innerWidth >= brakepoints.lg) {
        this.check = () => {
          this.animationFrame = requestAnimationFrame(this.check);
          //animation
          this.$item.style.opacity = '1';
          this.$item.setAttribute('y', `${100-(Math.min(Resources.framesLoaded/Resources.sources[0].framesCount, 1)*100)}%`);
          //frames loaded
          if(Resources.framesLoaded>=Resources.sources[0].framesCount) {
            cancelAnimationFrame(this.animationFrame);
            clearInterval(this.timer);
            setTimeout(() => {
              this.finish();
            }, 250);
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

const Cursor = {
  init: function() {
    this.$parent = document.querySelector('.cursor');
    this.$element = this.$parent.querySelector('.cursor__element');
    document.addEventListener('mousemove', (event)=>{
      let x = event.clientX,
          y = event.clientY;
      gsap.to(this.$parent, {duration:0.5,x:x,y:y,ease:'power2.out'})
    });
    document.addEventListener('mouseleave', (event)=>{
      this.$element.classList.add('hidden');
    })
    document.addEventListener('mouseenter', (event)=>{
      this.$element.classList.remove('hidden');
    })

    window.addEventListener('cursorMouseenter', (event)=> {
      Cursor.$element.classList.add('hover');
      if(event.detail.target.getAttribute('data-cursor')=='light') {
        Cursor.$element.classList.add('light');
      }
    })

    window.addEventListener('cursorMouseleave', (event)=> {
      if(this.hoverTimer) clearTimeout(this.hoverTimer)
      if(Cursor.$element.classList.contains('click')) {
        Cursor.$element.classList.remove('click');
        this.hoverTimer = setTimeout(() => {
          Cursor.$element.classList.remove('hover');
        }, 150);
      } else {
        Cursor.$element.classList.remove('hover');
      }
      if(event.detail.target.getAttribute('data-cursor')=='light') {
        Cursor.$element.classList.remove('light');
      }
    })

    window.addEventListener('cursorMousedown', (event)=> {
      Cursor.$element.classList.add('click');
      if(this.clickTimer) clearTimeout(this.clickTimer)
    })

    window.addEventListener('cursorMouseup', (event)=> {
      this.clickTimer = setTimeout(() => {
        Cursor.$element.classList.remove('click');
      }, 150);
    })
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
    this.$inner = this.$parent.querySelector('.section-video-animation__inner');
    this.$scene = this.$parent.querySelector('.section-video-animation__scene');
    this.$canvas = this.$parent.querySelector('.section-video-animation__scene canvas');
    this.$text = this.$parent.querySelector('.section-video-animation__container');
    this.context = this.$canvas.getContext("2d");
    this.$canvas.width=1280;
    this.$canvas.height=720;
    this.framesCount = Resources.sources[4].framesCount;
    this.frames = Resources.sources[4].frames;
    this.activeFrame = this.frames[0];
    this.sceneRender = ()=> {
      if(this.activeFrame) {
        this.context.drawImage(this.activeFrame, 0, 0);
      }
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

    let $color_title = getComputedStyle(document.documentElement).getPropertyValue('--color-text-accent'),
        $color_text = getComputedStyle(document.documentElement).getPropertyValue('--color-text'),
        $color_active = getComputedStyle(document.documentElement).getPropertyValue('--color-text-light'),
        $title = this.$parent.querySelector('.section-video-animation__title'),
        $text = this.$parent.querySelector('.section-video-animation__text');
    this.animation_text = gsap.effects.slidingTextSlow(this.$text, this.$text);
    this.animation_fade_scene = gsap.timeline({paused:true})
      .fromTo(this.$scene, {autoAlpha:0}, {autoAlpha:1, duration:0.5})
      .fromTo($title, {css:{color:$color_title}}, {css:{color:$color_active}, duration:0.5}, '-=0.5')
      .fromTo($text, {css:{color:$color_text}}, {css:{color:$color_active}, duration:0.5}, '-=0.5')
      .to($title, {css:{color:$color_title}, duration:0.5})
      .to($text, {css:{color:$color_text}, duration:0.5}, '-=0.5')
      .to(this.$scene, {autoAlpha:0, duration:0.5}, `-=0.5`)


    this.trigger = ScrollTrigger.create({
      trigger: this.$inner,
      start: "top top",
      end: "+=2500",
      pinSpacing: false,
      pin: true,
      pinType: pinType,
      onUpdate: self => {
        let y = 2500*self.progress;
        let progress2 = Math.max(0, Math.min((y-500)/1500, 1));
        let index = Math.round(progress2*(this.framesCount-1));
        this.activeFrame = this.frames[index];
        this.animation_fade_scene.progress(progress2);
        this.animation_text.progress(self.progress);
      }
    });
  }

  destroyDesktop() {
    
  }
}

class SectionTechnologies {
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
    this.$content = this.$parent.querySelector('.section-technologies__container');
    this.$blocks = this.$parent.querySelectorAll('.technologies-block');

    this.animations_parallax = []
    this.triggers_parallax = [];
    this.$blocks.forEach(($block, index) => {
      //parallax
      let $image_container = $block.querySelector('.technologies-block__image'),
          $image = $image_container.querySelector('img');
      this.animations_parallax[index] = gsap.timeline({paused:true}) 
        .to($image, {yPercent:40, ease:'none'})

      this.triggers_parallax[index] = ScrollTrigger.create({
        trigger: $image_container,
        start: "top bottom",
        end: "bottom top",
        onUpdate: self => {
          this.animations_parallax[index].progress(self.progress);
        }
      });
    })

    this.animation_fade = gsap.timeline({paused:true}) 
      .fromTo(this.$content, {autoAlpha:0}, {autoAlpha:1, ease:'power2.in'})

    this.trigger_fade = ScrollTrigger.create({
      trigger: this.$content,
      start: 'top bottom',
      end: '+=300',
      onUpdate: self => {
        this.animation_fade.progress(self.progress);
      }
    });
    
  }


}

class SectionAnimated {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    let pinType = Scroll.scrollbar?'transform':'fixed';

    this.$head = this.$parent.querySelector('.animated-head');
    this.$head_inner = this.$head.querySelectorAll('.animated-head__container');
    this.$content = this.$parent.querySelector('.section-animated__content');

    this.animation_head = gsap.effects.slidingText(this.$head, this.$head_inner);

    this.animation_head_trigger = ScrollTrigger.create({
      trigger: this.$head,
      start: "top top",
      end: "+=1500",
      pin: true,
      pinSpacing: false,
      pinType: pinType,
      onUpdate: self => {
        this.animation_head.progress(self.progress);
        $consol.insertAdjacentHTML('afterbegin', `<p>${self.progress}</p>`)
      }
    });

    this.animation_content = gsap.timeline({paused:true})
      .fromTo(this.$content, {autoAlpha:0}, {autoAlpha:1, ease:'power2.in'})

    this.animation_content_trigger = ScrollTrigger.create({
      trigger: this.$content,
      start: "top bottom",
      end: "+=300",
      onUpdate: self => {
        this.animation_content.progress(self.progress);
      }
    });
  }

}

class Map {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.apiKey = '4db33d7a-110f-4ffa-8835-327389c45d9d';

    let loadMap = ()=> {
      if(typeof ymaps === 'undefined') {
        let callback = ()=> {
          ymaps.ready(createMap);
        }
        let script = document.createElement("script");
        script.type = 'text/javascript';
        script.onload = callback;
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${this.apiKey}&lang=ru_RU`;
        $body.appendChild(script);
      } else {
        createMap();
      }
    }
    
    let createMap = ()=> {
      this.map = new ymaps.Map(this.$parent, {
        center: [55.777949, 37.227639],
        controls: ['zoomControl'],
        zoom: 14
      });
      this.map.behaviors.disable(['scrollZoom']);
      this.placemarks = [];
      this.$map = this.map.container._element;
      this.$map.classList.add('contacts-block__map-element');
      gsap.fromTo(this.$map, {autoAlpha:0}, {autoAlpha:1})

      let placemark = new ymaps.Placemark(this.map.getCenter(), {
        balloonContent: 'Россия, Московская область, Красногорский район, Ильинское сельское поселение, Новорижское шоссе, 27-й км (10 км от МКАД), Садовый центр Балтия Гарден,  Центр Бассейнов'
      }, {
        iconLayout: 'default#image',
        iconImageHref: './img/icons/map-point.svg',
        iconImageSize: [38, 53],
        iconImageOffset: [-19, -53],
        hideIconOnBalloonOpen: false
      });
      this.map.geoObjects.add(placemark);
    }


    setTimeout(() => {
      loadMap();
    }, 5000);
  }

  destroy() {
    for(let child in this) delete this[child];
  }
}

const Modal = {
  init: function () {
    gsap.registerEffect({
      name: "modal",
      effect: ($modal, $content) => {
        let anim = gsap.timeline({paused: true}).fromTo($modal, {autoAlpha: 0}, {autoAlpha:1, duration:0.5, ease: 'power2.inOut'})
          .fromTo($content, {y: 20}, {y:0, duration:1, ease:'power2.out'}, `-=0.5`)
        return anim;
      },
      extendTimeline: true
    });

    document.addEventListener('click', (event) => {
      let $open = event.target.closest('[data-modal="open"]'),
        $close = event.target.closest('[data-modal="close"]'),
        $wrap = event.target.closest('.modal'),
        $block = event.target.closest('.modal-block');

      //open
      if ($open) {
        event.preventDefault();
        let $modal = document.querySelector(`${$open.getAttribute('href')}`);
        this.open($modal);
      }
      //close 
      else if ($close || (!$block && $wrap)) {
        this.close();
      }
    })

  },
  open: function ($modal) {
    let open = ()=> {
      disablePageScroll();
      $modal.classList.add('active');
      //scrollbar create
      if(!Scrollbar.get($modal) && !mobile()) {
        let scrollbar = Scrollbar.init($modal, {
          damping: 0.1,
          plugins: {
            SoftScroll:{}
          }
        });
        scrollbar.track.yAxis.element.querySelector('.scrollbar-thumb').classList.add('scrollbar-thumb_modal');
      }
      //animation
      let $content = $modal.querySelector('.modal-block')
      this.animation = gsap.effects.modal($modal, $content);
      this.animation.play();
      this.$active = $modal;
    }
    if($modal) {
      if(this.$active) this.close(open);
      else open();
    }
  },
  close: function (callback) {
    if(this.$active) {
      this.animation.timeScale(2).reverse().eventCallback('onReverseComplete', ()=> {
        delete this.animation;
        enablePageScroll();
        this.$active.classList.remove('active');
        //scroll top
        let scrollbar = Scrollbar.get(this.$active);
        if(scrollbar) scrollbar.scrollTop = 0;
        delete this.$active;
        if(callback) callback();
      })
    }
  }
}

class Section3d {
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
    this.$scene = this.$parent.querySelector('.section-3d__scene');
    this.$scene_inner = this.$parent.querySelector('.section-3d__scene-inner');
    this.$scene_canvas = this.$parent.querySelector('.section-3d__scene-canvas');
    this.$canvas = this.$parent.querySelector('canvas');
    this.context = this.$canvas.getContext("2d");
    this.$canvas.width=1920;
    this.$canvas.height=1080;

    this.$scene_size_element = this.$parent.querySelectorAll('[data-scene-size-element]');
    //1
    this.$part1 = this.$parent.querySelector('.section-3d-part-1__container');
    this.$screen1 = this.$parent.querySelector('.section-3d-screen-1');
    this.$screen1_items = this.$screen1.querySelectorAll('.section-3d-screen-1__item');
    this.$screen1_items_inner = this.$screen1.querySelectorAll('.section-3d-screen-1__item-inner');
    this.$screen2 = this.$parent.querySelector('.section-3d-screen-2');
    this.$screen2_content = this.$screen2.querySelector('.animated-head__container');
    this.$screen3 = this.$parent.querySelector('.section-3d-screen-3');
    this.$screen3_content = this.$screen3.querySelector('.container');
    this.frames1 = Resources.sources[0].frames;
    this.framesCount1 = Resources.sources[0].framesCount;
    //
    this.$part2 = this.$parent.querySelector('.section-3d-part-2__container');
    this.frames2 = Resources.sources[1].frames;
    this.framesCount2 = Resources.sources[1].framesCount;
    this.$screen4 = this.$parent.querySelector('.section-3d-info');
    this.$screen4_items = this.$screen4.querySelectorAll('.section-3d-info__item');
    //
    this.$part3 = this.$parent.querySelector('.section-3d-part-3__container');
    this.frames3 = Resources.sources[2].frames;
    this.framesCount3 = Resources.sources[2].framesCount;
    this.$screen5 = this.$parent.querySelector('.section-3d-screen-5');
    this.$screen5_content = this.$screen5.querySelector('.container');
    this.$screen6 = this.$parent.querySelector('.section-3d-dots');
    this.$screen6_items = this.$screen6.querySelectorAll('.section-3d-dots__item');
    //
    this.$part4 = this.$parent.querySelector('.section-3d-part-4__container');
    this.frames4 = Resources.sources[3].frames;
    this.framesCount4 = Resources.sources[3].framesCount;
    this.$screen7 = this.$parent.querySelector('.section-3d-screen-7');
    this.$screen7_content = this.$screen7.querySelector('.container');
    this.$screen8 = this.$parent.querySelector('.section-3d-screen-8');
    this.$screen8_image = this.$screen8.querySelector('.image');
    this.$screen8_image_element = this.$screen8.querySelector('.image img');
    //
    this.activeFrame = this.frames1[0];

    this.sceneRender = ()=> {
      this.context.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
      if(this.activeFrame) {
        this.context.drawImage(this.activeFrame, 0, 0);
      }
      this.animationFrame = requestAnimationFrame(this.sceneRender);
    }
    this.sceneRender();
    this.resizeEvent = () => {
      let h = this.$scene_inner.getBoundingClientRect().height,
          w = this.$scene_inner.getBoundingClientRect().width,
          res = this.$canvas.height/this.$canvas.width;


      if (h / w < res) {
        this.$scene_size_element.forEach(($this)=>{
          $this.style.width = `${w}px`;
          $this.style.height = `${w*res}px`;
        })
      } else {
        this.$scene_size_element.forEach(($this)=>{
          $this.style.width = `${h/res}px`;
          $this.style.height = `${h}px`;
        })
      }

      //image
      let res1 = 0.666;
      if (h / w < res1) {
        this.$screen8_image.style.width = `${w}px`;
        this.$screen8_image.style.height = `${w*res1}px`;
      } else {
        this.$screen8_image.style.width = `${h/res1}px`;
        this.$screen8_image.style.height = `${h}px`;
      }

    }
    this.resizeEvent();
    window.addEventListener('resize', this.resizeEvent);

    //START ANIMATION 
    let animation_start = gsap.timeline({paused:true})
      .fromTo(this.$scene_canvas, {scale:0.9, autoAlpha:0}, {scale:1, autoAlpha:1, ease:'power2.out'})
      .fromTo(this.$screen1_items, {autoAlpha:0, y:20}, {autoAlpha:1, y:0, duration:0.75, ease:'power2.out', stagger:{amount:0.25}}, `-=0.75`)
    window.addEventListener('start', () => {
      animation_start.play();
    })
    //animation fade scene
    this.animation_fade = gsap.timeline({paused:true})
      .to(this.$scene, {autoAlpha:0})

    //ANIMATION 1
    this.animation1 = gsap.timeline({paused:true})
      .to(this.$screen1, {y:-50, ease:'none'})
      .to(this.$screen1_items_inner, {autoAlpha:0, duration:0.75, ease:'power2.out', stagger:{amount:0.25}}, `-=1`)
      .set(this.$screen1, {autoAlpha:0})
    //ANIMATION 2
    this.animation2 = gsap.effects.slidingText(this.$screen2, this.$screen2_content);
    //ANIMATION 3
    this.animation3 = gsap.effects.slidingText(this.$screen3, this.$screen3_content);

    this.animation4 = gsap.timeline({paused:true})
      .set(this.$screen4, {autoAlpha:1})
      .fromTo(this.$screen4_items, {autoAlpha:0}, {autoAlpha:1, duration:1, stagger:{amount:1}})
      .fromTo(this.$screen4_items, {y:30}, {y:0, duration:1, ease:'power2.out', stagger:{amount:1}}, '-=2')
      .to(this.$screen4, {autoAlpha:0})


    //ANIMATION 5
    this.animation5 = gsap.effects.slidingText(this.$screen5, this.$screen5_content);

    this.animation6 = gsap.timeline({paused:true})
      .set(this.$screen6, {autoAlpha:1})
      .fromTo(this.$screen6_items, {autoAlpha:0}, {autoAlpha:1, duration:0.6, stagger:{amount:0.4}})
      .to(this.$screen6, {autoAlpha:0, duration:0.5}, '+=0.5')

    //ANIMATION 7
    this.animation7 = gsap.effects.slidingText(this.$screen7, this.$screen7_content);

    //ANIMATION 8
    this.animation8 = gsap.timeline({paused:true})
      .fromTo(this.$screen8_image, {autoAlpha:0}, {autoAlpha:1, duration:0.33})
      .fromTo(this.$screen8_image_element, {scale:0.65}, {scale:1, ease:'power2.in'})
      .to(this.$screen8_image, {autoAlpha:0, duration:0.33}, '-=0.33')
      


    this.sceneTrigger = ScrollTrigger.create({
      trigger: this.$scene,
      start: "top top",
      end: "+=16500",
      pin: true,
      pinType: pinType,
      pinSpacing: false
    })

    this.trigger1 = ScrollTrigger.create({
      trigger: this.$part1,
      start: "top top",
      end: "+=4500",
      pin: true,
      pinType: pinType,
      pinSpacing: false,
      onUpdate: self => {
        let index = Math.round(self.progress*(this.framesCount1-1));
        this.activeFrame = this.frames1[index];
        //animations
        let y = self.end*self.progress;

        let time1 = Math.max(0, Math.min(y/750, 1));
        this.animation1.progress(time1);
        let time2 = Math.max(0, Math.min((y-750)/1500, 1));
        this.animation2.progress(time2);
        let time3 = Math.max(0, Math.min((y-2500)/1500, 1));
        this.animation3.progress(time3);
        let time4 = Math.max(0, Math.min((y-4000)/500, 1));
        if(time4>0 && time4<1) this.animation_fade.progress(time4);
      
      },
      onEnterBack: ()=> {
        this.$scene_inner.classList.remove('wide');
        this.resizeEvent();
      }
    })

    this.trigger2 = ScrollTrigger.create({
      trigger: this.$part2,
      start: "top top",
      end: "+=4000",
      pin: true,
      pinType: pinType,
      pinSpacing: false,
      onUpdate: self => {
        let y = (self.end-self.start)*self.progress;

        let index = Math.round(Math.max(0, Math.min(y/3000, 1)*(this.framesCount2-1)));
        this.activeFrame = this.frames2[index];
        
        //animations
        let time1 = Math.max(0, Math.min(y/500, 1));
        if(time1>0 && time1<1) this.animation_fade.progress(1-time1);
        let time2 = Math.max(0, Math.min((y-3500)/500, 1));
        if(time2>0 && time2<1) this.animation_fade.progress(time2);
        //dots1
        let time3 = Math.max(0, Math.min((y-2500)/1500, 1));
        this.animation4.progress(time3);

      },
      onEnter: ()=> {
        this.$scene_inner.classList.add('wide');
        this.resizeEvent();
      }
    })

    this.trigger3 = ScrollTrigger.create({
      trigger: this.$part3,
      start: "top top",
      end: "+=4500",
      pin: true,
      pinType: pinType,
      pinSpacing: false,
      onUpdate: self => {
        let y = (self.end-self.start)*self.progress;
        //2000 change
        let index = Math.round(Math.max(0, Math.min((y-1500)/3000, 1)*(this.framesCount3-1)));
        this.activeFrame = this.frames3[index];
        
        
        //animations
        let time1 = Math.max(0, Math.min(y/1500, 1));
        this.animation5.progress(time1);
        //fadeInScene
        let time2 = Math.max(0, Math.min((y-1500)/500, 1));
        if(time2>0 && time2<1) this.animation_fade.progress(1-time2);
        let time3 = Math.max(0, Math.min((y-3500)/1000, 1));
        if(time3>0 && time3<1) this.animation_fade.progress(time3);
        //dots
        let time4 = Math.max(0, Math.min((y-2300)/1200, 1));
        this.animation6.progress(time4);
      }
    })

    this.trigger4 = ScrollTrigger.create({
      trigger: this.$part4,
      start: "top top",
      end: "+=3500",
      pin: true,
      pinType: pinType,
      pinSpacing: false,
      onUpdate: self => {
        let y = (self.end-self.start)*self.progress;

        let index = Math.round(Math.max(0, Math.min((y-1200)/1000, 1)*(this.framesCount4-1)));
        this.activeFrame = this.frames4[index];

        console.log(index)
        
        //animations
        let time1 = Math.max(0, Math.min(y/1500, 1));
        this.animation7.progress(time1);
        //fadeInScene
        let time2 = Math.max(0, Math.min((y-1200)/1000, 1));
        if(time2>0 && time2<1) this.animation_fade.progress(1-time2);
        let time3 = Math.max(0, Math.min((y-2200)/500, 1));
        if(time3>0 && time3<1) this.animation_fade.progress(time3);
        let time4 = Math.max(0, Math.min((y-2000)/1500, 1));
        this.animation8.progress(time4);
      }
    })

  }
}

class DesktopModelsList {
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
    this.$content = this.$parent.querySelector('.desktop-models-list__items');
    this.$images_container = this.$parent.querySelector('.desktop-models-list__images');
    this.$image_container = this.$parent.querySelector('.desktop-models-list__image');;
    this.$images = this.$image_container.querySelectorAll('.image');
    this.$buttons = this.$parent.querySelectorAll('.pool-model-item');
    this.x = 0;
    this.y = 0;
    
    this.check = (event)=> {
        if(event.type=='mousemove') {
          this.x = event.clientX;
          this.y = event.clientY;
        }

        if(!Modal.$active) {
          gsap.to(this.$image_container, {duration:0.5, x:this.x, y:this.y, ease:'power2.out'})
        }
  
        let flag = false;
        this.$buttons.forEach(($this, index) => {
          let h = $this.getBoundingClientRect().height,
              w = $this.getBoundingClientRect().width,
              y = $this.getBoundingClientRect().top,
              x = $this.getBoundingClientRect().left;
          if(this.x>=x && this.x<=x+w && this.y>=y && this.y<=y+h) {
            flag = true;
            if(index!==this.index) {
              if(this.index!==undefined) {
                this.$images[this.index].classList.remove('active');
                this.$buttons[this.index].classList.remove('active');
              }
              this.$buttons.forEach($this => {
                $this.classList.add('disabled');
              })
              $this.classList.add('active');
              $this.classList.remove('disabled');
              this.$images[index].classList.add('active');
              this.index = index;
            }
          } 
        })
        
        //mousenter
        if(flag && !this.isVisible && !Modal.$active) {
          this.isVisible = true;
          this.$image_container.classList.add('active');
        } 
        //mouseout
        else if((Modal.$active || !flag) && this.isVisible) {
          this.isVisible = false;
          this.$image_container.classList.remove('active');
          this.$images[this.index].classList.remove('active');
          this.$buttons.forEach($this => {
            $this.classList.remove('disabled', 'active');
          })
          delete this.index;
        }
    }

    document.addEventListener('mousemove', this.check);
    Scroll.addListener(this.check);

    this.clickEvent = (event)=> {
      if(event.type=='cursorMousedown' && this.isVisible) {
        if(this.clickTimer) clearTimeout(this.clickTimer)
        this.$image_container.classList.add('click');
      } else if(event.type=='cursorMouseup') {
        this.clickTimer = setTimeout(() => {
          this.$image_container.classList.remove('click');
        }, 150);
      }
    }

    window.addEventListener('cursorMousedown', this.clickEvent)
    window.addEventListener('cursorMouseup', this.clickEvent)

    this.fixTrigger = ScrollTrigger.create({
      trigger: this.$images_container,
      start: "top top",
      end: ()=> {
        let val = this.$images_container.getBoundingClientRect().height+this.$content.getBoundingClientRect().height;
        return `+=${val}`;
      },
      pin: true,
      pinSpacing: false,
      pinType: pinType
    });


  }
}

class ColorsSlider {
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
    this.$container = this.$parent.querySelector('.colors-slider__container')
    this.$slide = this.$parent.querySelectorAll('.colors-slide');
    this.$triggers = this.$parent.querySelectorAll('.colors-slider__navigation-trigger');
    this.$slide_element = this.$parent.querySelector('.colors-slider__slider-element');

    this.animations_enter = [];
    this.animations_exit = [];
    this.$slide.forEach(($slide, index) => {
      let $items = $slide.querySelectorAll('.colors-slide__element'),
          $inners = $slide.querySelectorAll('.colors-slide__element-inner'),
          $images = $slide.querySelectorAll('.image img'),
          $title = $slide.querySelectorAll('.colors-slide__title-element');

      this.animations_enter[index] = gsap.timeline({paused:true})
        .set($slide, {autoAlpha:1})
        .fromTo($items, {autoAlpha:0}, {autoAlpha:1, duration:0.75, stagger:{amount:0.25}})
        .fromTo($items, {y:100}, {y:0, ease:'power2.out', duration:0.75, stagger:{amount:0.25}}, '-=1')
        .fromTo($images, {scale:1.25}, {scale:1, ease:'power2.out', duration:0.75, stagger:{amount:0.25}}, '-=1')
        .fromTo($title, {y:50}, {y:0, ease:'power2.out', duration:1.5}, '-=1')
      
      this.animations_exit[index] = gsap.timeline({paused:true})
        .to($inners, {y:-50, ease:'power2.in', duration:0.4, stagger:{amount:0.1, from:'end'}})
        .to($inners, {autoAlpha:0, duration:0.4, stagger:{amount:0.1, from:'end'}}, '-=0.5')
        .set($slide, {autoAlpha:0})
    })

    this.getNext = (index)=> {
      let val = index==this.$slide.length-1?0:index+1;
      return val;
    }
    this.getPrev = (index)=> {
      let val = index==0?this.$slide.length-1:index-1;
      return val;
    }

    this.change = (index)=> {
      gsap.to(this.$slide_element, {xPercent:100*index})
      if(this.index!==undefined) {
        this.$triggers[this.index].classList.remove('active');

        if(this.animations_enter[this.index].isActive()) {
          this.animations_enter[this.index].pause();
        }
        this.animations_exit[this.index].play(0).eventCallback('onComplete', ()=> {
          this.animations_exit[index].pause().progress(0);
          this.animations_enter[index].play(0);
        });

      } 
      
      else {
        this.animations_enter[index].play(0);
      }

      this.$triggers[index].classList.add('active');
      this.index = index;
    }

    this.change(0)

    this.$triggers.forEach(($trigger, index) => {
      $trigger.addEventListener('click', ()=> {
        this.change(index);
      })
    })  
    
    

    this.swipes = SwipeListener(this.$container);
    this.$container.addEventListener('swipe', (event)=> {
      let dir = event.detail.directions;
      if(dir.left) this.change(this.getNext(this.index));
      else if(dir.right) this.change(this.getPrev(this.index));
    });



  }
}

class ModelsSlider {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$slider = this.$parent.querySelector('.swiper-container');
    this.$bottom_images = this.$parent.querySelectorAll('.models-slider__bottom-image');

    this.slider = new Swiper(this.$slider, {
      effect: 'fade',
      touchStartPreventDefault: false,
      longSwipesRatio: 0.1,
      speed: 500,
      lazy: {
        loadOnTransitionStart: true,
        loadPrevNext: true
      }
    });
  
    if(this.$bottom_images.length>1) {

      this.$bottom_images[0].classList.add('is-active');
      this.slider.on('slideChange', (event)=> {
        this.$bottom_images.forEach($this => {
          $this.classList.remove('is-active')
        })
        this.$bottom_images[event.realIndex].classList.add('is-active');
      })

      this.$bottom_images.forEach(($this, index)=>{
        $this.addEventListener('mouseenter', ()=> {
          this.slider.slideTo(index);
        })
        $this.addEventListener('click', ()=> {
          this.slider.slideTo(index);
        })
      })
      
    }

  }
}

class ParallaxImage {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.check = ()=> {
      if(window.innerWidth >= brakepoints.xl && (!this.initialized || !this.flag)) {
        this.initDesktop();
        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.xl && (!this.initialized || this.flag)) {
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
    this.$img = this.$parent.querySelector('img');

    this.animation = gsap.timeline({paused:true}) 
      .to(this.$img, {yPercent:40, ease:'none'})

    this.trigger = ScrollTrigger.create({
      trigger: this.$parent,
      start: "top bottom",
      end: "bottom top",
      onUpdate: self => {
        this.animation.progress(self.progress);
      }
    });
  }

  destroyDesktop() {
    this.animation.kill();
    this.trigger.kill();
    gsap.set(this.$img, {clearProps: "all"});
  }
}

window.addEventListener('resize', ()=> {
  ScrollTrigger.Refresh();
})