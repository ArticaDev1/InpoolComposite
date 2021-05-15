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
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import Inputmask from "inputmask";
import autosize from 'autosize';

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
  //form
  Validation.init();
  inputs();
  //
  TouchHoverEvents.init();
  Scroll.init();
  Modal.init();

  const activeFunctions = new ActiveFunctions();
  activeFunctions.create();
  activeFunctions.add(Model, '.section-model');
  activeFunctions.add(AnimatedSection, '.animated-section_1');
  activeFunctions.add(SectionVideoAnimation, '.section-video-animation');
  activeFunctions.add(SectionTechnologies, '.section-technologies');
  activeFunctions.add(AnimatedSection, '.animated-section_2');
  activeFunctions.add(Map, '.contacts-block__map');
  activeFunctions.init();

  //preload
  Preloader.init();
}

//effects
gsap.registerEffect({
  name: "slidingText",
  effect: ($outer, $inner) => {
    let anim = gsap.timeline({paused: true})
      .fromTo($outer, {autoAlpha:0}, {autoAlpha:1, duration:0.3, ease:'power2.in'})
      .fromTo($inner, {y:50}, {y:-50, ease:'none'}, `-=0.3`)
      .to($outer, {autoAlpha:0, duration:0.3, ease:'power2.out'}, `-=0.3`)
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
            }
          }
        }
      }
    }
  }
  document.addEventListener('focus',  (event)=>{events(event)}, true);
  document.addEventListener('blur',   (event)=>{events(event)}, true);
}

const Resources = {
  init: function() {
    this.framesCount = 0;
    this.framesLoaded = 0;
    this.sources = {
      0: {
        src: './img/drone_video/',
        type: 'jpg',
        framesCount: 40,
        frames: []
      },
      1: {
        src: './img/model/1/',
        type: 'png',
        framesCount: 108,
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
          let name = (i + 1).toString().padStart(3, '0'),
              type = this.sources[source].type;
          this.sources[source].frames[i].src = `${this.sources[source].src+name}.${type}`;
        }
        this.framesCount+=this.sources[source].framesCount;
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
  targets: 'a, button, label, tr, [data-touch-hover], .scrollbar-track, .scrollbar-thumb, .input',
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
      window.dispatchEvent(new Event("start"));
      if(!Dev) {
        gsap.timeline({onComplete:()=>{
          this.$element.remove();
        }})
          .to(this.$element, {autoAlpha:0, duration:0.5})
          .to($wrapper, {autoAlpha:1}, '-=0.5')
      } else {
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
    } else {
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
    this.$text = this.$parent.querySelector('.section-video-animation__container');
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

    this.animation_text = gsap.effects.slidingText(this.$text, this.$text);
    this.animation_fade_scene = gsap.timeline({paused:true})
      .fromTo(this.$scene, {autoAlpha:0}, {autoAlpha:1, duration:0.3})
      .to(this.$scene, {autoAlpha:0, duration:0.3, ease:'power2.in'}, `+=0.4`)


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
      .fromTo(this.$parent, {autoAlpha:0}, {autoAlpha:1, ease:'power2.in'})

    this.trigger_fade = ScrollTrigger.create({
      trigger: this.$parent,
      start: ()=>{
        let h = window.innerHeight/3;
        return `top bottom-=${h}`;
      },
      end: ()=>{
        let h = window.innerHeight/3;
        return `top bottom-=${h+300}`;
      },
      onUpdate: self => {
        this.animation_fade.progress(self.progress);
      }
    });
    
  }


}

class AnimatedSection {
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

    this.$head = this.$parent.querySelector('.animated-head');
    this.$head_inner = this.$head.querySelectorAll('.animated-head__container');
    this.$content = this.$parent.querySelector('.animated-section__content');

    this.animation_head = gsap.effects.slidingText(this.$head, this.$head_inner);

    this.animation_head_trigger = ScrollTrigger.create({
      trigger: this.$head,
      start: "top top",
      end: "top+=1500 top",
      pin: true,
      pinType: pinType,
      onUpdate: self => {
        this.animation_head.progress(self.progress);
      }
    });

    this.animation_content = gsap.timeline({paused:true})
      .fromTo(this.$content, {autoAlpha:0}, {autoAlpha:1, ease:'power2.in'})

    this.animation_content_trigger = ScrollTrigger.create({
      trigger: this.$content,
      start: "top bottom",
      end: "top+=300 bottom",
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


    loadMap();
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
      $modal.style.display = 'block';
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
        this.$active.style.display = 'none';
        delete this.$active;
        if(callback) callback();
      })
    }
  }
}

