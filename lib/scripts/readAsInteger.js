function readAsInteger(value) {
  if (value === null || value === undefined) {
    return 0;
  } else {
    return parseInt(value, 10) || 0;
  }
}

module.exports = readAsInteger;
