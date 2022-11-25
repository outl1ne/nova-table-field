/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/autosize/dist/autosize.js":
/*!************************************************!*\
  !*** ./node_modules/autosize/dist/autosize.js ***!
  \************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	autosize 4.0.4
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function (global, factory) {
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else { var mod; }
})(this, function (module, exports) {
	'use strict';

	var map = typeof Map === "function" ? new Map() : function () {
		var keys = [];
		var values = [];

		return {
			has: function has(key) {
				return keys.indexOf(key) > -1;
			},
			get: function get(key) {
				return values[keys.indexOf(key)];
			},
			set: function set(key, value) {
				if (keys.indexOf(key) === -1) {
					keys.push(key);
					values.push(value);
				}
			},
			delete: function _delete(key) {
				var index = keys.indexOf(key);
				if (index > -1) {
					keys.splice(index, 1);
					values.splice(index, 1);
				}
			}
		};
	}();

	var createEvent = function createEvent(name) {
		return new Event(name, { bubbles: true });
	};
	try {
		new Event('test');
	} catch (e) {
		// IE does not support `new Event()`
		createEvent = function createEvent(name) {
			var evt = document.createEvent('Event');
			evt.initEvent(name, true, false);
			return evt;
		};
	}

	function assign(ta) {
		if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;

		var heightOffset = null;
		var clientWidth = null;
		var cachedHeight = null;

		function init() {
			var style = window.getComputedStyle(ta, null);

			if (style.resize === 'vertical') {
				ta.style.resize = 'none';
			} else if (style.resize === 'both') {
				ta.style.resize = 'horizontal';
			}

			if (style.boxSizing === 'content-box') {
				heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
			} else {
				heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
			}
			// Fix when a textarea is not on document body and heightOffset is Not a Number
			if (isNaN(heightOffset)) {
				heightOffset = 0;
			}

			update();
		}

		function changeOverflow(value) {
			{
				// Chrome/Safari-specific fix:
				// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
				// made available by removing the scrollbar. The following forces the necessary text reflow.
				var width = ta.style.width;
				ta.style.width = '0px';
				// Force reflow:
				/* jshint ignore:start */
				ta.offsetWidth;
				/* jshint ignore:end */
				ta.style.width = width;
			}

			ta.style.overflowY = value;
		}

		function getParentOverflows(el) {
			var arr = [];

			while (el && el.parentNode && el.parentNode instanceof Element) {
				if (el.parentNode.scrollTop) {
					arr.push({
						node: el.parentNode,
						scrollTop: el.parentNode.scrollTop
					});
				}
				el = el.parentNode;
			}

			return arr;
		}

		function resize() {
			if (ta.scrollHeight === 0) {
				// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
				return;
			}

			var overflows = getParentOverflows(ta);
			var docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

			ta.style.height = '';
			ta.style.height = ta.scrollHeight + heightOffset + 'px';

			// used to check if an update is actually necessary on window.resize
			clientWidth = ta.clientWidth;

			// prevents scroll-position jumping
			overflows.forEach(function (el) {
				el.node.scrollTop = el.scrollTop;
			});

			if (docTop) {
				document.documentElement.scrollTop = docTop;
			}
		}

		function update() {
			resize();

			var styleHeight = Math.round(parseFloat(ta.style.height));
			var computed = window.getComputedStyle(ta, null);

			// Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
			var actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(computed.height)) : ta.offsetHeight;

			// The actual height not matching the style height (set via the resize method) indicates that 
			// the max-height has been exceeded, in which case the overflow should be allowed.
			if (actualHeight < styleHeight) {
				if (computed.overflowY === 'hidden') {
					changeOverflow('scroll');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			} else {
				// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
				if (computed.overflowY !== 'hidden') {
					changeOverflow('hidden');
					resize();
					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
				}
			}

			if (cachedHeight !== actualHeight) {
				cachedHeight = actualHeight;
				var evt = createEvent('autosize:resized');
				try {
					ta.dispatchEvent(evt);
				} catch (err) {
					// Firefox will throw an error on dispatchEvent for a detached element
					// https://bugzilla.mozilla.org/show_bug.cgi?id=889376
				}
			}
		}

		var pageResize = function pageResize() {
			if (ta.clientWidth !== clientWidth) {
				update();
			}
		};

		var destroy = function (style) {
			window.removeEventListener('resize', pageResize, false);
			ta.removeEventListener('input', update, false);
			ta.removeEventListener('keyup', update, false);
			ta.removeEventListener('autosize:destroy', destroy, false);
			ta.removeEventListener('autosize:update', update, false);

			Object.keys(style).forEach(function (key) {
				ta.style[key] = style[key];
			});

			map.delete(ta);
		}.bind(ta, {
			height: ta.style.height,
			resize: ta.style.resize,
			overflowY: ta.style.overflowY,
			overflowX: ta.style.overflowX,
			wordWrap: ta.style.wordWrap
		});

		ta.addEventListener('autosize:destroy', destroy, false);

		// IE9 does not fire onpropertychange or oninput for deletions,
		// so binding to onkeyup to catch most of those events.
		// There is no way that I know of to detect something like 'cut' in IE9.
		if ('onpropertychange' in ta && 'oninput' in ta) {
			ta.addEventListener('keyup', update, false);
		}

		window.addEventListener('resize', pageResize, false);
		ta.addEventListener('input', update, false);
		ta.addEventListener('autosize:update', update, false);
		ta.style.overflowX = 'hidden';
		ta.style.wordWrap = 'break-word';

		map.set(ta, {
			destroy: destroy,
			update: update
		});

		init();
	}

	function destroy(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.destroy();
		}
	}

	function update(ta) {
		var methods = map.get(ta);
		if (methods) {
			methods.update();
		}
	}

	var autosize = null;

	// Do nothing in Node.js environment and IE8 (or lower)
	if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
		autosize = function autosize(el) {
			return el;
		};
		autosize.destroy = function (el) {
			return el;
		};
		autosize.update = function (el) {
			return el;
		};
	} else {
		autosize = function autosize(el, options) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], function (x) {
					return assign(x, options);
				});
			}
			return el;
		};
		autosize.destroy = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], destroy);
			}
			return el;
		};
		autosize.update = function (el) {
			if (el) {
				Array.prototype.forEach.call(el.length ? el : [el], update);
			}
			return el;
		};
	}

	exports.default = autosize;
	module.exports = exports['default'];
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/DetailField.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/DetailField.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FormFields_TableRow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FormFields/TableRow */ "./resources/js/components/FormFields/TableRow.vue");
/* harmony import */ var _FormFields_Table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FormFields/Table */ "./resources/js/components/FormFields/Table.vue");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  components: {
    Table: _FormFields_Table__WEBPACK_IMPORTED_MODULE_1__["default"],
    TableRow: _FormFields_TableRow__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      theData: []
    };
  },
  created: function created() {
    var valuesArray = Array.isArray(this.field.value) ? this.field.value : JSON.parse(this.field.value);
    if (!Array.isArray(valuesArray) || !valuesArray.length) valuesArray = [];
    this.theData = _.map(valuesArray, function (cells) {
      return {
        cells: cells
      };
    });
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/Table.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/Table.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    canDelete: {
      type: Boolean,
      "default": true
    },
    editMode: {
      type: Boolean,
      "default": true
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableField.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableField.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var laravel_nova__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! laravel-nova */ "laravel-nova");
/* harmony import */ var laravel_nova__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(laravel_nova__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _TableRow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TableRow */ "./resources/js/components/FormFields/TableRow.vue");
/* harmony import */ var autosize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! autosize */ "./node_modules/autosize/dist/autosize.js");
/* harmony import */ var autosize__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(autosize__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Table */ "./resources/js/components/FormFields/Table.vue");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }




