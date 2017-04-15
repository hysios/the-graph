var clipboardContent = {};

var cloneObject = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};

var makeNewId = function (label) {
  var num = 60466176; // 36^5
  num = Math.floor(Math.random() * num);
  var id = label + '_' + num.toString(36);
  return id;
};

module.exports = {
  clipboardContent,
  cloneObject,
  makeNewId
}