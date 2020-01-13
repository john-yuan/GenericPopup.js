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