function guid() {
  var S4 = function S4() {
    return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  mixins: [laravel_nova__WEBPACK_IMPORTED_MODULE_0__.HandlesValidationErrors, laravel_nova__WEBPACK_IMPORTED_MODULE_0__.FormField],
  components: {
    Table: _Table__WEBPACK_IMPORTED_MODULE_3__["default"],
    TableRow: _TableRow__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      theData: []
    };
  },
  mounted: function mounted() {
    var valuesArray = Array.isArray(this.field.value) ? this.value : JSON.parse(this.field.value);
    if (!Array.isArray(valuesArray) || !valuesArray.length) valuesArray = [];
    this.theData = _.map(valuesArray, function (cells) {
      return {
        id: guid(),
        cells: cells
      };
    });
    if (this.theData.length === 0) {
      for (var i = 0; i < (this.defaultAttributes.minRows || 1); i++) {
        this.addRow();
      }
    }
  },
  methods: {
    /**
     * Provide a function that fills a passed FormData object with the
     * field's internal value attribute.
     */
    fill: function fill(formData) {
      formData.append(this.field.attribute, JSON.stringify(this.finalPayload));
    },
    /**
     * Add a row to the table.
     */
    addRow: function addRow() {
      var _this = this;
      if (this.theData.length + 1 > this.defaultAttributes.maxRows) return this.$toasted.show(this.__('novaTableField.maxRowsError', {
        max: this.defaultAttributes.maxRows
      }), {
        type: 'error'
      });
      return _.tap(guid(), function (id) {
        _this.theData = [].concat(_toConsumableArray(_this.theData), [{
          id: id,
          cells: Array(_this.numberOfColumns).join('.').split('.')
        }]);
        return id;
      });
    },
    /**
     * Add a column to the table.
     */
    addColumn: function addColumn() {
      var _this2 = this;
      if (this.numberOfColumns + 1 > this.defaultAttributes.maxColumns) return this.$toasted.show(this.__('novaTableField.maxColumnsError', {
        max: this.defaultAttributes.maxColumns
      }), {
        type: 'error'
      });
      this.theData.forEach(function (_, index) {
        _this2.theData[index].cells.push('');
      });
    },
    /**
     * Add a row to the table and select its first field.
     */
    addRowAndSelect: function addRowAndSelect() {
      return this.selectRow(this.addRow());
    },
    /**
     * Remove the row from the table.
     */
    removeRow: function removeRow(id) {
      var _this3 = this;
      if (this.theData.length - 1 < this.defaultAttributes.minRows) return this.$toasted.show(this.__('novaTableField.minRowsError', {
        min: this.defaultAttributes.minRows
      }), {
        type: 'error'
      });
      return _.tap(_.findIndex(this.theData, function (row) {
        return row.id === id;
      }), function (index) {
        return _this3.theData.splice(index, 1);
      });
    },
    /**
     * Remove the column from the table.
     */
    removeColumn: function removeColumn(index) {
      if (this.numberOfColumns - 1 < this.defaultAttributes.minColumns) return this.$toasted.show(this.__('novaTableField.minColumnsError', {
        min: this.defaultAttributes.minColumns
      }), {
        type: 'error'
      });
      return this.theData.map(function (row) {
        row.cells.splice(index - 1, 1);
        return row;
      });
    },
    /**
     * Remove all columns and rows from the table.
     */
    removeTable: function removeTable() {
      return this.theData = [];
    },
    /**
     * Add a column to the row and select its last field.
     */
    addColumnAndSelect: function addColumnAndSelect() {
      return this.selectColumn(this.addColumn());
    },
    /**
     * Select the first field in a row with the given ref ID.
     */
    selectRow: function selectRow(refId) {
      var _this4 = this;
      return this.$nextTick(function () {
        _this4.$refs[refId][0].$refs.columnFields[0].select();
      });
    },
    /**
     * Select the last cell in the first row.
     */
    selectColumn: function selectColumn() {
      var _this5 = this;
      return this.$nextTick(function () {
        // prettier-ignore
        Object.values(_this5.$refs).map(function (ref) {
          return autosize__WEBPACK_IMPORTED_MODULE_2___default()(ref[0].$refs.columnFields);
        })[0].slice(-1)[0].select();
      });
    }
  },
  computed: {
    /**
     * Return the final filtered json object
     */
    finalPayload: function finalPayload() {
      return _(this.theData).map(function (row) {
        return row && row.cells && row.cells.length > 0 ? row.cells : undefined;
      }).reject(function (row) {
        return row === undefined;
      }).value();
    },
    defaultAttributes: function defaultAttributes() {
      return {
        minRows: this.field.minRows || 1,
        maxRows: this.field.maxRows,
        minColumns: this.field.minColumns || 1,
        maxColumns: this.field.maxColumns
      };
    },
    numberOfColumns: function numberOfColumns() {
      return this.theData[0] ? this.theData[0].cells.length : this.defaultAttributes.minColumns;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableRow.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableRow.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var autosize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! autosize */ "./node_modules/autosize/dist/autosize.js");
/* harmony import */ var autosize__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(autosize__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    index: Number,
    row: Object,
    disabled: {
      type: Boolean,
      "default": false
    },
    readOnly: {
      type: Boolean,
      "default": false
    },
    canDelete: {
      type: Boolean,
      "default": true
    }
  },
  mounted: function mounted() {
    autosize__WEBPACK_IMPORTED_MODULE_0___default()(this.$refs.columnFields);
  },
  methods: {
    handleColumnFieldFocus: function handleColumnFieldFocus(index) {
      this.$refs.columnFields[index].select();
    }
  },
  computed: {
    isEditable: function isEditable() {
      return !this.readOnly && !this.disabled;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/DetailField.vue?vue&type=template&id=0224618e":
/*!*********************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/DetailField.vue?vue&type=template&id=0224618e ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);

var _hoisted_1 = {
  "class": "bg-white overflow-hidden"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_TableRow = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("TableRow");
  var _component_Table = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("Table");
  var _component_PanelItem = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("PanelItem");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_PanelItem, {
    index: _ctx.index,
    field: $props.field
  }, {
    value: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [_ctx.theData.length > 0 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_Table, {
        key: 0,
        "edit-mode": false,
        "class": "overflow-hidden"
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(_ctx.theData, function (row, index) {
            return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_TableRow, {
              disabled: true,
              key: index,
              row: row
            }, null, 8 /* PROPS */, ["row"]);
          }), 128 /* KEYED_FRAGMENT */))])];
        }),

        _: 1 /* STABLE */
      })) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["index", "field"]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/Table.vue?vue&type=template&id=c628dfb2":
