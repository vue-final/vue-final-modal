import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick, withScopeId, pushScopeId, popScopeId, withDirectives, openBlock, createBlock, withKeys, createVNode, Transition, mergeProps, createCommentVNode, withModifiers, renderSlot, Fragment, renderList, vShow, resolveDynamicComponent, toHandlers, createSlots, withCtx, shallowReactive } from 'vue';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var FOCUSABLE_ELEMENTS_QUERY = 'button:not([disabled]), ' + 'select:not([disabled]), ' + 'a[href]:not([disabled]), ' + 'area[href]:not([disabled]), ' + '[contentEditable=""]:not([disabled]), ' + '[contentEditable="true"]:not([disabled]), ' + '[contentEditable="TRUE"]:not([disabled]), ' + 'textarea:not([disabled]), ' + 'iframe:not([disabled]), ' + 'input:not([disabled]), ' + 'summary:not([disabled]), ' + '[tabindex]:not([tabindex="-1"])';

var isTabPressed = function isTabPressed(event) {
  return event.key === 'Tab' || event.keyCode === 9;
};

var querySelectorAll = function querySelectorAll(element, selector) {
  return _toConsumableArray(element.querySelectorAll(selector) || []);
};

var queryFocusableElements = function queryFocusableElements(element) {
  return querySelectorAll(element, FOCUSABLE_ELEMENTS_QUERY);
};

var isFocused = function isFocused(element) {
  return element == document.activeElement;
};

var isNothingFocused = function isNothingFocused() {
  return !document.activeElement;
};

var FocusTrap = /*#__PURE__*/function () {
  function FocusTrap() {
    _classCallCheck(this, FocusTrap);

    this.root = null;
    this.elements = [];
    this.onKeyDown = this.onKeyDown.bind(this);
    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
    this.firstElement = this.firstElement.bind(this);
    this.lastElement = this.lastElement.bind(this);
  }

  _createClass(FocusTrap, [{
    key: "lastElement",
    value: function lastElement() {
      return this.elements[this.elements.length - 1] || null;
    }
  }, {
    key: "firstElement",
    value: function firstElement() {
      return this.elements[0] || null;
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(event) {
      if (!isTabPressed(event)) {
        return;
      }

      if (event.shiftKey) {
        if (isFocused(this.firstElement())) {
          this.lastElement().focus();
          event.preventDefault();
        }

        return;
      }

      if (isNothingFocused() || isFocused(this.lastElement())) {
        this.firstElement().focus();
        event.preventDefault();
        return;
      }
    }
  }, {
    key: "enabled",
    value: function enabled() {
      return !!this.root;
    }
  }, {
    key: "enable",
    value: function enable(root) {
      if (!root) {
        return;
      }

      this.root = root;
      this.elements = queryFocusableElements(this.root);
      this.root.addEventListener('keydown', this.onKeyDown);
    }
  }, {
    key: "disable",
    value: function disable() {
      this.root.removeEventListener('keydown', this.onKeyDown);
      this.root = null;
    }
  }]);

  return FocusTrap;
}();

var setStyle = function setStyle(el, key, value) {
  var cacheStyle = el.style[key];
  el.style[key] = value;
  return function () {
    el.style[key] = cacheStyle;
  };
};
var getPosition = function getPosition(e) {
  var _ref = e.targetTouches ? e.targetTouches[0] : e,
      x = _ref.clientX,
      y = _ref.clientY;

  return {
    x: x,
    y: y
  };
};
var capitalize = function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
var clamp = function clamp(min, num, max) {
  if (typeof min !== 'number') {
    min = Math.min(num, max) || num;
  }

  if (typeof max !== 'number') {
    max = Math.max(num, min);
  }

  return Math.min(Math.max(num, min), max);
};
var trimPx = function trimPx(distance) {
  return distance && Number(distance.replace(/px$/, '')) || 0;
};
var validDragElement = function validDragElement(e, el, dragSelector) {
  if (dragSelector === '') return true;

  var list = _toConsumableArray(el.querySelectorAll(dragSelector));

  return list.includes(e.target);
};
var pointerType = {
  down: {
    pc: 'mousedown',
    m: 'touchstart'
  },
  move: {
    pc: 'mousemove',
    m: 'touchmove'
  },
  up: {
    pc: 'mouseup',
    m: 'touchend'
  }
};
var addListener = function addListener(type, el, callback) {
  el && el.addEventListener(pointerType[type].pc, callback);
  el && el.addEventListener(pointerType[type].m, callback, {
    passive: false
  });
};
var removeListener = function removeListener(type, el, callback) {
  el && el.removeEventListener(pointerType[type].pc, callback);
  el && el.removeEventListener(pointerType[type].m, callback);
};

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
var clientY = 0;
var initialClientY = -1;
var previousBodyOverflowSetting;
var previousBodyPaddingRight;

var hasScrollbar = function hasScrollbar(el) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
  var style = window.getComputedStyle(el);
  return ['auto', 'scroll'].includes(style.overflowY) && el.scrollHeight > el.clientHeight;
};

var shouldScroll = function shouldScroll(el, delta) {
  if (el.scrollTop === 0 && delta < 0) return false;
  if (el.scrollTop + el.clientHeight + delta >= el.scrollHeight && delta > 0) return false;
  return true;
};

var composedPath = function composedPath(el) {
  var path = [];

  while (el) {
    path.push(el);
    if (el.classList.contains('vfm')) return path;
    el = el.parentElement;
  }

  return path;
};

