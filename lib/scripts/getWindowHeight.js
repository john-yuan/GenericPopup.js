function getWindowHeight() {
  if (window.innerHeight) {
    return window.innerHeight;
  } else {
    return document.documentElement.clientHeight;
  }
}

module.exports = getWindowHeight;
