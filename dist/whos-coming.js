/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(6);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _RowSorter = __webpack_require__(2);

var _RowSorter2 = _interopRequireDefault(_RowSorter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.addEventListener('load', function () {
  var container = document.querySelector('[data-whos-coming]');
  if (container) {
    var sorter = new _RowSorter2.default(container);

    if (sorter.shouldStart()) {
      sorter.start();
    }
  }
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debounce = __webpack_require__(3);

var _debounce2 = _interopRequireDefault(_debounce);

var _upArrow = __webpack_require__(4);

var _downArrow = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RowSorter = function () {

  /**
   * Initiate and swallow errors.
   *
   * @param {HTMLElement} container The root.
   */


  /**
   * Gathers data attributes from inside a row.
   *
   * @param {HTMLElement} element An HTML element.
   * @return {object} An object containing the data attribute values as keys
   *                  and innerHTML as values.
   */
  function RowSorter(container) {
    var _this = this;

    _classCallCheck(this, RowSorter);

    this.addColumnClickListener = this.addColumnClickListener.bind(this);
    this.columnUSort = this.columnUSort.bind(this);
    this.search = (0, _debounce2.default)(this.search.bind(this), 100);

    this.shouldStart = function () {
      return _this.keyRow && _this.rows && _this.columns;
    };

    this.container = container;
    this.setUp();
    this.rows = RowSorter.makeRows();
    this.originalRows = this.rows.map(function (item) {
      return Object.assign({}, item);
    });
  }

  /**
   * Assembles an array of objects with data for all the rows.
   *
   * @return {array} The objects containing the elements and the data.
   */


  _createClass(RowSorter, [{
    key: 'setUp',
    value: function setUp() {
      try {
        this.keyRow = this.container.querySelector('.whos-coming__row--key');
        this.columns = [].concat(_toConsumableArray(this.keyRow.querySelectorAll('[data-whos-coming-column]')));
        this.sortDirection = 'desc'; // Will be flipped on the initialization run.
        this.sortColumn = this.columns[0].getAttribute('data-whos-coming-column');
      } catch (e) {
        // Do nothing.
      }
    }

    /**
     * Whether to continue after the constructor.
     */

  }, {
    key: 'start',
    value: function start() {
      this.columns.forEach(this.addColumnClickListener);
      this.sortByColumn(this.columns[0]);

      this.searchInput = document.querySelector('[data-whos-coming-search]');
      if (this.searchInput) {
        this.startSearch();
      }
    }
  }, {
    key: 'startSearch',
    value: function startSearch() {
      var _this2 = this;

      this.searchField = this.searchInput.getAttribute('data-whos-coming-search');
      this.searchInput.addEventListener('keyup', this.search);
      this.searchInput.addEventListener('search', function (event) {
        if (!event.target.value.trim()) {
          _this2.resetSearch();
          return;
        }
      });
    }
  }, {
    key: 'matchesSearch',
    value: function matchesSearch(searchWords, textWords) {
      for (var i = 0; i < searchWords.length; i += 1) {
        for (var j = 0; j < textWords.length; j += 1) {
          if (searchWords[i].indexOf(textWords[j]) !== -1) {
            return true;
          }

          if (textWords[j].indexOf(searchWords[i]) !== -1) {
            return true;
          }
        }
      }

      return false;
    }
  }, {
    key: 'resetSearch',
    value: function resetSearch(event) {
      this.setUp();
      this.sortByColumn(this.columns[0]);
    }
  }, {
    key: 'search',
    value: function search(event) {
      var _this3 = this;

      if (!event.target.value.trim()) {
        this.resetSearch();
        return;
      }

      var words = event.target.value.toLowerCase().split(' ');

      this.rerender(this.rows.filter(function (row) {
        return _this3.matchesSearch(words, row.data[_this3.searchField].toLowerCase().split(' '));
      }));
    }
  }, {
    key: 'addColumnClickListener',
    value: function addColumnClickListener(column) {
      var _this4 = this;

      column.addEventListener('click', function () {
        return _this4.sortByColumn(column);
      });
    }
  }, {
    key: 'rerender',
    value: function rerender(rows) {
      var _container;

      this.container.innerHTML = '';
      (_container = this.container).append.apply(_container, _toConsumableArray([this.keyRow].concat(rows.map(function (row) {
        return row.element;
      }))));
    }
  }, {
    key: 'clearDirectionalArrows',
    value: function clearDirectionalArrows() {
      this.columns.forEach(function (column) {
        var arrow = column.querySelector('.whos-coming__arrow');
        if (arrow) {
          column.removeChild(arrow);
        }
      });
    }
  }, {
    key: 'addDirectionalArrow',
    value: function addDirectionalArrow(column) {
      var arrowContainer = document.createElement('SPAN');
      arrowContainer.classList.add('whos-coming__arrow');
      arrowContainer.innerHTML = this.sortDirection === 'asc' ? _downArrow.downArrow : _upArrow.upArrow;
      column.appendChild(arrowContainer);
    }
  }, {
    key: 'sortByColumn',
    value: function sortByColumn(column) {
      this.setUpSortByColumn(column);
      this.clearDirectionalArrows();
      this.rows = this.getSortedRows();
      this.rerender(this.rows);
      this.addDirectionalArrow(column);
    }
  }, {
    key: 'setUpSortByColumn',
    value: function setUpSortByColumn(column) {
      var sortColumn = column.getAttribute('data-whos-coming-column');

      if (this.sortColumn === sortColumn) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortDirection = 'asc';
      }

      this.sortColumn = sortColumn;
    }
  }, {
    key: 'columnUSort',
    value: function columnUSort(a, b) {
      if (a.data[this.sortColumn] === b.data[this.sortByColumn]) {
        return 0;
      }

      if (this.sortDirection === 'asc') {
        return a.data[this.sortColumn] < b.data[this.sortColumn] ? -1 : 1;
      }

      return a.data[this.sortColumn] > b.data[this.sortColumn] ? -1 : 1;
    }
  }, {
    key: 'getSortedRows',
    value: function getSortedRows() {
      var sortedRows = this.rows.map(function (item) {
        return item;
      });
      sortedRows.sort(this.columnUSort);

      return sortedRows;
    }
  }]);

  return RowSorter;
}();

RowSorter.getRowData = function (element) {
  return [].concat(_toConsumableArray(element.querySelectorAll('[data-whos-coming-data]'))).reduce(function (data, span) {
    return Object.assign({}, data, _defineProperty({}, span.getAttribute('data-whos-coming-data'), span.innerHTML.trim()));
  }, {});
};

RowSorter.makeRows = function () {
  return [].concat(_toConsumableArray(document.querySelectorAll('.whos-coming__row:not(.whos-coming__row--key)'))).map(function (element) {
    return {
      element: element,
      data: RowSorter.getRowData(element)
    };
  });
};

exports.default = RowSorter;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */

module.exports = function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced = function debounced() {
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  debounced.flush = function () {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;

      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint max-len: 0 */

var upArrow = exports.upArrow = "<svg width=\"1792\" height=\"1792\" viewBox=\"0 0 1792 1792\">\n<path d=\"M1395 1184q0 13-10 23l-50 50q-10 10-23 10t-23-10l-393-393-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z\" fill=\"currentColor\"/>\n</svg>";

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint max-len: 0 */
var downArrow = exports.downArrow = "<svg width=\"1792\" height=\"1792\" viewBox=\"0 0 1792 1792\" class=\"down-arrow-svg\">\n<title>Open</title>\n<path d=\"M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z\" fill=\"currentColor\"/>\n</svg>";

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=whos-coming.js.map