var hasAnyScrollableEl = function hasAnyScrollableEl(el, delta) {
  var hasAnyScrollableEl = false;
  var path = composedPath(el);
  path.forEach(function (el) {
    if (hasScrollbar(el) && shouldScroll(el, delta)) {
      hasAnyScrollableEl = true;
    }
  });
  return hasAnyScrollableEl;
};

var allowTouchMove = function allowTouchMove(el) {
  return locks.some(function () {
    return hasAnyScrollableEl(el, -clientY);
  });
};

var preventDefault = function preventDefault(rawEvent) {
  var e = rawEvent || window.event;

  if (allowTouchMove(e.target)) {
    return true;
  }

  if (e.touches.length > 1) return true;
  if (e.preventDefault) e.preventDefault();
  return false;
};

var setOverflowHidden = function setOverflowHidden(options) {
  if (previousBodyPaddingRight === undefined) {
    var reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
    var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

    if (reserveScrollBarGap && scrollBarGap > 0) {
      var computedBodyPaddingRight = parseInt(getComputedStyle(document.body).getPropertyValue('padding-right'), 10);
      previousBodyPaddingRight = document.body.style.paddingRight;
      document.body.style.paddingRight = "".concat(computedBodyPaddingRight + scrollBarGap, "px");
    }
  }

  if (previousBodyOverflowSetting === undefined) {
    previousBodyOverflowSetting = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
};

var restoreOverflowSetting = function restoreOverflowSetting() {
  if (previousBodyPaddingRight !== undefined) {
    document.body.style.paddingRight = previousBodyPaddingRight;
    previousBodyPaddingRight = undefined;
  }

  if (previousBodyOverflowSetting !== undefined) {
    document.body.style.overflow = previousBodyOverflowSetting;
    previousBodyOverflowSetting = undefined;
  }
};

var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
  return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
};

var handleScroll = function handleScroll(event, targetElement) {
  clientY = event.targetTouches[0].clientY - initialClientY;

  if (allowTouchMove(event.target)) {
    return false;
  }

  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    return preventDefault(event);
  }

  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    return preventDefault(event);
  }

  event.stopPropagation();
  return true;
};

var disableBodyScroll = function disableBodyScroll(targetElement, options) {
  if (!targetElement) {
    console.error('disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.');
    return;
  }

  if (locks.some(function (lock) {
    return lock.targetElement === targetElement;
  })) {
    return;
  }

  var lock = {
    targetElement: targetElement,
    options: options || {}
  };
  locks = [].concat(_toConsumableArray(locks), [lock]);

  if (isIosDevice) {
    targetElement.ontouchstart = function (event) {
      if (event.targetTouches.length === 1) {
        initialClientY = event.targetTouches[0].clientY;
      }
    };

    targetElement.ontouchmove = function (event) {
      if (event.targetTouches.length === 1) {
        handleScroll(event, targetElement);
      }
    };

    if (!documentListenerAdded) {
      document.addEventListener('touchmove', preventDefault, hasPassiveEvents ? {
        passive: false
      } : undefined);
      documentListenerAdded = true;
    }
  } else {
    setOverflowHidden(options);
  }
};
var enableBodyScroll = function enableBodyScroll(targetElement) {
  if (!targetElement) {
    console.error('enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.');
    return;
  }

  locks = locks.filter(function (lock) {
    return lock.targetElement !== targetElement;
  });

  if (isIosDevice) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;

    if (documentListenerAdded && locks.length === 0) {
      document.removeEventListener('touchmove', preventDefault, hasPassiveEvents ? {
        passive: false
      } : undefined);
      documentListenerAdded = false;
    }
  } else if (!locks.length) {
    restoreOverflowSetting();
  }
};

var noop = function noop() {};

