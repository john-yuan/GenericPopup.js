(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.GenericPopup = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var merge = require(8);
var findChildElement = require(3);
var getWindowHeight = require(4);
var readAsInteger = require(5);
var NodeAccessor = require(2);
var PREFIX = 'generic-popup__';

/**
 * @typedef {Object.<string, *>} GenericPopupOptions
 * @property {Element} rootNode The root node of the popup.
 * @property {number} [width] The width of the dialog.
 * @property {number} [contentMinHeight=100] The min height of the content.
 * Only works when the content height greater than the `contentMinHeight`.
 * This option will override `dialogMaxHeight`.
 * @property {number} [dialogMaxHeight] The max height of the entire dialog
 * window. If it is not set or has the value of 0, the value will be the
 * available height of the current viewport. This value may be override by
 * `contentMinHeight`.
 * @property {number} [minPaddingSize=16] The min padding (top and bottom)
 * size of the dialog.
 */

/**
 * @class
 * @param {GenericPopupOptions} options The popup options.
 */
function GenericPopup(options) {
  this.options = merge({
    rootNode: null,
    width: 0,
    contentMinHeight: 100,
    dialogMaxHeight: 0,
    minPaddingSize: 16
  }, options);
}

GenericPopup.prototype.getElement = function (role) {
  return findChildElement(this.options.rootNode, PREFIX + role);
};

GenericPopup.prototype.show = function () {
  this.options.rootNode.style.display = 'block';
  this.refresh();
};

GenericPopup.prototype.hide = function () {
  this.options.rootNode.style.display = 'none';
};

GenericPopup.prototype.refresh = function () {
  var options = this.options;
  var width = readAsInteger(options.width);
  var contentMinHeight = readAsInteger(options.contentMinHeight);
  var dialogMaxHeight = readAsInteger(options.dialogMaxHeight);
  var minPaddingSize = readAsInteger(options.minPaddingSize);
  var wrapper = new NodeAccessor(this.getElement('wrapper'));
  var dialog = new NodeAccessor(this.getElement('dialog'));
  var header = new NodeAccessor(this.getElement('header'));
  var content = new NodeAccessor(this.getElement('content'));
  var footer = new NodeAccessor(this.getElement('footer'));

  dialog.setStyle('width', width > 0 ? (width + 'px') : '');
  wrapper.setStyle('padding-top', '');
  wrapper.setStyle('padding-bottom', '');
  content.setStyle('height', '');

  var windowHeight = getWindowHeight();
  var headerHeight = header.offsetHeight();
  var contentHeight = content.offsetHeight();
  var footerHeight = footer.offsetHeight();
  var availableHeight = windowHeight - 2 * minPaddingSize;
  var finalDialogHeight = 0;

  if (dialogMaxHeight && availableHeight > dialogMaxHeight) {
    finalDialogHeight = dialogMaxHeight;
  } else {
    finalDialogHeight = availableHeight;
  }

  var availableContentHeight = finalDialogHeight - headerHeight - footerHeight;

  if (contentHeight < availableContentHeight) {
    finalDialogHeight = headerHeight + contentHeight + footerHeight;
  } else if (availableContentHeight < contentMinHeight) {
    if (contentHeight <= contentMinHeight) {
      finalDialogHeight = headerHeight + contentHeight + footerHeight;
    } else {
      finalDialogHeight = headerHeight + contentMinHeight + footerHeight;
    }
  }

  var padding = (windowHeight - finalDialogHeight) / 2;
  var finlaContentheight = finalDialogHeight - headerHeight - footerHeight;

  if (padding < minPaddingSize) {
    padding = minPaddingSize;
  }

  content.setStyle('height', finlaContentheight + 'px');
  wrapper.setStyle('padding-top', padding + 'px');
  wrapper.setStyle('padding-bottom', padding + 'px');
};

exports.GenericPopup = GenericPopup;

},{"2":2,"3":3,"4":4,"5":5,"8":8}],2:[function(require,module,exports){
/**
 * @class
 * @param {Element} node The node to operate on.
 */
function NodeAccessor(node) {
  this.node = node;
}

/**
 * @param {string} name
 * @param {string} value
 * @returns {void}
 */
NodeAccessor.prototype.setStyle = function (name, value) {
  if (this.node) {
    this.node.style[name] = value;
  }
};

/**
 * @returns {number}
 */
NodeAccessor.prototype.offsetHeight = function () {
  return this.node ? this.node.offsetHeight : 0;
};

module.exports = NodeAccessor;

},{}],3:[function(require,module,exports){
var supportGetElementByClassName = !!document.getElementsByClassName;
var jQueryAvailable = typeof $ === 'function' ? (!!$.extend) : false;

function findChildElement(parentNode, className) {
  var child;

  if (parentNode) {
    if (supportGetElementByClassName) {
      child = parentNode.getElementsByClassName(className);
      child = child ? child[0] : null;
    } else if (jQueryAvailable) {
      child = $(parentNode).find('.' + className).get(0);
    } else {
      throw new Error('findChildElement unsupported');
    }
  }

  return child || null;
}

module.exports = findChildElement;

},{}],4:[function(require,module,exports){
function getWindowHeight() {
  if (window.innerHeight) {
    return window.innerHeight;
  } else {
    return document.documentElement.clientHeight;
  }
}

module.exports = getWindowHeight;

},{}],5:[function(require,module,exports){
function readAsInteger(value) {
  if (value === null || value === undefined) {
    return 0;
  } else {
    return parseInt(value, 10) || 0;
  }
}

module.exports = readAsInteger;

},{}],6:[function(require,module,exports){
var toString = Object.prototype.toString;

/**
 * Check whether the variable is an instance of `Array`
 *
 * @param {any} it The variable to check
 * @returns {boolean} Returns `true` if the variable is an instance of `Array`, otherwise `false` is returned
 */
function isArray(it) {
    return toString.call(it) === '[object Array]';
}

module.exports = isArray;

},{}],7:[function(require,module,exports){
var toString = Object.prototype.toString;
var getPrototypeOf = Object.getPrototypeOf;

if (!getPrototypeOf) {
    getPrototypeOf = function (object) {
        return object.__proto__;
    };
}

/**
 * Check whether the variable is a plain object.
 *
 * @param {any} it The variable to check
 * @returns {boolean} Returns `true` if the variable is a plain object, otherwise `false` is returned
 */
function isPlainObject(it) {
    var proto;

    if (toString.call(it) !== '[object Object]') {
        return false;
    }

    proto = getPrototypeOf(it);

    // Object.create(null)
    if (!proto) {
        return true;
    }

    if (proto !== getPrototypeOf({})) {
        return false;
    }

    return true;
}

module.exports = isPlainObject;

},{}],8:[function(require,module,exports){
var isArray = require(6);
var isPlainObject = require(7);
var hasOwn = Object.prototype.hasOwnProperty;
var slice = Array.prototype.slice;

/**
 * Copy the non-undefined values of source to target. Overwrite the original values.
 * This function will modify the target
 *
 * @param {Object.<string, *>|any[]} target The target object or array
 * @param {Object.<string, *>|any[]} source The source object or array
 * @returns {Object.<string, *>|any[]} Returns the extended target object or array
 */
function extend(target, source) {
    var key, val;

    if ( target && ( isArray(source) || isPlainObject(source) ) ) {
        for ( key in source ) {
            if ( hasOwn.call(source, key) ) {
                val = source[key];
                if (val !== undefined) {
                    if ( isPlainObject(val) ) {
                        if ( ! isPlainObject(target[key]) ) {
                            target[key] = {};
                        }
                        merge(target[key], val);
                    } else if ( isArray(val) ) {
                        if ( ! isArray(target[key]) ) {
                            target[key] = [];
                        }
                        merge(target[key], val);
                    } else {
                        target[key] = val;
                    }
                }
            }
        }
    }

    return target;
}

/**
 * Copy any non-undefined values of source to target and overwrites the corresponding original values. This function
 * will modify the target object.
 *
 * @param {Object} target The target object
 * @param {...Object} args The source object
 * @returns {Object} Returns the modified target object
 */
function merge(target, args) {
    var i = 0;
    var l = arguments.length - 1;

    args = slice.call(arguments, 1);

    for (i = 0; i < l; i += 1) {
        extend(target, args[i]);
    }

    return target;
}

module.exports = merge;

},{"6":6,"7":7}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvc2NyaXB0cy9HZW5lcmljUG9wdXAuanMiLCJsaWIvc2NyaXB0cy9Ob2RlQWNjZXNzb3IuanMiLCJsaWIvc2NyaXB0cy9maW5kQ2hpbGRFbGVtZW50LmpzIiwibGliL3NjcmlwdHMvZ2V0V2luZG93SGVpZ2h0LmpzIiwibGliL3NjcmlwdHMvcmVhZEFzSW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy94LWNvbW1vbi11dGlscy9pc0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL3gtY29tbW9uLXV0aWxzL2lzUGxhaW5PYmplY3QuanMiLCJub2RlX21vZHVsZXMveC1jb21tb24tdXRpbHMvbWVyZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwidmFyIG1lcmdlID0gcmVxdWlyZSg4KTtcbnZhciBmaW5kQ2hpbGRFbGVtZW50ID0gcmVxdWlyZSgzKTtcbnZhciBnZXRXaW5kb3dIZWlnaHQgPSByZXF1aXJlKDQpO1xudmFyIHJlYWRBc0ludGVnZXIgPSByZXF1aXJlKDUpO1xudmFyIE5vZGVBY2Nlc3NvciA9IHJlcXVpcmUoMik7XG52YXIgUFJFRklYID0gJ2dlbmVyaWMtcG9wdXBfXyc7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdC48c3RyaW5nLCAqPn0gR2VuZXJpY1BvcHVwT3B0aW9uc1xuICogQHByb3BlcnR5IHtFbGVtZW50fSByb290Tm9kZSBUaGUgcm9vdCBub2RlIG9mIHRoZSBwb3B1cC5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbd2lkdGhdIFRoZSB3aWR0aCBvZiB0aGUgZGlhbG9nLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFtjb250ZW50TWluSGVpZ2h0PTEwMF0gVGhlIG1pbiBoZWlnaHQgb2YgdGhlIGNvbnRlbnQuXG4gKiBPbmx5IHdvcmtzIHdoZW4gdGhlIGNvbnRlbnQgaGVpZ2h0IGdyZWF0ZXIgdGhhbiB0aGUgYGNvbnRlbnRNaW5IZWlnaHRgLlxuICogVGhpcyBvcHRpb24gd2lsbCBvdmVycmlkZSBgZGlhbG9nTWF4SGVpZ2h0YC5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBbZGlhbG9nTWF4SGVpZ2h0XSBUaGUgbWF4IGhlaWdodCBvZiB0aGUgZW50aXJlIGRpYWxvZ1xuICogd2luZG93LiBJZiBpdCBpcyBub3Qgc2V0IG9yIGhhcyB0aGUgdmFsdWUgb2YgMCwgdGhlIHZhbHVlIHdpbGwgYmUgdGhlXG4gKiBhdmFpbGFibGUgaGVpZ2h0IG9mIHRoZSBjdXJyZW50IHZpZXdwb3J0LiBUaGlzIHZhbHVlIG1heSBiZSBvdmVycmlkZSBieVxuICogYGNvbnRlbnRNaW5IZWlnaHRgLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IFttaW5QYWRkaW5nU2l6ZT0xNl0gVGhlIG1pbiBwYWRkaW5nICh0b3AgYW5kIGJvdHRvbSlcbiAqIHNpemUgb2YgdGhlIGRpYWxvZy5cbiAqL1xuXG4vKipcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtHZW5lcmljUG9wdXBPcHRpb25zfSBvcHRpb25zIFRoZSBwb3B1cCBvcHRpb25zLlxuICovXG5mdW5jdGlvbiBHZW5lcmljUG9wdXAob3B0aW9ucykge1xuICB0aGlzLm9wdGlvbnMgPSBtZXJnZSh7XG4gICAgcm9vdE5vZGU6IG51bGwsXG4gICAgd2lkdGg6IDAsXG4gICAgY29udGVudE1pbkhlaWdodDogMTAwLFxuICAgIGRpYWxvZ01heEhlaWdodDogMCxcbiAgICBtaW5QYWRkaW5nU2l6ZTogMTZcbiAgfSwgb3B0aW9ucyk7XG59XG5cbkdlbmVyaWNQb3B1cC5wcm90b3R5cGUuZ2V0RWxlbWVudCA9IGZ1bmN0aW9uIChyb2xlKSB7XG4gIHJldHVybiBmaW5kQ2hpbGRFbGVtZW50KHRoaXMub3B0aW9ucy5yb290Tm9kZSwgUFJFRklYICsgcm9sZSk7XG59O1xuXG5HZW5lcmljUG9wdXAucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMub3B0aW9ucy5yb290Tm9kZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgdGhpcy5yZWZyZXNoKCk7XG59O1xuXG5HZW5lcmljUG9wdXAucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMub3B0aW9ucy5yb290Tm9kZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xufTtcblxuR2VuZXJpY1BvcHVwLnByb3RvdHlwZS5yZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgdmFyIHdpZHRoID0gcmVhZEFzSW50ZWdlcihvcHRpb25zLndpZHRoKTtcbiAgdmFyIGNvbnRlbnRNaW5IZWlnaHQgPSByZWFkQXNJbnRlZ2VyKG9wdGlvbnMuY29udGVudE1pbkhlaWdodCk7XG4gIHZhciBkaWFsb2dNYXhIZWlnaHQgPSByZWFkQXNJbnRlZ2VyKG9wdGlvbnMuZGlhbG9nTWF4SGVpZ2h0KTtcbiAgdmFyIG1pblBhZGRpbmdTaXplID0gcmVhZEFzSW50ZWdlcihvcHRpb25zLm1pblBhZGRpbmdTaXplKTtcbiAgdmFyIHdyYXBwZXIgPSBuZXcgTm9kZUFjY2Vzc29yKHRoaXMuZ2V0RWxlbWVudCgnd3JhcHBlcicpKTtcbiAgdmFyIGRpYWxvZyA9IG5ldyBOb2RlQWNjZXNzb3IodGhpcy5nZXRFbGVtZW50KCdkaWFsb2cnKSk7XG4gIHZhciBoZWFkZXIgPSBuZXcgTm9kZUFjY2Vzc29yKHRoaXMuZ2V0RWxlbWVudCgnaGVhZGVyJykpO1xuICB2YXIgY29udGVudCA9IG5ldyBOb2RlQWNjZXNzb3IodGhpcy5nZXRFbGVtZW50KCdjb250ZW50JykpO1xuICB2YXIgZm9vdGVyID0gbmV3IE5vZGVBY2Nlc3Nvcih0aGlzLmdldEVsZW1lbnQoJ2Zvb3RlcicpKTtcblxuICBkaWFsb2cuc2V0U3R5bGUoJ3dpZHRoJywgd2lkdGggPiAwID8gKHdpZHRoICsgJ3B4JykgOiAnJyk7XG4gIHdyYXBwZXIuc2V0U3R5bGUoJ3BhZGRpbmctdG9wJywgJycpO1xuICB3cmFwcGVyLnNldFN0eWxlKCdwYWRkaW5nLWJvdHRvbScsICcnKTtcbiAgY29udGVudC5zZXRTdHlsZSgnaGVpZ2h0JywgJycpO1xuXG4gIHZhciB3aW5kb3dIZWlnaHQgPSBnZXRXaW5kb3dIZWlnaHQoKTtcbiAgdmFyIGhlYWRlckhlaWdodCA9IGhlYWRlci5vZmZzZXRIZWlnaHQoKTtcbiAgdmFyIGNvbnRlbnRIZWlnaHQgPSBjb250ZW50Lm9mZnNldEhlaWdodCgpO1xuICB2YXIgZm9vdGVySGVpZ2h0ID0gZm9vdGVyLm9mZnNldEhlaWdodCgpO1xuICB2YXIgYXZhaWxhYmxlSGVpZ2h0ID0gd2luZG93SGVpZ2h0IC0gMiAqIG1pblBhZGRpbmdTaXplO1xuICB2YXIgZmluYWxEaWFsb2dIZWlnaHQgPSAwO1xuXG4gIGlmIChkaWFsb2dNYXhIZWlnaHQgJiYgYXZhaWxhYmxlSGVpZ2h0ID4gZGlhbG9nTWF4SGVpZ2h0KSB7XG4gICAgZmluYWxEaWFsb2dIZWlnaHQgPSBkaWFsb2dNYXhIZWlnaHQ7XG4gIH0gZWxzZSB7XG4gICAgZmluYWxEaWFsb2dIZWlnaHQgPSBhdmFpbGFibGVIZWlnaHQ7XG4gIH1cblxuICB2YXIgYXZhaWxhYmxlQ29udGVudEhlaWdodCA9IGZpbmFsRGlhbG9nSGVpZ2h0IC0gaGVhZGVySGVpZ2h0IC0gZm9vdGVySGVpZ2h0O1xuXG4gIGlmIChjb250ZW50SGVpZ2h0IDwgYXZhaWxhYmxlQ29udGVudEhlaWdodCkge1xuICAgIGZpbmFsRGlhbG9nSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgY29udGVudEhlaWdodCArIGZvb3RlckhlaWdodDtcbiAgfSBlbHNlIGlmIChhdmFpbGFibGVDb250ZW50SGVpZ2h0IDwgY29udGVudE1pbkhlaWdodCkge1xuICAgIGlmIChjb250ZW50SGVpZ2h0IDw9IGNvbnRlbnRNaW5IZWlnaHQpIHtcbiAgICAgIGZpbmFsRGlhbG9nSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgY29udGVudEhlaWdodCArIGZvb3RlckhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgZmluYWxEaWFsb2dIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBjb250ZW50TWluSGVpZ2h0ICsgZm9vdGVySGVpZ2h0O1xuICAgIH1cbiAgfVxuXG4gIHZhciBwYWRkaW5nID0gKHdpbmRvd0hlaWdodCAtIGZpbmFsRGlhbG9nSGVpZ2h0KSAvIDI7XG4gIHZhciBmaW5sYUNvbnRlbnRoZWlnaHQgPSBmaW5hbERpYWxvZ0hlaWdodCAtIGhlYWRlckhlaWdodCAtIGZvb3RlckhlaWdodDtcblxuICBpZiAocGFkZGluZyA8IG1pblBhZGRpbmdTaXplKSB7XG4gICAgcGFkZGluZyA9IG1pblBhZGRpbmdTaXplO1xuICB9XG5cbiAgY29udGVudC5zZXRTdHlsZSgnaGVpZ2h0JywgZmlubGFDb250ZW50aGVpZ2h0ICsgJ3B4Jyk7XG4gIHdyYXBwZXIuc2V0U3R5bGUoJ3BhZGRpbmctdG9wJywgcGFkZGluZyArICdweCcpO1xuICB3cmFwcGVyLnNldFN0eWxlKCdwYWRkaW5nLWJvdHRvbScsIHBhZGRpbmcgKyAncHgnKTtcbn07XG5cbmV4cG9ydHMuR2VuZXJpY1BvcHVwID0gR2VuZXJpY1BvcHVwO1xuIiwiLyoqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZSBUaGUgbm9kZSB0byBvcGVyYXRlIG9uLlxuICovXG5mdW5jdGlvbiBOb2RlQWNjZXNzb3Iobm9kZSkge1xuICB0aGlzLm5vZGUgPSBub2RlO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ob2RlQWNjZXNzb3IucHJvdG90eXBlLnNldFN0eWxlID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gIGlmICh0aGlzLm5vZGUpIHtcbiAgICB0aGlzLm5vZGUuc3R5bGVbbmFtZV0gPSB2YWx1ZTtcbiAgfVxufTtcblxuLyoqXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5Ob2RlQWNjZXNzb3IucHJvdG90eXBlLm9mZnNldEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMubm9kZSA/IHRoaXMubm9kZS5vZmZzZXRIZWlnaHQgOiAwO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOb2RlQWNjZXNzb3I7XG4iLCJ2YXIgc3VwcG9ydEdldEVsZW1lbnRCeUNsYXNzTmFtZSA9ICEhZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZTtcbnZhciBqUXVlcnlBdmFpbGFibGUgPSB0eXBlb2YgJCA9PT0gJ2Z1bmN0aW9uJyA/ICghISQuZXh0ZW5kKSA6IGZhbHNlO1xuXG5mdW5jdGlvbiBmaW5kQ2hpbGRFbGVtZW50KHBhcmVudE5vZGUsIGNsYXNzTmFtZSkge1xuICB2YXIgY2hpbGQ7XG5cbiAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICBpZiAoc3VwcG9ydEdldEVsZW1lbnRCeUNsYXNzTmFtZSkge1xuICAgICAgY2hpbGQgPSBwYXJlbnROb2RlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKTtcbiAgICAgIGNoaWxkID0gY2hpbGQgPyBjaGlsZFswXSA6IG51bGw7XG4gICAgfSBlbHNlIGlmIChqUXVlcnlBdmFpbGFibGUpIHtcbiAgICAgIGNoaWxkID0gJChwYXJlbnROb2RlKS5maW5kKCcuJyArIGNsYXNzTmFtZSkuZ2V0KDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZpbmRDaGlsZEVsZW1lbnQgdW5zdXBwb3J0ZWQnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2hpbGQgfHwgbnVsbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kQ2hpbGRFbGVtZW50O1xuIiwiZnVuY3Rpb24gZ2V0V2luZG93SGVpZ2h0KCkge1xuICBpZiAod2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFdpbmRvd0hlaWdodDtcbiIsImZ1bmN0aW9uIHJlYWRBc0ludGVnZXIodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gMDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUsIDEwKSB8fCAwO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVhZEFzSW50ZWdlcjtcbiIsInZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgdmFyaWFibGUgaXMgYW4gaW5zdGFuY2Ugb2YgYEFycmF5YFxuICpcbiAqIEBwYXJhbSB7YW55fSBpdCBUaGUgdmFyaWFibGUgdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFyaWFibGUgaXMgYW4gaW5zdGFuY2Ugb2YgYEFycmF5YCwgb3RoZXJ3aXNlIGBmYWxzZWAgaXMgcmV0dXJuZWRcbiAqL1xuZnVuY3Rpb24gaXNBcnJheShpdCkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuIiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBnZXRQcm90b3R5cGVPZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcblxuaWYgKCFnZXRQcm90b3R5cGVPZikge1xuICAgIGdldFByb3RvdHlwZU9mID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0Ll9fcHJvdG9fXztcbiAgICB9O1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgdGhlIHZhcmlhYmxlIGlzIGEgcGxhaW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7YW55fSBpdCBUaGUgdmFyaWFibGUgdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFyaWFibGUgaXMgYSBwbGFpbiBvYmplY3QsIG90aGVyd2lzZSBgZmFsc2VgIGlzIHJldHVybmVkXG4gKi9cbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QoaXQpIHtcbiAgICB2YXIgcHJvdG87XG5cbiAgICBpZiAodG9TdHJpbmcuY2FsbChpdCkgIT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwcm90byA9IGdldFByb3RvdHlwZU9mKGl0KTtcblxuICAgIC8vIE9iamVjdC5jcmVhdGUobnVsbClcbiAgICBpZiAoIXByb3RvKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChwcm90byAhPT0gZ2V0UHJvdG90eXBlT2Yoe30pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1BsYWluT2JqZWN0O1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKDYpO1xudmFyIGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKDcpO1xudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbi8qKlxuICogQ29weSB0aGUgbm9uLXVuZGVmaW5lZCB2YWx1ZXMgb2Ygc291cmNlIHRvIHRhcmdldC4gT3ZlcndyaXRlIHRoZSBvcmlnaW5hbCB2YWx1ZXMuXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgbW9kaWZ5IHRoZSB0YXJnZXRcbiAqXG4gKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCAqPnxhbnlbXX0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IG9yIGFycmF5XG4gKiBAcGFyYW0ge09iamVjdC48c3RyaW5nLCAqPnxhbnlbXX0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0IG9yIGFycmF5XG4gKiBAcmV0dXJucyB7T2JqZWN0LjxzdHJpbmcsICo+fGFueVtdfSBSZXR1cm5zIHRoZSBleHRlbmRlZCB0YXJnZXQgb2JqZWN0IG9yIGFycmF5XG4gKi9cbmZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQsIHNvdXJjZSkge1xuICAgIHZhciBrZXksIHZhbDtcblxuICAgIGlmICggdGFyZ2V0ICYmICggaXNBcnJheShzb3VyY2UpIHx8IGlzUGxhaW5PYmplY3Qoc291cmNlKSApICkge1xuICAgICAgICBmb3IgKCBrZXkgaW4gc291cmNlICkge1xuICAgICAgICAgICAgaWYgKCBoYXNPd24uY2FsbChzb3VyY2UsIGtleSkgKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gc291cmNlW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICggaXNQbGFpbk9iamVjdCh2YWwpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhIGlzUGxhaW5PYmplY3QodGFyZ2V0W2tleV0pICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXJnZSh0YXJnZXRba2V5XSwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggaXNBcnJheSh2YWwpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhIGlzQXJyYXkodGFyZ2V0W2tleV0pICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXJnZSh0YXJnZXRba2V5XSwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhcmdldDtcbn1cblxuLyoqXG4gKiBDb3B5IGFueSBub24tdW5kZWZpbmVkIHZhbHVlcyBvZiBzb3VyY2UgdG8gdGFyZ2V0IGFuZCBvdmVyd3JpdGVzIHRoZSBjb3JyZXNwb25kaW5nIG9yaWdpbmFsIHZhbHVlcy4gVGhpcyBmdW5jdGlvblxuICogd2lsbCBtb2RpZnkgdGhlIHRhcmdldCBvYmplY3QuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdFxuICogQHBhcmFtIHsuLi5PYmplY3R9IGFyZ3MgVGhlIHNvdXJjZSBvYmplY3RcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1vZGlmaWVkIHRhcmdldCBvYmplY3RcbiAqL1xuZnVuY3Rpb24gbWVyZ2UodGFyZ2V0LCBhcmdzKSB7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG5cbiAgICBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkgKz0gMSkge1xuICAgICAgICBleHRlbmQodGFyZ2V0LCBhcmdzW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lcmdlO1xuIl19
