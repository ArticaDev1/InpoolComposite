const Dev = false;
const captchas = {
  isCapthca1: false,
  isCapthca2: false
}
// <div class="captcha">
 //                     <div id="captcha"></div>
   //               </div>
import 'lazysizes';
lazySizes.cfg.customMedia = {
  '--small': '(max-width: 575px)',
  '--medium': '(max-width: 1023px)',
  '--large': '(max-width: 1279px)',
};
//gsap
import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
import Swiper, {Pagination, Lazy} from 'swiper/core';
Swiper.use([Pagination, Lazy]);

const brakepoints = {
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1600
}
const $body = document.body;
const $wrapper = document.querySelector('.wrapper');

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
  activeFunctions.add(MobileModelsSlider, '.mobile-models-slider');
  activeFunctions.add(ColorsSlider, '.colors-slider');
  activeFunctions.add(PreviewSection, '.section-preview');
  activeFunctions.add(SectionVideoAnimation, '.section-video-animation');
  activeFunctions.add(ModelsSlider, '.models-slider');
  activeFunctions.add(MobileFadeInBlocks, '.mobile-fade-in');
  activeFunctions.add(Map, '.contacts-block__map');
  activeFunctions.add(HomeScreenAnimation, '.home-screen');
  activeFunctions.add(MobilePoolAnimation, '.section-form__image');
  activeFunctions.add(MobileLayouts, '.section-layouts');
  activeFunctions.add(MobileEquipment, '.section-equipment');
  
  activeFunctions.add(ParallaxImage, '.parallax-image');
  activeFunctions.init();

  //preload
  Preloader.init();
  //captcha
  var captcha1 = sliderCaptcha({
    id: 'captcha',
    width: 280,
    height: 150,
    sliderL: 42,
    sliderR: 9,
    offset: 5,
    // loadingText: 'Загрузка...',
    // failedText: 'Попробуйте еще раз',
    // barText: 'Сдвиньте, чтобы заполнить',
    // loadingText: '',
    // failedText: '',
    // barText: '',
    // repeatIcon: 'fa fa-redo',
    setSrc: function () {
      // return './img/desktop-models/' + Math.round(Math.random() * 6) + '.jpg'
    },
    onSuccess: function () {
      captchas.isCapthca1 = true
      let currCaptcha = document.getElementById('captcha').parentElement
      currCaptcha.classList.add('success')
      gsap.to(currCaptcha, {autoAlpha:0, duration:0.5, display:'none', ease:'power1.out'})
      var handler = setTimeout(function () {
          window.clearTimeout(handler);
          captcha1.reset();
      }, 500);
    },
    onFail: function () {
      captchas.isCapthca1 = false
    },
    onRefresh: function () {
    }
  });
  var captcha2 = sliderCaptcha({
    id: 'captcha2',
    width: 280,
    height: 150,
    sliderL: 42,
    sliderR: 9,
    offset: 5,
    // loadingText: 'Загрузка...',
    // failedText: 'Попробуйте еще раз',
    // barText: 'Сдвиньте, чтобы заполнить',
    // loadingText: '',
    // failedText: '',
    // barText: '',
    // repeatIcon: 'fa fa-redo',
    setSrc: function () {
      // return './img/desktop-models/' + Math.round(Math.random() * 6) + '.jpg'
    },
    onSuccess: function () {
      captchas.isCapthca2 = true
      let currCaptcha = document.getElementById('captcha2').parentElement
      currCaptcha.classList.add('success')
      gsap.to(currCaptcha, {autoAlpha:0, duration:0.5, display:'none', ease:'power1.out'})
      var handler = setTimeout(function () {
          window.clearTimeout(handler);
          captcha2.reset();
      }, 500);
    },
    onFail: function () {
      captchas.isCapthca2 = false
    },
    onRefresh: function () {
    }
  });
}