var TransitionState = {
  Enter: 'enter',
  Entering: 'entering',
  Leave: 'leave',
  Leaving: 'leavng'
};
var resizeCursor = {
  t: 'ns-resize',
  tr: 'nesw-resize',
  r: 'ew-resize',
  br: 'nwse-resize',
  b: 'ns-resize',
  bl: 'nesw-resize',
  l: 'ew-resize',
  tl: 'nwse-resize'
};
var script$1 = {
  props: {
    name: {
      type: String,
      "default": null
    },
    modelValue: {
      type: Boolean,
      "default": false
    },
    ssr: {
      type: Boolean,
      "default": true
    },
    classes: {
      type: [String, Object, Array],
      "default": ''
    },
    overlayClass: {
      type: [String, Object, Array],
      "default": ''
    },
    contentClass: {
      type: [String, Object, Array],
      "default": ''
    },
    styles: {
      type: [Object, Array],
      "default": function _default() {
        return {};
      }
    },
    overlayStyle: {
      type: [Object, Array],
      "default": function _default() {
        return {};
      }
    },
    contentStyle: {
      type: [Object, Array],
      "default": function _default() {
        return {};
      }
    },
    lockScroll: {
      type: Boolean,
      "default": true
    },
    hideOverlay: {
      type: Boolean,
      "default": false
    },
    clickToClose: {
      type: Boolean,
      "default": true
    },
    escToClose: {
      type: Boolean,
      "default": false
    },
    preventClick: {
      type: Boolean,
      "default": false
    },
    attach: {
      type: null,
      "default": false,
      validator: function validator(val) {
        var type = _typeof(val);

        if (type === 'boolean' || type === 'string') return true;
        return val.nodeType === Node.ELEMENT_NODE;
      }
    },
    transition: {
      type: [String, Object],
      "default": 'vfm'
    },
    overlayTransition: {
      type: [String, Object],
      "default": 'vfm'
    },
    keepOverlay: {
      type: Boolean,
      "default": false
    },
    zIndexAuto: {
      type: Boolean,
      "default": true
    },
    zIndexBase: {
      type: [String, Number],
      "default": 1000
    },
    zIndex: {
      type: [Boolean, String, Number],
      "default": false
    },
    focusRetain: {
      type: Boolean,
      "default": true
    },
    focusTrap: {
      type: Boolean,
      "default": false
    },
    fitParent: {
      type: Boolean,
      "default": true
    },
    drag: {
      type: Boolean,
      "default": false
    },
    dragSelector: {
      type: String,
      "default": ''
    },
    keepChangedStyle: {
      type: Boolean,
      "default": false
    },
    resize: {
      type: Boolean,
      "default": false
    },
    resizeDirections: {
      type: Array,
      "default": function _default() {
        return ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'];
      },
      validator: function validator(val) {
        return ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'].filter(function (value) {
          return val.indexOf(value) !== -1;
        }).length === val.length;
      }
    },
    minWidth: {
      type: Number,
      "default": 0
    },
    minHeight: {
      type: Number,
      "default": 0
    },
    maxWidth: {
      type: Number,
      "default": Infinity
    },
    maxHeight: {
      type: Number,
      "default": Infinity
    }
  },
  emits: ['update:modelValue', 'click-outside', 'before-open', 'opened', 'before-close', 'closed', '_before-open', '_opened', '_closed', 'drag:start', 'drag:move', 'drag:end', 'resize:start', 'resize:move', 'resize:end'],
  setup: function setup(props, _ref) {
    var emit = _ref.emit;
    var uid = Symbol('vfm');
    var root = ref(null);
    var vfmContainer = ref(null);
    var vfmContent = ref(null);
    var vfmResize = ref(null);
    var vfmOverlayTransition = ref(null);
    var vfmTransition = ref(null);
    var modalStackIndex = ref(null);
    var $focusTrap = new FocusTrap();
    var visible = ref(false);
    var visibility = reactive({
      modal: false,
      overlay: false,
      resize: false
    });
    var overlayTransitionState = ref(null);
    var modalTransitionState = ref(null);

    var _stopEvent = ref(false);

    var params = ref({});
    var dragResizeStyle = ref({});

    var _state = ref(null);

    var lastMousedownEl = ref(null);
    var _resolveToggle = noop;
    var _rejectToggle = noop;
    var computedOverlayTransition = computed(function () {
      if (typeof props.overlayTransition === 'string') return {
        name: props.overlayTransition
      };
      return _objectSpread2({}, props.overlayTransition);
    });
    var computedTransition = computed(function () {
      if (typeof props.transition === 'string') return {
        name: props.transition
      };
      return _objectSpread2({}, props.transition);
    });
    var isComponentReadyToBeDestroyed = computed(function () {
      return (props.hideOverlay || overlayTransitionState.value === TransitionState.Leave) && modalTransitionState.value === TransitionState.Leave;
    });
    var calculateZIndex = computed(function () {
      if (props.zIndex === false) {
        if (props.zIndexAuto) {
          return +props.zIndexBase + 2 * (modalStackIndex.value || 0);
        } else {
          return false;
        }
      } else {
        return props.zIndex;
      }
    });
    var bindStyle = computed(function () {
      return _objectSpread2({}, calculateZIndex.value !== false && {
        zIndex: calculateZIndex.value
      });
    });
    var bindContentStyle = computed(function () {
      var style = [dragResizeStyle.value];
      Array.isArray(props.contentStyle) ? style.push.apply(style, _toConsumableArray(props.contentStyle)) : style.push(props.contentStyle);
      return style;
    });
    watch(function () {
      return props.modelValue;
    }, function (value) {
      if (_stopEvent.value) {
        _stopEvent.value = false;
        return;
      }

      mounted();

      if (!value) {
        if (emitEvent('before-close', true)) {
          _rejectToggle('hide');

          return;
        }

        close();
      }
    });
    watch(function () {
      return props.lockScroll;
    }, handleLockScroll);
    watch(function () {
      return props.hideOverlay;
    }, function (value) {
      if (props.modelValue && !value) {
        visibility.overlay = true;
      }
    });
    watch(function () {
      return props.attach;
    }, mounted);
    watch(isComponentReadyToBeDestroyed, function (val) {
      if (val) {
        visible.value = false;
        vfmContainer.value.style.display = 'none';
      }
    }, {
      flush: 'post'
    });
    watch(function () {
      return props.drag;
    }, function (val) {
      if (visible.value) {
        val ? addDragDown() : removeDragDown();
      }
    });
    watch(function () {
      return props.resize;
    }, function (val) {
      if (visible.value) {
        val ? addResizeDown() : removeResizeDown();
      }
    });
    watch(function () {
      return props.keepChangedStyle;
    }, function (val) {
      if (!val) {
        dragResizeStyle.value = {};
      }
    });
    onMounted(function () {
      props.api.modals.push(getModalInfo());
      mounted();
    });
    onBeforeUnmount(function () {
      var _root$value;

      close();
      props.lockScroll && vfmContainer.value && enableBodyScroll(vfmContainer.value);
      root === null || root === void 0 ? void 0 : (_root$value = root.value) === null || _root$value === void 0 ? void 0 : _root$value.remove();
      var index = props.api.modals.findIndex(function (vm) {
        return vm.uid === uid;
      });
      props.api.modals.splice(index, 1);
    });

    function getModalInfo() {
      return {
        uid: uid,
        props: props,
        emit: emit,
        vfmContainer: vfmContainer,
        vfmContent: vfmContent,
        vfmResize: vfmResize,
        vfmOverlayTransition: vfmOverlayTransition,
        vfmTransition: vfmTransition,
        getAttachElement: getAttachElement,
        modalStackIndex: modalStackIndex,
        visibility: visibility,
        handleLockScroll: handleLockScroll,
        $focusTrap: $focusTrap,
        toggle: toggle,
        params: params
      };
    }

    function mounted() {
      if (props.modelValue) {
        emit('_before-open', createModalEvent({
          type: '_before-open'
        }));

        if (emitEvent('before-open', false)) {
          _rejectToggle('show');

          return;
        }

        var target = getAttachElement();

        if (target || props.attach === false) {
          if (props.attach !== false) {
            if (root.value) {
              target.appendChild(root.value);
            } else {
              visible.value = true;
              nextTick(function () {
                mounted();
              });
              return;
            }
          }

          var index = props.api.openedModals.findIndex(function (vm) {
            return vm.uid === uid;
          });

          if (index !== -1) {
            props.api.openedModals.splice(index, 1);
          }

          props.api.openedModals.push(getModalInfo());
          modalStackIndex.value = props.api.openedModals.length - 1;
          handleLockScroll();
          props.api.openedModals.filter(function (vm) {
            return vm.uid !== uid;
          }).forEach(function (vm, index) {
            if (vm.getAttachElement() === target) {
              vm.modalStackIndex.value = index;
              !vm.props.keepOverlay && (vm.visibility.overlay = false);
            }
          });
          visible.value = true;
          startTransitionEnter();
        } else if (target !== false) {
          console.warn('Unable to locate target '.concat(props.attach));
        }
      }
    }

    function close() {
      var index = props.api.openedModals.findIndex(function (vm) {
        return vm.uid === uid;
      });

      if (index !== -1) {
        props.api.openedModals.splice(index, 1);
      }

      if (props.api.openedModals.length > 0) {
        var $_vm = props.api.openedModals[props.api.openedModals.length - 1];
        $_vm.props.focusTrap && $_vm.$focusTrap.firstElement().focus();

        if ($_vm.props.focusRetain || $_vm.props.focusTrap) {
          $_vm.vfmContainer.value.focus();
        }

        !$_vm.props.hideOverlay && ($_vm.visibility.overlay = true);
      }

      props.drag && removeDragDown();
      props.resize && removeResizeDown();
      _state.value = null;
      startTransitionLeave();
    }

    function handleLockScroll() {
      if (props.modelValue) {
        nextTick(function () {
          if (props.lockScroll) {
            disableBodyScroll(vfmContainer.value, {
              reserveScrollBarGap: true
            });
          } else {
            enableBodyScroll(vfmContainer.value);
          }
        });
      }
    }

    function getAttachElement() {
      var target;

      if (props.attach === false) {
        target = false;
      } else if (typeof props.attach === 'string') {
        if (window) {
          target = window.document.querySelector(props.attach);
        } else {
          target = false;
        }
      } else {
        target = props.attach;
      }

      return target;
    }

    function startTransitionEnter() {
      visibility.overlay = true;
      visibility.modal = true;
    }

    function startTransitionLeave() {
      visibility.overlay = false;
      visibility.modal = false;
    }

    function beforeOverlayEnter() {
      overlayTransitionState.value = TransitionState.Entering;
    }

    function afterOverlayEnter() {
      overlayTransitionState.value = TransitionState.Enter;
    }

    function beforeOverlayLeave() {
      overlayTransitionState.value = TransitionState.Leaving;
    }

    function afterOverlayLeave() {
      overlayTransitionState.value = TransitionState.Leave;
    }

    function beforeModalEnter() {
      modalTransitionState.value = TransitionState.Entering;
    }

    function afterModalEnter() {
      modalTransitionState.value = TransitionState.Enter;

      if (props.focusRetain || props.focusTrap) {
        vfmContainer.value.focus();
      }

      props.focusTrap && $focusTrap.enable(vfmContainer.value);
      props.drag && addDragDown();
      props.resize && addResizeDown();
      emit('_opened');
      emit('opened', createModalEvent({
        type: 'opened'
      }));

      _resolveToggle('show');
    }

    function beforeModalLeave() {
      modalTransitionState.value = TransitionState.Leaving;

      if ($focusTrap.enabled()) {
        $focusTrap.disable();
      }
    }

    function afterModalLeave() {
      modalTransitionState.value = TransitionState.Leave;
      modalStackIndex.value = null;
      props.lockScroll && enableBodyScroll(vfmContainer.value);

      if (!props.keepChangedStyle) {
        dragResizeStyle.value = {};
      }

      var stopEvent = false;
      var event = createModalEvent({
        type: 'closed',
        stop: function stop() {
          stopEvent = true;
        }
      });
      emit('_closed');
      emit('closed', event);

      _resolveToggle('hide');

      if (stopEvent) return;
      params.value = {};
    }

    function onMousedown(e) {
      lastMousedownEl.value = e === null || e === void 0 ? void 0 : e.target;
    }

    function onMouseupContainer() {
      if (lastMousedownEl.value !== vfmContainer.value) return;
      if (_state.value === 'resize:move') return;
      emit('click-outside', createModalEvent({
        type: 'click-outside'
      }));
      props.clickToClose && emit('update:modelValue', false);
    }

    function onEsc() {
      if (visible.value && props.escToClose) {
        emit('update:modelValue', false);
      }
    }

    function createModalEvent() {
      var eventProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return _objectSpread2({
        ref: getModalInfo()
      }, eventProps);
    }

    function emitEvent(eventType, value) {
      var stopEvent = false;
      var event = createModalEvent({
        type: eventType,
        stop: function stop() {
          stopEvent = true;
        }
      });
      emit(eventType, event);

      if (stopEvent) {
        _stopEvent.value = true;
        nextTick(function () {
          emit('update:modelValue', value);
        });
        return true;
      }

      return false;
    }

    function emitState(e, state, action) {
      _state.value = "".concat(state, ":").concat(action);
      emit(_state.value, e);
    }

    function toggle(show, _params) {
      var _arguments = arguments;
      return new Promise(function (resolve, reject) {
        _resolveToggle = function resolveToggle(res) {
          resolve(res);
          _resolveToggle = noop;
        };

        _rejectToggle = function rejectToggle(err) {
          reject(err);
          _rejectToggle = noop;
        };

        var value = typeof show === 'boolean' ? show : !props.modelValue;

        if (value && _arguments.length === 2) {
          params.value = _params;
        }

        emit('update:modelValue', value);
      });
    }

    function pointerDown(e) {
      e.stopPropagation();
      var STATE_RESIZE = 'resize';
      var STATE_DRAG = 'drag';
      var direction = e.target.getAttribute('direction');
      var state;

      if (direction) {
        state = STATE_RESIZE;
      } else if (validDragElement(e, vfmContent.value, props.dragSelector)) {
        state = STATE_DRAG;
      } else {
        return;
      }

      emitState(e, state, 'start');
      var down = getPosition(e);
      var rectContainer = vfmContainer.value.getBoundingClientRect();
      var rectContent = vfmContent.value.getBoundingClientRect();
      var isAbsolute = window.getComputedStyle(vfmContent.value).position === 'absolute';
      var position = {
        top: trimPx(dragResizeStyle.value.top),
        left: trimPx(dragResizeStyle.value.left)
      };

      var limit = function () {
        if (props.fitParent) {
          var _limit = {
            absolute: function absolute() {
              return {
                minTop: 0,
                minLeft: 0,
                maxTop: rectContainer.height - rectContent.height,
                maxLeft: rectContainer.width - rectContent.width
              };
            },
            relative: function relative() {
              return {
                minTop: position.top + rectContainer.top - rectContent.top,
                minLeft: position.left + rectContainer.left - rectContent.left,
                maxTop: position.top + rectContainer.bottom - rectContent.bottom,
                maxLeft: position.left + rectContainer.right - rectContent.right
              };
            }
          };
          return isAbsolute ? _limit.absolute() : _limit.relative();
        } else {
          return {};
        }
      }();

      var resetBodyCursor = state === STATE_RESIZE && setStyle(document.body, 'cursor', resizeCursor[direction]);

      var moving = function moving(e) {
        e.stopPropagation();
        emitState(e, state, 'move');
        var move = getPosition(e);
        var offset = {
          x: move.x - down.x,
          y: move.y - down.y
        };

        if (state === STATE_RESIZE) {
          offset = getResizeOffset(direction, offset, rectContainer, rectContent, isAbsolute);
        }

        var top;
        var left;

        if (isAbsolute) {
          top = rectContent.top - rectContainer.top + offset.y;
          left = rectContent.left - rectContainer.left + offset.x;
        } else {
          top = position.top + offset.y;
          left = position.left + offset.x;
        }

        if (state === STATE_DRAG && props.fitParent) {
          top = clamp(limit.minTop, top, limit.maxTop);
          left = clamp(limit.minLeft, left, limit.maxLeft);
        }

        var style = _objectSpread2(_objectSpread2(_objectSpread2({
          position: 'relative',
          top: top + 'px',
          left: left + 'px',
          margin: 'unset',
          touchAction: 'none'
        }, isAbsolute && {
          position: 'absolute',
          transform: 'unset',
          width: rectContent.width + 'px',
          height: rectContent.height + 'px'
        }), offset.width && {
          width: offset.width + 'px'
        }), offset.height && {
          height: offset.height + 'px'
        });

        dragResizeStyle.value = _objectSpread2(_objectSpread2({}, dragResizeStyle.value), style);
      };

      var end = function end(e) {
        e.stopPropagation();

        if (state === STATE_RESIZE) {
          resetBodyCursor && resetBodyCursor();
        }

        setTimeout(function () {
          emitState(e, state, 'end');
        });
        removeListener('move', document, moving);
        removeListener('up', document, end);
      };

      addListener('move', document, moving);
      addListener('up', document, end);
    }

    function addDragDown() {
      addListener('down', vfmContent.value, pointerDown);
      dragResizeStyle.value.touchAction = 'none';
    }

    function removeDragDown() {
      removeListener('down', vfmContent.value, pointerDown);
    }

    function addResizeDown() {
      visibility.resize = true;
      nextTick(function () {
        addListener('down', vfmResize.value, pointerDown);
      });
    }

    function removeResizeDown() {
      removeListener('down', vfmResize.value, pointerDown);
      visibility.resize = false;
    }

    function getResizeOffset(direction, offset, rectContainer, rectContent, isAbsolute) {
      var setOffset = function setOffset(dir) {
        var _ref2;

        var offsetAxis = offset[dir.axis];
        offsetAxis = props.fitParent ? clamp(dir.min, offsetAxis, dir.max) : offsetAxis;
        var edge = clamp(dir.minEdge, dir.getEdge(offsetAxis), dir.maxEdge);
        offsetAxis = dir.getOffsetAxis(edge, isAbsolute);
        return _ref2 = {}, _defineProperty(_ref2, dir.edgeName, edge), _defineProperty(_ref2, dir.axis, offsetAxis), _ref2;
      };

      var getDirectionInfo = function getDirectionInfo(position, edgeName, axis, isPositive) {
        var rectContentEdge = rectContent[edgeName];
        var positionOffset = rectContainer[position] - rectContent[position];
        var EdgeName = capitalize(edgeName);
        return {
          axis: axis,
          edgeName: edgeName,
          min: isPositive ? positionOffset : -rectContentEdge,
          max: isPositive ? rectContentEdge : positionOffset,
          minEdge: props["min".concat(EdgeName)],
          maxEdge: props["max".concat(EdgeName)],
          getEdge: function getEdge(offsetAxis) {
            return rectContent[edgeName] - offsetAxis * (isPositive ? 1 : -1);
          },
          getOffsetAxis: function getOffsetAxis(edge, isAbsolute) {
            var offsetAxis = rectContent[edgeName] - edge;

            if (isAbsolute) {
              return isPositive ? offsetAxis : 0;
            } else {
              return (isPositive ? 1 : -1) * offsetAxis / 2;
            }
          }
        };
      };

      var directions = {
        t: ['top', 'height', 'y', true],
        b: ['bottom', 'height', 'y', false],
        l: ['left', 'width', 'x', true],
        r: ['right', 'width', 'x', false]
      };
      var _offset = {
        x: 0,
        y: 0
      };
      direction.split('').forEach(function (dir) {
        var directionInfo = getDirectionInfo.apply(void 0, _toConsumableArray(directions[dir]));
        _offset = _objectSpread2(_objectSpread2({}, _offset), setOffset(directionInfo));
      });
      return _offset;
    }

    return {
      root: root,
      vfmContainer: vfmContainer,
      vfmContent: vfmContent,
      vfmResize: vfmResize,
      vfmOverlayTransition: vfmOverlayTransition,
      vfmTransition: vfmTransition,
      computedOverlayTransition: computedOverlayTransition,
      computedTransition: computedTransition,
      visible: visible,
      visibility: visibility,
      params: params,
      calculateZIndex: calculateZIndex,
      bindStyle: bindStyle,
      bindContentStyle: bindContentStyle,
      beforeOverlayEnter: beforeOverlayEnter,
      afterOverlayEnter: afterOverlayEnter,
      beforeOverlayLeave: beforeOverlayLeave,
      afterOverlayLeave: afterOverlayLeave,
      beforeModalEnter: beforeModalEnter,
      afterModalEnter: afterModalEnter,
      beforeModalLeave: beforeModalLeave,
      afterModalLeave: afterModalLeave,
      onMousedown: onMousedown,
      onMouseupContainer: onMouseupContainer,
      onEsc: onEsc
    };
  }
};

