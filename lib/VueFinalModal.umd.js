(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VueFinalModal = {}));
}(this, (function (exports) { 'use strict';

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  } // Older browsers don't support event options, feature detect it.
  // Adopted and modified solution from Bohdan Didukh (2017)
  // https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi


  var hasPassiveEvents = false;

  if (typeof window !== 'undefined') {
    var passiveTestOptions = {
      get passive() {
        hasPassiveEvents = true;
        return undefined;
      }

    };
    window.addEventListener('testPassive', null, passiveTestOptions);
    window.removeEventListener('testPassive', null, passiveTestOptions);
  }

  var isIosDevice = typeof window !== 'undefined' && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  var locks = [];
  var documentListenerAdded = false;
  var initialClientY = -1;
  var previousBodyOverflowSetting = void 0;
  var previousBodyPaddingRight = void 0; // returns true if `el` should be allowed to receive touchmove events.

  var allowTouchMove = function allowTouchMove(el) {
    return locks.some(function (lock) {
      if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
        return true;
      }

      return false;
    });
  };

  var preventDefault = function preventDefault(rawEvent) {
    var e = rawEvent || window.event; // For the case whereby consumers adds a touchmove event listener to document.
    // Recall that we do document.addEventListener('touchmove', preventDefault, { passive: false })
    // in disableBodyScroll - so if we provide this opportunity to allowTouchMove, then
    // the touchmove event on document will break.

    if (allowTouchMove(e.target)) {
      return true;
    } // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).


    if (e.touches.length > 1) return true;
    if (e.preventDefault) e.preventDefault();
    return false;
  };

  var setOverflowHidden = function setOverflowHidden(options) {
    // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
    // the responsiveness for some reason. Setting within a setTimeout fixes this.
    setTimeout(function () {
      // If previousBodyPaddingRight is already set, don't set it again.
      if (previousBodyPaddingRight === undefined) {
        var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;

        var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

        if (_reserveScrollBarGap && scrollBarGap > 0) {
          previousBodyPaddingRight = document.body.style.paddingRight;
          document.body.style.paddingRight = scrollBarGap + 'px';
        }
      } // If previousBodyOverflowSetting is already set, don't set it again.


      if (previousBodyOverflowSetting === undefined) {
        previousBodyOverflowSetting = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
    });
  };

  var restoreOverflowSetting = function restoreOverflowSetting() {
    // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
    // the responsiveness for some reason. Setting within a setTimeout fixes this.
    setTimeout(function () {
      if (previousBodyPaddingRight !== undefined) {
        document.body.style.paddingRight = previousBodyPaddingRight; // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
        // can be set again.

        previousBodyPaddingRight = undefined;
      }

      if (previousBodyOverflowSetting !== undefined) {
        document.body.style.overflow = previousBodyOverflowSetting; // Restore previousBodyOverflowSetting to undefined
        // so setOverflowHidden knows it can be set again.

        previousBodyOverflowSetting = undefined;
      }
    });
  }; // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions


  var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
    return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
  };

  var handleScroll = function handleScroll(event, targetElement) {
    var clientY = event.targetTouches[0].clientY - initialClientY;

    if (allowTouchMove(event.target)) {
      return false;
    }

    if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
      // element is at the top of its scroll.
      return preventDefault(event);
    }

    if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
      // element is at the bottom of its scroll.
      return preventDefault(event);
    }

    event.stopPropagation();
    return true;
  };

  var disableBodyScroll = function disableBodyScroll(targetElement, options) {
    if (isIosDevice) {
      // targetElement must be provided, and disableBodyScroll must not have been
      // called on this targetElement before.
      if (!targetElement) {
        // eslint-disable-next-line no-console
        console.error('disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.');
        return;
      }

      if (targetElement && !locks.some(function (lock) {
        return lock.targetElement === targetElement;
      })) {
        var lock = {
          targetElement: targetElement,
          options: options || {}
        };
        locks = [].concat(_toConsumableArray(locks), [lock]);

        targetElement.ontouchstart = function (event) {
          if (event.targetTouches.length === 1) {
            // detect single touch.
            initialClientY = event.targetTouches[0].clientY;
          }
        };

        targetElement.ontouchmove = function (event) {
          if (event.targetTouches.length === 1) {
            // detect single touch.
            handleScroll(event, targetElement);
          }
        };

        if (!documentListenerAdded) {
          document.addEventListener('touchmove', preventDefault, hasPassiveEvents ? {
            passive: false
          } : undefined);
          documentListenerAdded = true;
        }
      }
    } else {
      setOverflowHidden(options);
      var _lock = {
        targetElement: targetElement,
        options: options || {}
      };
      locks = [].concat(_toConsumableArray(locks), [_lock]);
    }
  };
  var clearAllBodyScrollLocks = function clearAllBodyScrollLocks() {
    if (isIosDevice) {
      // Clear all locks ontouchstart/ontouchmove handlers, and the references.
      locks.forEach(function (lock) {
        lock.targetElement.ontouchstart = null;
        lock.targetElement.ontouchmove = null;
      });

      if (documentListenerAdded) {
        document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? {
          passive: false
        } : undefined);
        documentListenerAdded = false;
      }

      locks = []; // Reset initial clientY.

      initialClientY = -1;
    } else {
      restoreOverflowSetting();
      locks = [];
    }
  };

  //
  let modalStack = [];
  const TransitionState = {
    Enter: 'enter',
    Entering: 'entering',
    Leave: 'leave',
    Leaving: 'leavng'
  };
  var script = {
    name: 'VueFinalModal',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      ssr: {
        type: Boolean,
        default: false
      },
      classes: {
        type: [String, Object, Array],
        default: ''
      },
      contentClass: {
        type: [String, Object, Array],
        default: ''
      },
      lockScroll: {
        type: Boolean,
        default: true
      },
      hideOverlay: {
        type: Boolean,
        default: false
      },
      clickToClose: {
        type: Boolean,
        default: true
      },
      preventClick: {
        type: Boolean,
        default: false
      },
      overlayClass: {
        type: String,
        default: ''
      },
      attach: {
        type: null,
        default: 'body'
      },
      transition: {
        type: String,
        default: 'vfm'
      },
      overlayTransition: {
        type: String,
        default: 'vfm'
      },
      zIndex: {
        type: [String, Number],
        default: 1000
      }
    },
    data: () => ({
      visible: false,
      visibility: {
        modal: false,
        overlay: false
      },
      overlayTransitionState: null,
      modalTransitionState: null
    }),
    computed: {
      isComponentReadyToBeDestroyed() {
        return this.overlayTransitionState === TransitionState.Leave && this.modalTransitionState === TransitionState.Leave;
      }

    },
    watch: {
      value(value) {
        this.mounted(value);

        if (value === false) {
          this.close();
        }
      },

      lockScroll: 'handleLockScroll',

      hideOverlay(value) {
        if (this.value) {
          !value && this.appendOverlay();
        }
      },

      attach() {
        this.mounted(this.value);
      },

      isComponentReadyToBeDestroyed(isReady) {
        if (isReady) {
          this.visible = false;
        }
      }

    },

    mounted() {
      this.mounted(this.value);
    },

    beforeDestroy() {
      this.close();
    },

    methods: {
      mounted(value) {
        if (value) {
          let target = this.getAttachElement();

          if (target) {
            target.appendChild(this.$el);
            let index = modalStack.findIndex(vm => vm === this);

            if (index !== -1) {
              // if this is already exist in modalStack, delete it
              modalStack.splice(index, 1);
            }

            modalStack.push(this);
            this.handleLockScroll();
            modalStack.filter(vm => vm !== this).forEach(vm => {
              if (vm.getAttachElement() === target) {
                // if vm and this have the same attach element
                vm.visibility.overlay = false;
              }
            });
          } else if (target !== false) {
            console.warn('Unable to locate target '.concat(this.attach || 'body'));
            return;
          }

          this.visible = true;
          this.$nextTick(() => {
            this.startTransitionEnter();
          });
        } else {
          this.lockScroll && clearAllBodyScrollLocks();
        }
      },

      close() {
        let index = modalStack.findIndex(vm => vm === this);

        if (index !== -1) {
          // remove this in modalStack
          modalStack.splice(index, 1);
        }

        if (modalStack.length > 0) {
          // If there are still nested modals opened
          const $_vm = modalStack[modalStack.length - 1];
          $_vm.handleLockScroll();
          !$_vm.hideOverlay && $_vm.appendOverlay();
        } else {
          // If the closed modal is the last one
          this.lockScroll && clearAllBodyScrollLocks();
        }

        this.startTransitionLeave();
      },

      startTransitionEnter() {
        this.visibility.overlay = true;
        this.visibility.modal = true;
      },

      startTransitionLeave() {
        this.visibility.overlay = false;
        this.visibility.modal = false;
      },

      appendOverlay() {
        this.visibility.overlay = true;
      },

      handleLockScroll() {
        this.lockScroll ? disableBodyScroll(this.$refs.vfmContent) : clearAllBodyScrollLocks();
      },

      getAttachElement() {
        let target;

        if (this.attach === false) {
          target = false;
        } else if (typeof this.attach === 'string') {
          // CSS selector
          if (window) {
            target = window.document.querySelector(this.attach);
          } else {
            target = false;
          }
        } else {
          // DOM Element
          target = this.attach;
        }

        return target;
      },

      beforeOverlayEnter() {
        this.overlayTransitionState = TransitionState.Entering;
      },

      afterOverlayEnter() {
        this.overlayTransitionState = TransitionState.Enter;
      },

      beforeOverlayLeave() {
        this.overlayTransitionState = TransitionState.Leaving;
      },

      afterOverlayLeave() {
        this.overlayTransitionState = TransitionState.Leave;
      },

      beforeModalEnter() {
        this.$emit('before-open');
        this.modalTransitionState = TransitionState.Entering;
      },

      afterModalEnter() {
        this.modalTransitionState = TransitionState.Enter;
        this.$emit('opened');
      },

      beforeModalLeave() {
        this.$emit('before-close');
        this.modalTransitionState = TransitionState.Leaving;
      },

      afterModalLeave() {
        this.modalTransitionState = TransitionState.Leave;
        this.$emit('closed');
      }

    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    const options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    let hook;

    if (moduleIdentifier) {
      // server build
      hook = function (context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function (context) {
        style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        const originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        const existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  const isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

  function createInjector(context) {
    return (id, style) => addStyle(id, style);
  }

  let HEAD;
  const styles = {};

  function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      let code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) style.element.setAttribute('media', css.media);

        if (HEAD === undefined) {
          HEAD = document.head || document.getElementsByTagName('head')[0];
        }

        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        const index = style.ids.size - 1;
        const textNode = document.createTextNode(code);
        const nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  }

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.ssr ? true : _vm.visible)?_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.ssr ? _vm.visible : true),expression:"ssr ? visible : true"}],staticClass:"vfm"},[_c('transition',{attrs:{"name":_vm.overlayTransition},on:{"before-enter":_vm.beforeOverlayEnter,"after-enter":_vm.afterOverlayEnter,"before-leave":_vm.beforeOverlayLeave,"after-leave":_vm.afterOverlayLeave}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(!_vm.hideOverlay && _vm.visibility.overlay),expression:"!hideOverlay && visibility.overlay"}],staticClass:"vfm__overlay",class:[
          { 'vfm__overlay--attach': _vm.attach !== 'body' },
          { 'vfm__overlay--prevent-click': _vm.preventClick },
          _vm.overlayClass
        ],style:({ zIndex: _vm.zIndex })})]),_vm._v(" "),_c('transition',{attrs:{"name":_vm.transition},on:{"before-enter":_vm.beforeModalEnter,"after-enter":_vm.afterModalEnter,"before-leave":_vm.beforeModalLeave,"after-leave":_vm.afterModalLeave}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.visibility.modal),expression:"visibility.modal"}],staticClass:"vfm__container",class:[
          {
            'vfm__container--attach': _vm.attach !== 'body',
            'vfm__container--prevent-click': _vm.preventClick
          },
          _vm.classes
        ],style:({ zIndex: _vm.zIndex }),on:{"click":function($event){_vm.clickToClose && _vm.$emit('input', false);}}},[_vm._t("content-before"),_vm._v(" "),_vm._t("content",[_c('div',{ref:"vfmContent",staticClass:"vfm__content",class:_vm.contentClass,on:{"click":function($event){$event.stopPropagation();}}},[_vm._t("default")],2)]),_vm._v(" "),_vm._t("content-after")],2)])],1):_vm._e()};
  var __vue_staticRenderFns__ = [];

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-ef7e62ac_0", { source: ".vfm__overlay[data-v-ef7e62ac]{position:fixed;top:0;left:0;bottom:0;right:0;background-color:rgba(0,0,0,.5)}.vfm__overlay--attach[data-v-ef7e62ac]{position:absolute;width:100%;height:100%}.vfm__overlay--prevent-click[data-v-ef7e62ac]{pointer-events:none}.vfm__container[data-v-ef7e62ac]{position:fixed;top:0;left:0;bottom:0;right:0}.vfm__container--attach[data-v-ef7e62ac]{position:absolute}.vfm__container--prevent-click[data-v-ef7e62ac]{pointer-events:none}.vfm__container--prevent-click .vfm__content[data-v-ef7e62ac]{pointer-events:auto}.vfm-enter-active[data-v-ef7e62ac],.vfm-leave-active[data-v-ef7e62ac]{transition:opacity .2s}.vfm-enter[data-v-ef7e62ac],.vfm-leave-to[data-v-ef7e62ac]{opacity:0}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = "data-v-ef7e62ac";
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    const __vue_component__ = /*#__PURE__*/normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  const VueFinalModal = __vue_component__;
  const install = function (Vue) {
    Vue.component('VueFinalModal', VueFinalModal);
  };

  exports.VueFinalModal = VueFinalModal;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