//effects
gsap.registerEffect({
  name: "slidingText", //1000px
  effect: ($outer, $inner) => {
    let anim = gsap.timeline({paused: true})
      .fromTo($outer, {autoAlpha:0}, {autoAlpha:1, duration:0.33, ease:'power1.in'})
      .fromTo($inner, {y:40}, {y:-40, ease:'none'}, `-=0.33`)
      .to($outer, {autoAlpha:0, duration:0.33, ease:'power1.out'}, `-=0.33`)
    return anim;
  },
  extendTimeline: true
});
gsap.registerEffect({
  name: "slidingText2000", //2000px
  effect: ($outer, $inner) => {
    let anim = gsap.timeline({paused: true})
      .fromTo($outer, {autoAlpha:0}, {autoAlpha:1, duration:0.165, ease:'power1.in'})
      .fromTo($inner, {y:40}, {y:-40, ease:'none'}, `-=0.165`)
      .to($outer, {autoAlpha:0, duration:0.165, ease:'power1.out'}, `-=0.165`)
    return anim;
  },
  extendTimeline: true
});
gsap.registerEffect({
  name: "slidingText1500", 
  effect: ($outer, $inner) => {
    let anim = gsap.timeline({paused: true})
      .fromTo($outer, {autoAlpha:0}, {autoAlpha:1, duration:0.22, ease:'power1.in'})
      .fromTo($inner, {y:40}, {y:-40, ease:'none'}, `-=0.22`)
      .to($outer, {autoAlpha:0, duration:0.22, ease:'power1.out'}, `-=0.22`)
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

    document.querySelectorAll('.screen').forEach($this => {
      $this.style.minHeight = `${h}px`;
    })
  }
}

const Resources = {
  init: function() {
    this.framesLoaded = 0;
    this.sources = {
      0: {
        src: './img/model/1/',
        type: 'jpg',
        framesCount: 224,
        frames: []
      },
      1: {
        src: './img/model/2/',
        type: 'jpeg',
        framesCount: 100,
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
          //first loaded
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
          const textCheck = $form.querySelector('textarea').value.includes('Финансовый робот')
          const isBot = $form.querySelector('.form__item-checkbox').checked
          if ($form.querySelector('.captcha.success') && !isBot && !textCheck) {
            // var CryptoJS = require("crypto-js");
            var MD5 = require("crypto-js/md5");
            var base64 = MD5($form.querySelector('[name="name"]').value + "496e2faf9d3f0c2539397fa1bdf8a8b1").toString()
            if (!flag) this.submitEvent($form, false, base64);
          } else if($form.querySelector('.captcha.success')) {
            if (!flag) this.submitEvent($form, true);
          }
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
  submitEvent: function ($form, isFake, base64) {
    let $submit = $form.querySelector('button'),
        $inputs = $form.querySelectorAll('input, textarea');
    $inputs.forEach(($input) => {
      $input.parentNode.classList.add('loading');
    })
    $submit.classList.add('loading');
    let finish = () => {
      $inputs.forEach(($input) => {
        $input.parentNode.classList.remove('loading');
      })
      $submit.classList.remove('loading');
      this.reset($form);
      Modal.open(document.querySelector('#modal-succes'));
      setTimeout(()=>{
        Modal.close();
        document.querySelectorAll('.captcha').forEach(el => {
          if (el.classList.contains('success')) {
            gsap.to(el, {autoAlpha:1, duration:0.5, display:'block', ease:'power1.out'})
            el.classList.remove('success')
          }
        })
      }, 2000)
    }
    if (isFake) {
      finish();
    } else {
      $.ajax({
        type: "POST",
        url: $($form).attr('action'),
        data: $($form).serialize() + `&check=${base64}`,
        success: function(data) {
          finish();
        }
      });
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
    this.$counter = document.querySelector('.preloader__counter span');

    let frames_preload_count = 100;
    
    this.finish = () => {
      this.finished = true;

      if(!Dev) {
        gsap.timeline({onComplete:()=>{
          this.$element.remove();
        }})
          .to(this.$element, {autoAlpha:0, duration:0.5, onComplete:()=>{
            window.dispatchEvent(new Event("start"));
          }})
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

          this.$counter.innerHTML = `${Math.round(Math.min(Resources.framesLoaded/frames_preload_count, 1) * 100)}`;

          //frames loaded
          if(Resources.framesLoaded>=frames_preload_count) {
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
        setTimeout(() => {
          this.finish();
        }, 500);
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

    //show
    window.addEventListener('start', () => {
      gsap.fromTo(this.$parent, {autoAlpha:0}, {autoAlpha:1})
    })

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
      if(this.hoverTimer) clearTimeout(this.hoverTimer)
      Cursor.$element.classList.add('hover');
      if(event.detail.target.getAttribute('data-cursor')=='light') {
        Cursor.$element.classList.add('light');
      } else if(event.detail.target.getAttribute('data-cursor')=='magnifier') {
        Cursor.$element.classList.add('magnifier');
      } else if(event.detail.target.getAttribute('data-cursor')=='magnifier2') {
        Cursor.$element.classList.add('magnifier2');
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
      } else if(event.detail.target.getAttribute('data-cursor')=='magnifier') {
        Cursor.$element.classList.remove('magnifier');
      } else if(event.detail.target.getAttribute('data-cursor')=='magnifier2') {
        Cursor.$element.classList.remove('magnifier2');
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
        
        if(!this.initialized) {
          this.initDesktop();
        } else {
          this.timeout = setTimeout(() => {
            this.initDesktop();
            delete this.timeout;
          }, 500);
        }

        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        if(this.initialized && !this.timeout) {
          this.destroyDesktop();
        } else {
          clearTimeout(this.timeout);
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
    this.$text_content = this.$parent.querySelector('.section-video-animation__container');
    this.$title = this.$parent.querySelector('.section-video-animation__title');
    this.$text = this.$parent.querySelector('.section-video-animation__text');
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
        $color_active = getComputedStyle(document.documentElement).getPropertyValue('--color-text-light');
    this.animation_text = gsap.effects.slidingText2000(this.$text_content, this.$text_content);
    this.animation_fade_scene = gsap.timeline({paused:true})
      .fromTo(this.$scene, {autoAlpha:0}, {autoAlpha:1, duration:0.5})
      .fromTo(this.$title, {css:{color:$color_title}}, {css:{color:$color_active}, duration:0.5}, '-=0.5')
      .fromTo(this.$text, {css:{color:$color_text}}, {css:{color:$color_active}, duration:0.5}, '-=0.5')
      .to(this.$title, {css:{color:$color_title}, duration:0.5})
      .to(this.$text, {css:{color:$color_text}, duration:0.5}, '-=0.5')
      .to(this.$scene, {autoAlpha:0, duration:0.5}, `-=0.5`)


    this.trigger = ScrollTrigger.create({
      trigger: this.$inner,
      start: "top top",
      end: "+=2000",
      pin: true,
      pinSpacing: false,
      pinType: pinType,
      onUpdate: self => {
        let y = 2000*self.progress;
        let progress2 = Math.max(0, Math.min((y-330)/1340, 1));
        let index = Math.round(progress2*(this.framesCount-1));
        this.activeFrame = this.frames[index];
        this.animation_fade_scene.progress(progress2);
        this.animation_text.progress(self.progress);
      }
    });
  }

  destroyDesktop() {
    this.trigger.kill();
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resizeEvent);
    gsap.set([this.$scene, this.$title, this.$text, this.$text_content], {clearProps: "all"});
  }
}

class SectionAnimated {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.check = ()=> {
      if(window.innerWidth >= brakepoints.lg && (!this.initialized || !this.flag)) {
        
        if(this.initialized) {
          if(!this.timeout) {
            this.destroyMobile();
          } else {
            clearTimeout(this.timeout);
          }
          this.timeout = setTimeout(() => {
            this.initDesktop();
            delete this.timeout;
          }, 500);
        } else {
          this.initDesktop();
        }

        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        if(this.initialized) {
          if(!this.timeout) {
            this.destroyDesktop();
          } else {
            clearTimeout(this.timeout);
          }
          this.timeout = setTimeout(() => {
            this.initMobile();
            delete this.timeout;
          }, 500);
        } else {
          this.initMobile();
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
    this.$content = this.$parent.querySelector('.section-animated__content');

    this.animation_head = gsap.effects.slidingText(this.$head, this.$head_inner);

    this.animation_head_trigger = ScrollTrigger.create({
      trigger: this.$head,
      start: "top top",
      end: "+=1000",
      pin: true,
      pinSpacing: false,
      pinType: pinType,
      onUpdate: self => {
        this.animation_head.progress(self.progress);
      }
    });
  }

  initMobile() {
    this.$head = this.$parent.querySelector('.animated-head');
    this.$items = this.$head.querySelectorAll('.animated-head__title, .animated-head__sub-title');

    this.animation = gsap.timeline({paused:true})
      .fromTo(this.$items, {autoAlpha:0}, {autoAlpha:1, duration:0.85, ease:'power2.out', stagger:{amount:0.1}})
      .fromTo(this.$items, {y:50}, {y:0, duration:0.85, ease:'power2.out', stagger:{amount:0.1}}, '-=1')

    this.trigger = ScrollTrigger.create({
      trigger: this.$head,
      start: "top+=100 bottom",
      end: "bottom+=100 bottom",
      once: true,
      onEnter: () => {
        this.animation.play();
      }
    });
  }

  destroyMobile() {
    this.animation.kill();
    this.trigger.kill();
    gsap.set(this.$items, {clearProps: "all"});
  }
  

  destroyDesktop() {
    this.animation_head.kill();
    this.animation_head_trigger.kill();
    gsap.set([this.$head, this.$head_inner], {clearProps: "all"})
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
        let anim = gsap.timeline({paused: true})
          .fromTo($modal, {autoAlpha: 0}, {autoAlpha:1, duration:0.5})
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
        let $modal = document.querySelector(`${$open.getAttribute('href')}`),
            modalSubject = $open.getAttribute('data-modal-subject');
        this.open($modal, modalSubject);
      }
      //close 
      else if ($close || (!$block && $wrap)) {
        this.close();
      }
    })

    /* setTimeout(() => {
      this.open(document.querySelector('#modal-succes'));
    }, 500); */

  },
  open: function ($modal, modalSubject) {
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

    //значение формы
    let $input = $modal.querySelector('.form__subject');
    if(modalSubject && $input) {
      $input.value = modalSubject;
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
        
        if(!this.initialized) {
          this.initDesktop();
        } else {
          this.timeout = setTimeout(() => {
            this.initDesktop();
            delete this.timeout;
          }, 500);
        }

        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        if(this.initialized && !this.timeout) {
          this.destroyDesktop();
        } else {
          clearTimeout(this.timeout);
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
    this.$container = this.$parent.querySelector('.section-3d__container');
    this.$scene = this.$parent.querySelector('.section-3d__scene');
    this.$scene_inner = this.$parent.querySelector('.section-3d__scene-inner');
    this.$scene_canvas = this.$parent.querySelector('.section-3d__scene-canvas');
    this.$canvas = this.$parent.querySelector('canvas');
    this.context = this.$canvas.getContext("2d");
    this.$canvas.width=1920;
    this.$canvas.height=1080;

    this.$scene_size_element = this.$parent.querySelectorAll('[data-scene-size-element]');
    
    this.frames_1 = Resources.sources[0].frames;
    this.frames_2 = Resources.sources[1].frames;

    this.sceneRender = ()=> {
      this.context.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
      if(this.activeFrame) {
        this.context.drawImage(this.activeFrame, 0, 0);
      }
      this.animationFrame = requestAnimationFrame(this.sceneRender);
    }
    this.sceneRender();
    
    this.resizeCanvas = () => {
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
    }

    this.updateAnimations = () => {
      let w = getComputedStyle(this.$scene_inner).getPropertyValue('--width'),
          h = getComputedStyle(this.$scene_inner).getPropertyValue('--height'),
          l = getComputedStyle(this.$scene_inner).getPropertyValue('--left'),
          t = getComputedStyle(this.$scene_inner).getPropertyValue('--top');
      this.animation_resize1 = gsap.timeline({paused:true})
        .fromTo(this.$scene_inner, {css:{top:t}}, {css:{top:'50%'}, onUpdate: () => {
          this.resizeCanvas();
        }})
      this.animation_resize2 = gsap.timeline({paused:true})
        .fromTo(this.$scene_inner, {css:{height:h, width:w, left:l}}, {css:{height:'100%', width:'100%', left:'50%'}, onUpdate: () => {
          this.resizeCanvas();
        }})
      if(this.progress_resize1) {
        this.animation_resize1.progress(this.progress_resize1);
      }
      if(this.progress_resize2) {
        this.animation_resize2.progress(this.progress_resize2);
      }
    }

    this.resizeCanvas();
    this.updateAnimations();
    window.addEventListener('resize', this.resizeCanvas);
    window.addEventListener('resize', this.updateAnimations);


    this.animation_fade = gsap.timeline({paused:true})
      .fromTo(this.$scene, {autoAlpha:1}, {autoAlpha:0, duration:0.33, ease:'power1.out'})

    this.$screen_1 = this.$parent.querySelector('.section-3d-screen-1'),
    this.$screen_1_items = this.$parent.querySelectorAll('.section-3d-screen-1__item');
    this.$screen_1_items_inner = this.$parent.querySelectorAll('.section-3d-screen-1__item-inner');
    
    this.animation_start = gsap.timeline({paused:true})
      .set(this.$screen_1, {autoAlpha:1})
      .fromTo(this.$scene_canvas, {scale:0.9, autoAlpha:0}, {scale:1, autoAlpha:1, ease:'power2.out'})
      .fromTo(this.$screen_1_items, {autoAlpha:0, y:20}, {autoAlpha:1, y:0, duration:0.75, ease:'power2.out', stagger:{amount:0.25}}, `-=0.75`) 

    this.animation_1 = gsap.timeline({paused:true})
      .fromTo(this.$screen_1, {y:0}, {y:-40, ease:'none'})
      .fromTo(this.$screen_1_items_inner, {autoAlpha:1}, {autoAlpha:0, duration:0.75, ease:'power2.out', stagger:{amount:0.25}}, `-=1`)

    this.$screen_2 = this.$parent.querySelector('.section-3d-screen-2');
    this.$screen_2_content = this.$parent.querySelector('.section-3d-screen-2__container');

    this.animation_2 = gsap.effects.slidingText(this.$screen_2, this.$screen_2_content);

    this.$screen_3 = this.$parent.querySelector('.section-3d-screen-3');
    this.$screen_3_content = this.$parent.querySelector('.section-3d-screen-3__container');

    this.animation_3 = gsap.effects.slidingText(this.$screen_3, this.$screen_3_content);

    this.animations_layout = [];
    this.$screen_layout = this.$parent.querySelectorAll('.section-3d-screen-layout');
    this.$screen_layout_content = this.$parent.querySelectorAll('.section-3d-screen-layout__container');
    this.$screen_layout.forEach(($this, index) => {
      this.animations_layout[index] = gsap.effects.slidingText($this, this.$screen_layout_content[index]);
    })

    this.$screen_4 = this.$parent.querySelector('.section-3d-screen-4');
    this.$screen_4_content = this.$parent.querySelector('.section-3d-screen-4__container');

    this.animation_4 = gsap.effects.slidingText(this.$screen_4, this.$screen_4_content);
    
    this.$screen_5 = this.$parent.querySelector('.section-3d-dots');
    this.$screen_5_items = this.$parent.querySelectorAll('.section-3d-dots__item');

    this.animation_5 = gsap.timeline({paused:true})
      .fromTo(this.$screen_5, {autoAlpha:0}, {autoAlpha:1, duration:0.1, ease:'power1.in'})
      .fromTo(this.$screen_5_items, {autoAlpha:0}, {autoAlpha:1, duration:0.33, ease:'power1.in', stagger:{amount:0.17}}, '-=0.1')
      .to(this.$screen_5_items, {autoAlpha:0, duration:0.33, ease:'power1.out', stagger:{amount:0.17}}, '+=0.5')
      .to(this.$screen_5, {autoAlpha:0, duration:0.1, ease:'power1.out'}, '-=0.1')
    
    this.$screen_6 = this.$parent.querySelector('.section-3d-screen-6');
    this.$screen_6_content = this.$parent.querySelector('.section-3d-screen-6__container');

    this.animation_6 = gsap.effects.slidingText1500(this.$screen_6, this.$screen_6_content);

    this.sceneTrigger = ScrollTrigger.create({
      refreshPriority: 1000000,
      trigger: this.$container,
      start: "top top",
      end: "+=14875",
      pin: true,
      pinSpacing: false,
      pinType: pinType,
      onUpdate: self => {
        let y = self.end*self.progress;

        let fy = [],
            fi = [],
            frame;

        //1
        fy.push( Math.max(0, Math.min(y/625, 1)) )
        fi.push( fy[fy.length-1] * 25 );
        //2
        fy.push( Math.max(0, Math.min((y-625)/1775, 1)) )
        fi.push( (fy[fy.length-1] * 47) + 25 );
        //3
        fy.push( Math.max(0, Math.min((y-2400)/2975, 1)) )
        fi.push( (fy[fy.length-1] * 119) + 72 );
        //4
        fy.push( Math.max(0, Math.min((y-6375)/100, 1)) )
        fi.push( (fy[fy.length-1] * 7) + 191 );
        //5
        fy.push( Math.max(0, Math.min((y-7375)/100, 1)) )
        fi.push( (fy[fy.length-1] * 6) + 198 );
        //6
        fy.push( Math.max(0, Math.min((y-8375)/100, 1)) )
        fi.push( (fy[fy.length-1] * 7) + 204 );
        //7
        fy.push( Math.max(0, Math.min((y-9375)/100, 1)) )
        fi.push( (fy[fy.length-1] * 5) + 211 );
        //8
        fy.push( Math.max(0, Math.min((y-10375)/100, 1)) )
        fi.push( (fy[fy.length-1] * 7) + 216 );
        //last
        fy.push( Math.max(0, Math.min((y-12375)/2500, 1)) )
        fi.push( (fy[fy.length-1] * 99) );

        
        for (let i = 0; i < fy.length; i++) {
          let index = fy.length - 1 - i;
          if(fy[index] > 0) {
            //1
            if(index<8) {
              this.activeFrame = this.frames_1[Math.round(fi[index])];
              frame = fi[index];
            } else {
              this.activeFrame = this.frames_2[Math.round(fi[index])];
              frame = fi[index] + 223;
            }
            
            break;
          }
        }

        let progress_1 = Math.max(0, Math.min(frame/25, 1));
        this.animation_1.progress(progress_1);

        this.progress_resize1 = Math.max(0, Math.min(Math.round(frame)/25, 1));
        this.animation_resize1.progress(this.progress_resize1);

        let progress_2 = Math.max(0, Math.min((y-625)/1000, 1));
        this.animation_2.progress(progress_2);

        let progress_3 = Math.max(0, Math.min((y-1625)/1000, 1));
        this.animation_3.progress(progress_3);

        this.progress_resize2 = Math.max(0, Math.min((Math.round(frame)-75)/50, 1));
        this.animation_resize2.progress(this.progress_resize2);

        let progress_4 = Math.max(0, Math.min((y-5375)/1000, 1));
        this.animations_layout[0].progress(progress_4);

        let progress_5 = Math.max(0, Math.min((y-6375)/1000, 1));
        this.animations_layout[1].progress(progress_5);

        let progress_6 = Math.max(0, Math.min((y-7375)/1000, 1));
        this.animations_layout[2].progress(progress_6);

        let progress_7 = Math.max(0, Math.min((y-8375)/1000, 1));
        this.animations_layout[3].progress(progress_7);

        let progress_8 = Math.max(0, Math.min((y-9375)/1000, 1));
        this.animations_layout[4].progress(progress_8);

        let progress_9 = Math.max(0, Math.min((y-10375)/1000, 1));
        this.animations_layout[5].progress(progress_9);
        
        let progress_10 = Math.max(0, Math.min((y-11375)/1000, 1));
        this.animation_4.progress(progress_10);

        let progress_11 = Math.max(0, Math.min((y-12800)/1500, 1));
        this.animation_5.progress(progress_11);

        //let progress_12 = Math.max(0, Math.min((y-12800)/1500, 1));
        this.animation_6.progress(progress_11);


        //fade scene
        let fade_progress_1 = Math.max(0, Math.min((y-11045)/330, 1)),  
            fade_progress_2 = Math.max(0, Math.min((y-12375)/330, 1)),
            fade_progress_3 = Math.max(0, Math.min((y-14545)/330, 1));

        if(fade_progress_3>0) {
          this.animation_fade.progress(fade_progress_3);
        } else if(fade_progress_2>0) {
          this.animation_fade.progress(1 - fade_progress_2);
        } else if(fade_progress_1>0) {
          this.animation_fade.progress(fade_progress_1);
        }

      }
    })

    this.playStart = () => {
      this.animation_start.play();
    }

    if(!Preloader.finished) {
      window.addEventListener('start', this.playStart);
    } else {
      this.playStart();
    }


  }

  destroyDesktop() {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resizeCanvas);
    window.removeEventListener('resize', this.updateAnimations);
    window.removeEventListener('start', this.playStart);
    this.sceneTrigger.kill();
  }
}

class DesktopModelsList {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.check = ()=> {
      if(window.innerWidth >= brakepoints.lg && (!this.initialized || !this.flag)) {
        if(!this.initialized) {
          this.initDesktop();
        } else {
          this.timeout = setTimeout(() => {
            this.initDesktop();
            delete this.timeout;
          }, 500);
        }

        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        if(this.initialized && !this.timeout) {
          this.destroyDesktop();
        } else {
          clearTimeout(this.timeout);
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
    
    this.checkEvent = (event)=> {
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

    document.addEventListener('mousemove', this.checkEvent);
    Scroll.addListener(this.checkEvent);

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

  destroyDesktop() {
    this.fixTrigger.kill();
    document.removeEventListener('mousemove', this.checkEvent);
    Scroll.removeListener(this.checkEvent);
    delete this.index;
  }
}

class MobileModelsSlider {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.check = ()=> {
      if(window.innerWidth >= brakepoints.lg && (!this.initialized || !this.flag)) {
        if(this.initialized) {
          this.destroyMobile();
        }
        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        this.initMobile();
        this.flag = false;
      }
    }
    this.check();
    window.addEventListener('resize', this.check);
    this.initialized = true;
  }

  initMobile() {
    this.$slider = this.$parent.querySelector('.swiper-container');
    this.$pagination = this.$parent.querySelector('.swiper-pagination');

    this.slider = new Swiper(this.$slider, {
      touchStartPreventDefault: false,
      longSwipesRatio: 0.1,
      autoHeight: true,
      speed: 500,
      lazy: {
        loadOnTransitionStart: true,
        loadPrevNext: true
      },
      pagination: {
        el: this.$pagination,
        clickable: true,
        bulletElement: 'button'
      }
    });
  }

  destroyMobile() {
    this.slider.destroy();
  }


}

class MobileLayouts {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.check = ()=> {
      if(window.innerWidth >= brakepoints.lg && (!this.initialized || !this.flag)) {
        if(this.initialized) {
          this.destroyMobile();
        }
        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        this.initMobile();
        this.flag = false;
      }
    }
    this.check();
    window.addEventListener('resize', this.check);
    this.initialized = true;
  }

  initMobile() {
    this.$slider = this.$parent.querySelector('.swiper-container');
    this.$pagination = this.$parent.querySelector('.swiper-pagination');
    this.$images_container = this.$parent.querySelector('.section-layouts__images');
    this.$images = this.$parent.querySelectorAll('.section-layouts__image');

    this.animations = [];
    this.$images.forEach(($image, index) => {
      this.animations[index] = gsap.timeline({paused:true})
        .fromTo($image, {autoAlpha:0}, {autoAlpha:1, duration:0.3})
    })

    this.changeEvent = (index) => {
      if(index > this.index || this.index==undefined) {
        let start = this.index==undefined?-1:this.index;
        for(let i = start+1; i < index+1; i++) {
          this.animations[i].play();
        }
      } else if(index < this.index) {
        for(let i = index+1; i < this.index+1; i++) {
          this.animations[i].reverse();
        }
      }
      this.index = index;
    }

    this.swipeEvent = (event) => {
      let dir = event.detail.directions;
      if(dir.left) this.slider.slideNext();
      else if(dir.right) this.slider.slidePrev();
    }

    this.slider = new Swiper(this.$slider, {
      init: false,
      touchStartPreventDefault: false,
      longSwipesRatio: 0.1,
      speed: 500,
      pagination: {
        el: this.$pagination,
        clickable: true,
        bulletElement: 'button'
      }
    });

    this.slider.on('slideChange', (swiper)=>{
      this.changeEvent(swiper.realIndex)
    });
    this.slider.on('init', (swiper) => {
      this.changeEvent(swiper.realIndex)
    });

    this.slider.init();

    this.swipes = SwipeListener(this.$images_container);
    this.$images_container.addEventListener('swipe', this.swipeEvent);
  }

  destroyMobile() {
    delete this.index;
    this.swipes.off();
    this.$images_container.removeEventListener('swipe', this.swipeEvent);
    this.slider.destroy();
    for(let index in this.animtations) this.animtations[index].kill();
    gsap.set(this.$images, {clearProps: "all"});
  }

}

class ColorsSlider {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$container = this.$parent.querySelector('.colors-slider__container');
    this.$wrapper = this.$parent.querySelector('.colors-slider__wrapper');
    this.$head_inner = this.$parent.querySelector('.colors-slider__head-inner');
    this.$head_container = this.$parent.querySelector('.colors-slider__head-container');
    this.$navigation = this.$parent.querySelector('.colors-slider__navigation');
    this.$slide = this.$parent.querySelectorAll('.colors-slide');
    this.$triggers = this.$parent.querySelectorAll('.colors-slider__navigation-trigger');
    this.$slide_element = this.$parent.querySelector('.colors-slider__slider-element');

    this.resizeEvent = (event)=> {
      let h = this.$slide[this.index].getBoundingClientRect().height;
      if(event) {
        if(window.innerWidth >= brakepoints.sm) {
          gsap.set(this.$wrapper, {clearProps: "all"});
        } else {
          gsap.set(this.$wrapper, {css:{height:h}});
          ScrollTrigger.refresh();
        }
      } else {
        if(window.innerWidth < brakepoints.sm) {
          gsap.to(this.$wrapper, {css:{height:h}, onComplete:()=>{
            ScrollTrigger.refresh();
          }});
        }
      }
    }

    this.scrollNav = (index) => {
      let x1 = this.$triggers[index].getBoundingClientRect().left - this.$head_container.getBoundingClientRect().left,
          x2 = x1 - (window.innerWidth - this.$triggers[index].getBoundingClientRect().width)/2;
      
      gsap.to(this.$head_inner, {scrollTo:{x:x2}});
    }

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
      if(window.innerWidth < brakepoints.lg) {
        this.scrollNav(index); 
      }
      this.$triggers[index].classList.add('active');
      this.index = index;
      this.resizeEvent();
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

    window.addEventListener('resize', this.resizeEvent);
  }
}

class PreviewSection {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.$slider_parent = this.$parent.querySelector('.swiper');
    this.$slider = this.$parent.querySelector('.swiper-container');
    this.$pagination = this.$parent.querySelector('.swiper-pagination');

    this.slider = new Swiper(this.$slider, {
      touchStartPreventDefault: false,
      longSwipesRatio: 0.1,
      speed: 500,
      lazy: {
        loadOnTransitionStart: true,
        loadPrevNext: true
      },
      pagination: {
        el: this.$pagination,
        clickable: true,
        bulletElement: 'button'
      }
    });

    ///
    this.check = ()=> {
      if(window.innerWidth >= brakepoints.lg && (!this.initialized || !this.flag)) {
        
        if(!this.initialized) {
          this.initDesktop();
        } else {
          this.timeout = setTimeout(() => {
            this.initDesktop();
            delete this.timeout;
          }, 500);
        }

        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        if(this.initialized && !this.timeout) {
          this.destroyDesktop();
        } else {
          clearTimeout(this.timeout);
        }
        this.flag = false;
      }
    }
    this.check();
    window.addEventListener('resize', this.check);
    this.initialized = true;
  }

  initDesktop() {
    this.animation = gsap.timeline({paused:true})
      .fromTo(this.$slider, {scale:0.7, yPercent:-15}, {scale:1, yPercent:0, ease:'power2.out'})

    this.trigger = ScrollTrigger.create({
      trigger: this.$slider_parent,
      start: "top bottom",
      end: "bottom bottom",
      onUpdate: self => {
        this.animation.progress(self.progress);
      }
    });
  }

  destroyDesktop() {
    this.animation.kill();
    this.trigger.kill();
    gsap.set(this.$slider, {clearProps: "all"});
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
      touchStartPreventDefault: false,
      longSwipesRatio: 0.1,
      observer: true,
      observeParents: true,
      spaceBetween: 16,
      speed: 500,
      lazy: {
        loadOnTransitionStart: true,
        loadPrevNext: true
      },
      breakpoints: {
        768: {
          spaceBetween: 24
        }
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

class MobileFadeInBlocks {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.check = ()=> {
      if(window.innerWidth >= brakepoints.lg && (!this.initialized || !this.flag)) {
        if(this.initialized) {
          this.destroyMobile();
        }
        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        this.initMobile();
        this.flag = false;
      }
    }
    this.check();
    window.addEventListener('resize', this.check);
    this.initialized = true;
  }

  initMobile() {
    this.$content = this.$parent.querySelector('.mobile-fade-in__content')

    this.animation = gsap.timeline({paused:true})
      .fromTo(this.$content, {autoAlpha:0}, {autoAlpha:1, ease:'power2.out'})
      .fromTo(this.$content, {y:50}, {y:0, ease:'power2.out'}, '-=1')

    this.trigger = ScrollTrigger.create({
      trigger: this.$parent,
      start: "top+=100 bottom",
      end: "bottom bottom",
      once: true,
      onEnter: () => {
        this.animation.play();
      }
    });
  }

  destroyMobile() {
    this.animation.kill();
    this.trigger.kill();
    gsap.set(this.$content, {clearProps: "all"});
  }
}

class MobilePoolAnimation {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.check = ()=> {
      if(window.innerWidth >= brakepoints.lg && (!this.initialized || !this.flag)) {
        if(this.initialized) {
          this.destroyMobile();
        }
        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        this.initMobile();
        this.flag = false;
      }
    }
    this.check();
    window.addEventListener('resize', this.check);
    this.initialized = true;
  }

  initMobile() {
    this.$img = this.$parent.querySelector('img');

    this.animation = gsap.timeline({paused:true})
      .fromTo(this.$parent, {autoAlpha:0}, {autoAlpha:1, ease:'power2.out'})
      .fromTo(this.$img, {scale:0.75, rotate:-30}, {scale:1, rotate:0, duration:1.5, ease:'power2.out'}, '-=1')

    this.trigger = ScrollTrigger.create({
      trigger: this.$parent,
      start: "top+=50 bottom",
      end: "bottom bottom",
      once: true,
      onEnter: () => {
        this.animation.play();
      }
    });
  }

  destroyMobile() {
    this.animation.kill();
    this.trigger.kill();
    gsap.set([this.$parent, this.$img], {clearProps: "all"});
  }
}

class HomeScreenAnimation {
  constructor($parent) {
    this.$parent = $parent;
  }

  init() {
    this.check = ()=> {
      if(window.innerWidth >= brakepoints.lg && (!this.initialized || !this.flag)) {
        if(this.initialized) {
          this.destroyMobile();
        }
        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        this.initMobile();
        this.flag = false;
      }
    }
    this.check();
    window.addEventListener('resize', this.check);
    this.initialized = true;
  }

  initMobile() {
    this.$items = this.$parent.querySelectorAll('.home-screen__image, .home-screen__label, .home-screen__title')

    this.animation = gsap.timeline({paused:true})
      .fromTo(this.$items, {autoAlpha:0}, {autoAlpha:1, duration:0.85, stagger:{amount:0.15}})
      .fromTo(this.$items, {x:100}, {x:0, duration:0.85, ease:'power2.out', stagger:{amount:0.15}}, '-=1')

    this.play = ()=> {
      this.animation.play();
    }
    if(!Preloader.finished) {
      window.addEventListener('start', this.play);
    } else {
      this.play();
    }
  }

  destroyMobile() {
    this.animation.kill();
    gsap.set(this.$items, {clearProps: "all"});
    window.removeEventListener('start', this.play);
  }
}

class MobileEquipment {
  constructor($parent) {
    this.$parent = $parent;
  }
  init() {
    this.check = ()=> {
      if(window.innerWidth >= brakepoints.lg && (!this.initialized || !this.flag)) {
        if(this.initialized) {
          this.destroyMobile();
        }
        this.flag = true;
      } 
      else if(window.innerWidth < brakepoints.lg && (!this.initialized || this.flag)) {
        this.initMobile();
        this.flag = false;
      }
    }
    this.check();
    window.addEventListener('resize', this.check);
    this.initialized = true;
  }

  initMobile() {
    this.$triggers = this.$parent.querySelectorAll('.section-equipment__dot');
    this.$items = this.$parent.querySelectorAll('.section-equipment__description-item');

    this.clickEvents = [];

    this.$triggers.forEach(($this, index) => {
      this.clickEvents[index] = ()=> {
        $this.classList.add('is-active');
        this.$items[index].classList.add('is-active');

        if(this.index!==undefined) {
          this.$triggers[this.index].classList.remove('is-active');
          this.$items[this.index].classList.remove('is-active');
        }

        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.$triggers[this.index].classList.remove('is-active');
          this.$items[this.index].classList.remove('is-active');
        }, 3000);

        this.index = index;
      }

      $this.addEventListener('click', this.clickEvents[index])
    })

  }

  destroyMobile() {
    this.$triggers.forEach(($this, index) => {
      $this.removeEventListener('click', this.clickEvents[index]);
    })
  }
}

