/**
 * Created by mpricope on 05.09.14.
 */

module.exports.register = function (context) {

  var TheGraph = context.TheGraph;

  TheGraph.Clipboard = {};

  TheGraph.Clipboard.copy = require('./clipboard/copy')

  TheGraph.Clipboard.paste = require('./clipboard/paste')

};