var _withId = withScopeId("data-v-2836fdb5");

pushScopeId("data-v-2836fdb5");

var _hoisted_1$1 = {
  key: 0,
  ref: "vfmResize",
  "class": "vfm__resize vfm--absolute vfm--inset vfm--prevent-none vfm--select-none vfm--touch-none"
};

popScopeId();

var render$1 = _withId(function (_ctx, _cache, $props, $setup, $data, $options) {
  return $props.ssr || $setup.visible ? withDirectives((openBlock(), createBlock("div", {
    key: 0,
    ref: "root",
    style: $setup.bindStyle,
    "class": ["vfm vfm--inset", [$props.attach === false ? 'vfm--fixed' : 'vfm--absolute', {
      'vfm--prevent-none': $props.preventClick
    }]],
    onKeydown: _cache[4] || (_cache[4] = withKeys(function () {
      return $setup.onEsc && $setup.onEsc.apply($setup, arguments);
    }, ["esc"]))
  }, [createVNode(Transition, mergeProps($setup.computedOverlayTransition, {
    onBeforeEnter: $setup.beforeOverlayEnter,
    onAfterEnter: $setup.afterOverlayEnter,
    onBeforeLeave: $setup.beforeOverlayLeave,
    onAfterLeave: $setup.afterOverlayLeave
  }), {
    "default": _withId(function () {
      return [!$props.hideOverlay && $setup.visibility.overlay ? (openBlock(), createBlock("div", {
        key: 0,
        "class": ["vfm__overlay vfm--overlay vfm--absolute vfm--inset", $props.overlayClass],
        style: $props.overlayStyle
      }, null, 6)) : createCommentVNode("v-if", true)];
    }),
    _: 1
  }, 16, ["onBeforeEnter", "onAfterEnter", "onBeforeLeave", "onAfterLeave"]), createVNode(Transition, mergeProps($setup.computedTransition, {
    onBeforeEnter: $setup.beforeModalEnter,
    onAfterEnter: $setup.afterModalEnter,
    onBeforeLeave: $setup.beforeModalLeave,
    onAfterLeave: $setup.afterModalLeave
  }), {
    "default": _withId(function () {
      return [withDirectives(createVNode("div", {
        ref: "vfmContainer",
        "class": ["vfm__container vfm--absolute vfm--inset vfm--outline-none", $props.classes],
        style: $props.styles,
        "aria-expanded": $setup.visibility.modal.toString(),
        role: "dialog",
        "aria-modal": "true",
        tabindex: "-1",
        onMouseup: _cache[2] || (_cache[2] = withModifiers(function () {
          return $setup.onMouseupContainer && $setup.onMouseupContainer.apply($setup, arguments);
        }, ["self"])),
        onMousedown: _cache[3] || (_cache[3] = withModifiers(function () {
          return $setup.onMousedown && $setup.onMousedown.apply($setup, arguments);
        }, ["self"]))
      }, [createVNode("div", {
        ref: "vfmContent",
        "class": ["vfm__content", [$props.contentClass, {
          'vfm--prevent-auto': $props.preventClick
        }]],
        style: $setup.bindContentStyle,
        onMousedown: _cache[1] || (_cache[1] = function ($event) {
          return $setup.onMousedown(null);
        })
      }, [renderSlot(_ctx.$slots, "default", {
        params: $setup.params,
        close: function close() {
          return _ctx.$emit('update:modelValue', false);
        }
      }), $setup.visibility.resize && $setup.visibility.modal ? (openBlock(), createBlock("div", _hoisted_1$1, [(openBlock(true), createBlock(Fragment, null, renderList($props.resizeDirections, function (direction) {
        return openBlock(), createBlock("div", {
          key: direction,
          direction: direction,
          "class": ["vfm--resize-".concat(direction), "vfm--absolute vfm--prevent-auto"]
        }, null, 10, ["direction"]);
      }), 128))], 512)) : createCommentVNode("v-if", true)], 38)], 46, ["aria-expanded"]), [[vShow, $setup.visibility.modal]])];
    }),
    _: 3
  }, 16, ["onBeforeEnter", "onAfterEnter", "onBeforeLeave", "onAfterLeave"])], 38)), [[vShow, !$props.ssr || $setup.visible]]) : createCommentVNode("v-if", true);
});

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "\n.vfm--fixed[data-v-2836fdb5] {\n  position: fixed;\n}\n.vfm--absolute[data-v-2836fdb5] {\n  position: absolute;\n}\n.vfm--inset[data-v-2836fdb5] {\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n.vfm--overlay[data-v-2836fdb5] {\n  background-color: rgba(0, 0, 0, 0.5);\n}\n.vfm--prevent-none[data-v-2836fdb5] {\n  pointer-events: none;\n}\n.vfm--prevent-auto[data-v-2836fdb5] {\n  pointer-events: auto;\n}\n.vfm--outline-none[data-v-2836fdb5]:focus {\n  outline: none;\n}\n.vfm-enter-active[data-v-2836fdb5],\n.vfm-leave-active[data-v-2836fdb5] {\n  transition: opacity 0.2s;\n}\n.vfm-enter-from[data-v-2836fdb5],\n.vfm-leave-to[data-v-2836fdb5] {\n  opacity: 0;\n}\n.vfm--touch-none[data-v-2836fdb5] {\n  touch-action: none;\n}\n.vfm--select-none[data-v-2836fdb5] {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n.vfm--resize-tr[data-v-2836fdb5],\n.vfm--resize-br[data-v-2836fdb5],\n.vfm--resize-bl[data-v-2836fdb5],\n.vfm--resize-tl[data-v-2836fdb5] {\n  width: 12px;\n  height: 12px;\n  z-index: 10;\n}\n.vfm--resize-t[data-v-2836fdb5] {\n  top: -6px;\n  left: 0;\n  width: 100%;\n  height: 12px;\n  cursor: ns-resize;\n}\n.vfm--resize-tr[data-v-2836fdb5] {\n  top: -6px;\n  right: -6px;\n  cursor: nesw-resize;\n}\n.vfm--resize-r[data-v-2836fdb5] {\n  top: 0;\n  right: -6px;\n  width: 12px;\n  height: 100%;\n  cursor: ew-resize;\n}\n.vfm--resize-br[data-v-2836fdb5] {\n  bottom: -6px;\n  right: -6px;\n  cursor: nwse-resize;\n}\n.vfm--resize-b[data-v-2836fdb5] {\n  bottom: -6px;\n  left: 0;\n  width: 100%;\n  height: 12px;\n  cursor: ns-resize;\n}\n.vfm--resize-bl[data-v-2836fdb5] {\n  bottom: -6px;\n  left: -6px;\n  cursor: nesw-resize;\n}\n.vfm--resize-l[data-v-2836fdb5] {\n  top: 0;\n  left: -6px;\n  width: 12px;\n  height: 100%;\n  cursor: ew-resize;\n}\n.vfm--resize-tl[data-v-2836fdb5] {\n  top: -6px;\n  left: -6px;\n  cursor: nwse-resize;\n}\n";
styleInject(css_248z);

