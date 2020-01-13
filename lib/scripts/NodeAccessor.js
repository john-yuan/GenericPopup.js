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