/*!**************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/Table.vue?vue&type=template&id=c628dfb2 ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
    "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)(["relative bg-30 bg-clip border border-60", {
      'mr-12': $props.editMode && $props.canDelete
    }])
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.renderSlot)(_ctx.$slots, "default")], 2 /* CLASS */);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableField.vue?vue&type=template&id=1d7caa43":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableField.vue?vue&type=template&id=1d7caa43 ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);

var _hoisted_1 = {
  "class": "bg-white overflow-hidden key-value-items"
};
var _hoisted_2 = {
  key: 0,
  "class": "relative mr-12 mt-3 flex"
};
var _hoisted_3 = {
  "class": "flex flex-grow justify-center"
};
var _hoisted_4 = ["onClick"];
var _hoisted_5 = {
  key: 1,
  "class": "mr-12 flex"
};
var _hoisted_6 = {
  "class": "ml-1"
};
var _hoisted_7 = {
  "class": "ml-1"
};
var _hoisted_8 = ["innerHTML"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_TableRow = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("TableRow");
  var _component_Table = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("Table");
  var _component_icon = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("icon");
  var _component_DefaultField = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("DefaultField");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_DefaultField, {
    field: _ctx.currentField,
    errors: _ctx.errors,
    "show-help-text": _ctx.showHelpText,
    "full-width-content": _ctx.currentField.fullWidth
  }, {
    field: (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
      return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_Table, {
        "can-delete": _ctx.field.canDelete,
        "edit-mode": !_ctx.field.readonly
      }, {
        "default": (0,vue__WEBPACK_IMPORTED_MODULE_0__.withCtx)(function () {
          return [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_1, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)(_ctx.theData, function (row, index) {
            return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createBlock)(_component_TableRow, {
              key: row.id,
              ref_for: true,
              ref: row.id,
              "can-delete": _ctx.field.canDelete,
              index: index,
              "read-only": _ctx.field.readonly,
              row: row,
              onRemoveRow: $options.removeRow
            }, null, 8 /* PROPS */, ["can-delete", "index", "read-only", "row", "onRemoveRow"]);
          }), 128 /* KEYED_FRAGMENT */))])];
        }),

        _: 1 /* STABLE */
      }, 8 /* PROPS */, ["can-delete", "edit-mode"]), _ctx.field.canDelete ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_2, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($options.numberOfColumns, function (n) {
        return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_3, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
          "class": "appearance-none cursor-pointer text-70 hover:text-danger active:outline-none active:shadow-outline focus:outline-none focus:shadow-outline",
          tabindex: "-1",
          title: "Delete",
          type: "button",
          onClick: function onClick($event) {
            return $options.removeColumn(n);
          }
        }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_icon, {
          type: "trash"
        })], 8 /* PROPS */, _hoisted_4)]);
      }), 256 /* UNKEYED_FRAGMENT */))])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), !_ctx.field.readonly && _ctx.field.canAdd ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_5, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
        "class": "btn btn-link dim cursor-pointer rounded-lg mx-auto text-primary mt-3 px-3 rounded-b-lg flex items-center",
        type: "button",
        onClick: _cache[0] || (_cache[0] = function () {
          return $options.addRowAndSelect && $options.addRowAndSelect.apply($options, arguments);
        })
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_icon, {
        height: "24",
        type: "plus",
        "view-box": "0 0 24 24",
        width: "24"
      }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_6, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.__('novaTableField.addRow')), 1 /* TEXT */)]), $options.numberOfColumns > 0 ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("button", {
        key: 0,
        "class": "btn btn-link dim cursor-pointer rounded-lg mx-auto text-primary mt-3 px-3 rounded-b-lg flex items-center",
        tabindex: "-1",
        type: "button",
        onClick: _cache[1] || (_cache[1] = function () {
          return $options.addColumnAndSelect && $options.addColumnAndSelect.apply($options, arguments);
        })
      }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_icon, {
        height: "24",
        type: "plus",
        "view-box": "0 0 24 24",
        width: "24"
      }), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("span", _hoisted_7, (0,vue__WEBPACK_IMPORTED_MODULE_0__.toDisplayString)(_ctx.__('novaTableField.addColumn')), 1 /* TEXT */)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true), _ctx.field.helpText ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
        key: 2,
        "class": "help-text help-text mt-2",
        innerHTML: _ctx.field.helpText
      }, null, 8 /* PROPS */, _hoisted_8)) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)];
    }),
    _: 1 /* STABLE */
  }, 8 /* PROPS */, ["field", "errors", "show-help-text", "full-width-content"]);
}

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableRow.vue?vue&type=template&id=5d2f8b63":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableRow.vue?vue&type=template&id=5d2f8b63 ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);

