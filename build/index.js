'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCLILogger;
var colors = require("colors/safe");

// gets top level keys and prints them in format
var topLevel = function topLevel(obj, rightArrow) {
  var formatted = '';
  Object.keys(obj).forEach(function (key) {
    if (key.length > 0) {
      formatted += rightArrow + ' ' + key + ' ';
    }
    if (obj.hasOwnProperty(key)) {
      formatted += JSON.stringify(obj[key]) + '\n';
    }
  });

  return formatted;
};

var renderToConsole = function renderToConsole(obj, rightArrow) {
  try {
    return topLevel(obj, rightArrow);
  } catch (e) {
    return obj;
  }
};

function createCLILogger(options) {
  var _options$downArrow = options.downArrow;
  var downArrow = _options$downArrow === undefined ? '▼' : _options$downArrow;
  var _options$rightArrow = options.rightArrow;
  var rightArrow = _options$rightArrow === undefined ? '▶' : _options$rightArrow;
  var _options$messageColor = options.messageColor;
  var messageColor = _options$messageColor === undefined ? 'yellow' : _options$messageColor;
  var _options$prevColor = options.prevColor;
  var prevColor = _options$prevColor === undefined ? 'grey' : _options$prevColor;
  var _options$actionColor = options.actionColor;
  var actionColor = _options$actionColor === undefined ? 'blue' : _options$actionColor;
  var _options$nextColor = options.nextColor;
  var nextColor = _options$nextColor === undefined ? 'green' : _options$nextColor;
  var _options$predicate = options.predicate;
  var predicate = _options$predicate === undefined ? null : _options$predicate;
  var _options$stateTransfo = options.stateTransformer;
  var stateTransformer = _options$stateTransfo === undefined ? function (x) {
    return x;
  } : _options$stateTransfo;
  var _options$actionTransf = options.actionTransformer;
  var actionTransformer = _options$actionTransf === undefined ? function (x) {
    return x;
  } : _options$actionTransf;


  return function (store) {
    return function (next) {
      return function (action) {
        var getState = store.getState;


        if (predicate && !predicate(getState, action)) {
          return next(action);
        }

        if (typeof console === 'undefined') {
          return next(action);
        }

        var prevState = renderToConsole(stateTransformer(getState()), rightArrow);
        var actionDisplay = renderToConsole(actionTransformer(action), rightArrow);
        var returnValue = next(action);
        var nextState = renderToConsole(stateTransformer(getState()), rightArrow);
        var time = new Date();

        var message = downArrow + ' action ' + action.type + ' @ ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();

        var output = colors[messageColor](message) + '\n' + ('  ' + colors[prevColor]('prev state\n' + prevState)) + ('  ' + colors[actionColor]('action\n' + actionDisplay)) + ('  ' + colors[nextColor]('next\n' + nextState));

        console.log(output);
        return returnValue;
      };
    };
  };
}