script$1.render = render$1;
script$1.__scopeId = "data-v-2836fdb5";
script$1.__file = "lib/VueFinalModal.vue";

var script = {
  props: {},
  methods: {
    slice: function slice(index) {
      this.api.dynamicModals.splice(index, 1);
    },
    beforeOpen: function beforeOpen(e, modal, index) {
      var _this = this;

      return _asyncToGenerator(function* () {
        e.ref.params.value = modal.params;
        yield _this.$nextTick();
        yield _this.$nextTick();

        if (!modal.value) {
          _this.slice(index);

          modal.reject('show');
        }
      })();
    },
    isString: function isString(val) {
      return typeof val === 'string';
    }
  }
};

var _hoisted_1 = {
  "class": "modals-container"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock("div", _hoisted_1, [(openBlock(true), createBlock(Fragment, null, renderList(_ctx.api.dynamicModals, function (modal, index) {
    return openBlock(), createBlock(resolveDynamicComponent(modal.component), mergeProps({
      key: modal.id
    }, modal.bind, {
      modelValue: modal.value,
      "onUpdate:modelValue": function onUpdateModelValue($event) {
        return modal.value = $event;
      }
    }, toHandlers(modal.on), {
      on_closed: function on_closed($event) {
        return $options.slice(index);
      },
      on_beforeOpen: function on_beforeOpen(e) {
        return $options.beforeOpen(e, modal);
      },
      on_opened: modal.opened
    }), createSlots({
      _: 2
    }, [renderList(modal.slots, function (slot, key) {
      return {
        name: key,
        fn: withCtx(function () {
          return [createCommentVNode(" eslint-disable vue/no-v-html "), $options.isString(slot) ? (openBlock(), createBlock("div", {
            key: 0,
            innerHTML: slot
          }, null, 8, ["innerHTML"])) : (openBlock(), createBlock(resolveDynamicComponent(slot.component), mergeProps({
            key: 1
          }, slot.bind, toHandlers(slot.on || {})), null, 16))];
        })
      };
    })]), 1040, ["modelValue", "onUpdate:modelValue", "on_closed", "on_beforeOpen", "on_opened"]);
  }), 128))]);
}