var _hoisted_1 = {
  "class": "flex items-center key-value-item"
};
var _hoisted_2 = {
  "class": "flex flex-grow border-b border-50 key-value-fields"
};
var _hoisted_3 = ["onClick"];
var _hoisted_4 = ["disabled", "dusk", "onFocus", "onUpdate:modelValue"];
var _hoisted_5 = {
  key: 0,
  "class": "flex justify-center h-11 w-11 absolute",
  style: {
    "right": "-40px"
  }
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_icon = (0,vue__WEBPACK_IMPORTED_MODULE_0__.resolveComponent)("icon");
  return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_1, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("div", _hoisted_2, [((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(true), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)(vue__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,vue__WEBPACK_IMPORTED_MODULE_0__.renderList)($props.row.cells, function (cell, index) {
    return (0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", {
      key: "column-".concat(index),
      onClick: function onClick($event) {
        return $options.handleColumnFieldFocus(index);
      },
      "class": "flex-grow border-l border-50"
    }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.withDirectives)(((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("textarea", {
      "class": (0,vue__WEBPACK_IMPORTED_MODULE_0__.normalizeClass)([{
        'bg-white': !$options.isEditable,
        'hover:bg-20 focus:bg-white': $options.isEditable
      }, "font-mono text-sm block min-h-input w-full form-control form-input form-input-row py-4 text-90 min-h-full"]),
      disabled: !$options.isEditable,
      dusk: "key-value-value-".concat(index),
      key: cell.id,
      onFocus: function onFocus($event) {
        return $options.handleColumnFieldFocus(index);
      },
      ref_for: true,
      ref: "columnFields",
      "onUpdate:modelValue": function onUpdateModelValue($event) {
        return $props.row.cells[index] = $event;
      }
    }, null, 42 /* CLASS, PROPS, HYDRATE_EVENTS */, _hoisted_4)), [[vue__WEBPACK_IMPORTED_MODULE_0__.vModelText, $props.row.cells[index]]])], 8 /* PROPS */, _hoisted_3);
  }), 128 /* KEYED_FRAGMENT */))]), $options.isEditable && $props.canDelete ? ((0,vue__WEBPACK_IMPORTED_MODULE_0__.openBlock)(), (0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementBlock)("div", _hoisted_5, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createElementVNode)("button", {
    onClick: _cache[0] || (_cache[0] = function ($event) {
      return _ctx.$emit('remove-row', $props.row.id);
    }),
    "class": "flex appearance-none cursor-pointer text-70 hover:text-danger active:outline-none active:shadow-outline focus:outline-none focus:shadow-outline",
    style: {
      "align-items": "center"
    },
    tabindex: "-1",
    title: "Delete",
    type: "button"
  }, [(0,vue__WEBPACK_IMPORTED_MODULE_0__.createVNode)(_component_icon, {
    type: "trash"
  })])])) : (0,vue__WEBPACK_IMPORTED_MODULE_0__.createCommentVNode)("v-if", true)]);
}