class Model {
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
    this.$scene = this.$parent.querySelector('.section-model__scene');
    this.$canvas = this.$parent.querySelector('canvas');
    this.context = this.$canvas.getContext("2d");
    this.$canvas.width=1920;
    this.$canvas.height=1080;
    this.frames = Resources.sources[1].frames;
    this.framesCount = 108;
    this.activeFrame = this.frames[0];

    this.sceneRender = ()=> {
      this.context.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
      this.context.drawImage(this.activeFrame, 0, 0);
      this.animationFrame = requestAnimationFrame(this.sceneRender);
    }
    this.sceneRender();

    this.resizeEvent = () => {
      let h = this.$scene.getBoundingClientRect().height,
          w = this.$scene.getBoundingClientRect().width,
          res = this.$canvas.height/this.$canvas.width;

      if (h / w > res) {
        this.$canvas.style.width = `${w}px`;
        this.$canvas.style.height = `${w*res}px`;
      } else {
        this.$canvas.style.width = `${h/res}px`;
        this.$canvas.style.height = `${h}px`;
      }
    }
    this.resizeEvent();
    window.addEventListener('resize', this.resizeEvent);

    //start animation
    let animation_start = gsap.timeline({paused:true})
      .fromTo(this.$canvas, {scale:0.5}, {scale:1, duration:1, ease:'power2.out'})
    window.addEventListener('start', () => {
      animation_start.play();
    })

    //1
    let $screen1 = this.$parent.querySelector('.section-model-screen_1'),
        $items1 = this.$parent.querySelectorAll('.section-model-screen__item-1');
    this.animation1 = gsap.timeline({paused:true})
      .to($items1, {y:-50, ease:'none'})
      .to($items1, {autoAlpha:0, duration:0.3, ease:'power2.out', stagger:{amount:0.2}}, `-=0.5`)
      .set($screen1, {autoAlpha:0})
    
    //2
    let $screen2 = this.$parent.querySelector('.section-model-screen_2'),
        $screen2_content = $screen2.querySelector('.animated-head__container');
    this.animation2 = gsap.effects.slidingText($screen2, $screen2_content);

    //3
    let $screen3 = this.$parent.querySelector('.section-model-screen_3'),
        $screen3_content = $screen3.querySelector('.section-model-screen__text-3');
    this.animation3 = gsap.effects.slidingText($screen3, $screen3_content);

    //4
    this.animation4 = gsap.timeline({paused:true})
      .to(this.$scene, {autoAlpha:0, ease:'power2.in'})

    //5
    this.animation5 = gsap.timeline({paused:true})
      .to(this.$scene, {autoAlpha:0, ease:'power2.out'})


    this.trigger = ScrollTrigger.create({
      trigger: this.$parent,
      start: "top top",
      end: "top+=10800 top",
      pin: true,
      pinType: pinType,
      onUpdate: self => {
        let y = self.end*self.progress;
        let index = Math.round(self.progress*(this.framesCount-1));
        this.activeFrame = this.frames[index];

        let time1 = Math.max(0, Math.min(y/750, 1)), //750
            time2 = Math.max(0, Math.min((y-1100)/1500, 1)), //2500
            time3 = Math.max(0, Math.min((y-2600)/1500, 1)), //4000
            time4 = Math.max(0, Math.min((y-4100)/1000, 1)), //5100
            time5 = Math.max(0, Math.min((y-5100)/1000, 1)); //6100

        if(y<5100) {
          gsap.set(this.$canvas, {scale:1})
        } else {
          gsap.set(this.$scene, {scale:0.73})
        }

        this.animation1.progress(time1);
        this.animation2.progress(time2);
        this.animation3.progress(time3);
        /* this.animation4.progress(time4);
        this.animation5.progress(time5); */
      }
    });

  }
}