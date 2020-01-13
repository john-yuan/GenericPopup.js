var merge = require('x-common-utils/merge');
var findChildElement = require('./findChildElement');
var getWindowHeight = require('./getWindowHeight');
var readAsInteger = require('./readAsInteger');
var NodeAccessor = require('./NodeAccessor');
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