/***/ }),

/***/ "./node_modules/vue-loader/dist/exportHelper.js":
/*!******************************************************!*\
  !*** ./node_modules/vue-loader/dist/exportHelper.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
// runtime helper for setting properties on components
// in a tree-shakable way
exports["default"] = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
        target[key] = val;
    }
    return target;
};


/***/ }),

/***/ "./resources/js/components/DetailField.vue":
/*!*************************************************!*\
  !*** ./resources/js/components/DetailField.vue ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DetailField_vue_vue_type_template_id_0224618e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DetailField.vue?vue&type=template&id=0224618e */ "./resources/js/components/DetailField.vue?vue&type=template&id=0224618e");
/* harmony import */ var _DetailField_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DetailField.vue?vue&type=script&lang=js */ "./resources/js/components/DetailField.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_nks_Projects_laravel_nova_table_field_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_nks_Projects_laravel_nova_table_field_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_DetailField_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_DetailField_vue_vue_type_template_id_0224618e__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/components/DetailField.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/components/FormFields/Table.vue":
/*!******************************************************!*\
  !*** ./resources/js/components/FormFields/Table.vue ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Table_vue_vue_type_template_id_c628dfb2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Table.vue?vue&type=template&id=c628dfb2 */ "./resources/js/components/FormFields/Table.vue?vue&type=template&id=c628dfb2");