script.render = render;
script.__file = "lib/ModalsContainer.vue";

function defineApi() {
  var _modalComponent = null;
  return {
    show: function show(modal) {
      var _this = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      switch (_typeof(modal)) {
        case 'string':
          return this.toggle.apply(this, [modal, true].concat(args));

        case 'object':
          {
            return Promise.allSettled([new Promise(function (resolve, reject) {
              var defaultModal = {
                value: true,
                id: Symbol('dynamicModal'),
                component: _modalComponent,
                bind: {},
                slots: {},
                on: {},
                params: args[0],
                reject: reject,
                opened: function opened() {
                  resolve('show');
                }
              };

              _this.dynamicModals.push(shallowReactive(Object.assign(defaultModal, modal)));
            })]);
          }
      }
    },
    hide: function hide() {
      for (var _len2 = arguments.length, names = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        names[_key2] = arguments[_key2];
      }

      return this.toggle(names, false);
    },
    hideAll: function hideAll() {
      return this.hide.apply(this, _toConsumableArray(this.openedModals.map(function (modal) {
        return modal.props.name;
      })));
    },
    toggle: function toggle(name) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      var modals = Array.isArray(name) ? this.get.apply(this, _toConsumableArray(name)) : this.get(name);
      return Promise.allSettled(modals.map(function (modal) {
        return modal.toggle.apply(modal, args);
      }));
    },
    get: function get() {
      for (var _len4 = arguments.length, names = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        names[_key4] = arguments[_key4];
      }

      return this.modals.filter(function (modal) {
        return names.includes(modal.props.name);
      });
    },
    dynamicModals: shallowReactive([]),
    openedModals: [],
    modals: [],
    _setDefaultModal: function _setDefaultModal(modalComponent) {
      _modalComponent = modalComponent;
    }
  };
}

function bindApi(component, api) {
  var _component = _objectSpread2(_objectSpread2({}, component), {}, {
    props: _objectSpread2({}, component.props)
  });

  Object.assign(_component.props, {
    api: {
      type: Object,
      "default": function _default() {
        return api;
      }
    }
  });
  return _component;
}

function defineModal(api) {
  var modalComponent = bindApi(script$1, api);

  api._setDefaultModal(modalComponent);

  return modalComponent;
}
function defineContainer(api) {
  return bindApi(script, api);
}

var _count = 0;
var _key = '$vfm';
var _componentName = 'VueFinalModal';
var _dynamicContainerName = 'ModalsContainer';
var defineVfm = function defineVfm() {
  var _ref;

  var api = defineApi();
  return _ref = {}, _defineProperty(_ref, _key, api), _defineProperty(_ref, _componentName, defineModal(api)), _defineProperty(_ref, _dynamicContainerName, defineContainer(api)), _ref;
};

var _vfm = defineVfm();

var $vfm = _vfm.$vfm,
    VueFinalModal = _vfm.VueFinalModal,
    ModalsContainer = _vfm.ModalsContainer;

var installVfm = function installVfm(App) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref2 = _count === 0 ? _vfm : defineVfm(),
      $vfm = _ref2.$vfm,
      VueFinalModal = _ref2.VueFinalModal,
      ModalsContainer = _ref2.ModalsContainer;

  _count += 1;
  var key = options.key || _key;
  var componentName = options.componentName || _componentName;
  var dynamicContainerName = options.dynamicContainerName || _dynamicContainerName;
  Object.defineProperty(App.config.globalProperties, key, {
    get: function get() {
      return $vfm;
    }
  });
  App.provide(key, $vfm);
  App.component(componentName, VueFinalModal);
  App.component(dynamicContainerName, ModalsContainer);
};

var vfmPlugin = function vfmPlugin(pluginOptions) {
  return {
    install: function install(App, options) {
      var _options = Object.assign({}, pluginOptions, options);

      installVfm(App, _options);
    }
  };
};
vfmPlugin.install = installVfm;

export default vfmPlugin;
export { $vfm, ModalsContainer, VueFinalModal, defineVfm, vfmPlugin };
//# sourceMappingURL=VueFinalModal.esm.js.map