/* harmony import */ var _Table_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Table.vue?vue&type=script&lang=js */ "./resources/js/components/FormFields/Table.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_nks_Projects_laravel_nova_table_field_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_nks_Projects_laravel_nova_table_field_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_Table_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_Table_vue_vue_type_template_id_c628dfb2__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/components/FormFields/Table.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/components/FormFields/TableField.vue":
/*!***********************************************************!*\
  !*** ./resources/js/components/FormFields/TableField.vue ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TableField_vue_vue_type_template_id_1d7caa43__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TableField.vue?vue&type=template&id=1d7caa43 */ "./resources/js/components/FormFields/TableField.vue?vue&type=template&id=1d7caa43");
/* harmony import */ var _TableField_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TableField.vue?vue&type=script&lang=js */ "./resources/js/components/FormFields/TableField.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_nks_Projects_laravel_nova_table_field_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_nks_Projects_laravel_nova_table_field_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_TableField_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_TableField_vue_vue_type_template_id_1d7caa43__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/components/FormFields/TableField.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/components/FormFields/TableRow.vue":
/*!*********************************************************!*\
  !*** ./resources/js/components/FormFields/TableRow.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TableRow_vue_vue_type_template_id_5d2f8b63__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TableRow.vue?vue&type=template&id=5d2f8b63 */ "./resources/js/components/FormFields/TableRow.vue?vue&type=template&id=5d2f8b63");
/* harmony import */ var _TableRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TableRow.vue?vue&type=script&lang=js */ "./resources/js/components/FormFields/TableRow.vue?vue&type=script&lang=js");
/* harmony import */ var _Users_nks_Projects_laravel_nova_table_field_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/vue-loader/dist/exportHelper.js */ "./node_modules/vue-loader/dist/exportHelper.js");




;
const __exports__ = /*#__PURE__*/(0,_Users_nks_Projects_laravel_nova_table_field_node_modules_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"])(_TableRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_TableRow_vue_vue_type_template_id_5d2f8b63__WEBPACK_IMPORTED_MODULE_0__.render],['__file',"resources/js/components/FormFields/TableRow.vue"]])
/* hot reload */
if (false) {}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__exports__);

/***/ }),

/***/ "./resources/js/components/DetailField.vue?vue&type=script&lang=js":
/*!*************************************************************************!*\
  !*** ./resources/js/components/DetailField.vue?vue&type=script&lang=js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DetailField_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DetailField_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DetailField.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/DetailField.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/components/FormFields/Table.vue?vue&type=script&lang=js":
/*!******************************************************************************!*\
  !*** ./resources/js/components/FormFields/Table.vue?vue&type=script&lang=js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Table_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Table_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Table.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/Table.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/components/FormFields/TableField.vue?vue&type=script&lang=js":
/*!***********************************************************************************!*\
  !*** ./resources/js/components/FormFields/TableField.vue?vue&type=script&lang=js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_TableField_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_TableField_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./TableField.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableField.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/components/FormFields/TableRow.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/components/FormFields/TableRow.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_TableRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_TableRow_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./TableRow.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableRow.vue?vue&type=script&lang=js");
 

/***/ }),

/***/ "./resources/js/components/DetailField.vue?vue&type=template&id=0224618e":
/*!*******************************************************************************!*\
  !*** ./resources/js/components/DetailField.vue?vue&type=template&id=0224618e ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DetailField_vue_vue_type_template_id_0224618e__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_DetailField_vue_vue_type_template_id_0224618e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./DetailField.vue?vue&type=template&id=0224618e */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/DetailField.vue?vue&type=template&id=0224618e");


/***/ }),

/***/ "./resources/js/components/FormFields/Table.vue?vue&type=template&id=c628dfb2":
/*!************************************************************************************!*\
  !*** ./resources/js/components/FormFields/Table.vue?vue&type=template&id=c628dfb2 ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Table_vue_vue_type_template_id_c628dfb2__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_Table_vue_vue_type_template_id_c628dfb2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./Table.vue?vue&type=template&id=c628dfb2 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/Table.vue?vue&type=template&id=c628dfb2");


/***/ }),

/***/ "./resources/js/components/FormFields/TableField.vue?vue&type=template&id=1d7caa43":
/*!*****************************************************************************************!*\
  !*** ./resources/js/components/FormFields/TableField.vue?vue&type=template&id=1d7caa43 ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_TableField_vue_vue_type_template_id_1d7caa43__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_TableField_vue_vue_type_template_id_1d7caa43__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./TableField.vue?vue&type=template&id=1d7caa43 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableField.vue?vue&type=template&id=1d7caa43");


/***/ }),

/***/ "./resources/js/components/FormFields/TableRow.vue?vue&type=template&id=5d2f8b63":
/*!***************************************************************************************!*\
  !*** ./resources/js/components/FormFields/TableRow.vue?vue&type=template&id=5d2f8b63 ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* reexport safe */ _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_TableRow_vue_vue_type_template_id_5d2f8b63__WEBPACK_IMPORTED_MODULE_0__.render)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_dist_templateLoader_js_ruleSet_1_rules_2_node_modules_vue_loader_dist_index_js_ruleSet_0_use_0_TableRow_vue_vue_type_template_id_5d2f8b63__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!../../../../node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./TableRow.vue?vue&type=template&id=5d2f8b63 */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./resources/js/components/FormFields/TableRow.vue?vue&type=template&id=5d2f8b63");


/***/ }),

/***/ "laravel-nova":
/*!******************************!*\
  !*** external "LaravelNova" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = LaravelNova;

/***/ }),

/***/ "vue":
/*!**********************!*\
  !*** external "Vue" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = Vue;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************!*\
  !*** ./resources/js/field.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_DetailField_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/DetailField.vue */ "./resources/js/components/DetailField.vue");
/* harmony import */ var _components_FormFields_TableField_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/FormFields/TableField.vue */ "./resources/js/components/FormFields/TableField.vue");


Nova.booting(function (app) {
  // Nova Table Field...
  app.component('detail-nova-table-field', _components_DetailField_vue__WEBPACK_IMPORTED_MODULE_0__["default"]);
  app.component('form-nova-table-field', _components_FormFields_TableField_vue__WEBPACK_IMPORTED_MODULE_1__["default"]);
});
})();

/******/ })()
;