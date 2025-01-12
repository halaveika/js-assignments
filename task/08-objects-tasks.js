
/** ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  Rectangle.prototype.getArea = function() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
  return  JSON.parse(json, (k, v) => (typeof v === 'object') ? Object.assign(Object.create(proto), v) : v);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and
 * pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and
 * implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear
 * and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify() =>
 *    '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify() =>
 *    'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify() =>
 *      'div#main.container.draggable + table#data ~ tr:nth-of-type(even) td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  resultSelector: [],

  element(value) {
    if(this.resultSelector[this.resultSelector.length - 2] === ' e') {
      throw 'Element, id and pseudo-element should not occur more then one time inside the selector';
    }
    if(this.resultSelector[this.resultSelector.length - 2] === ' i' && this.resultSelector.length > 14) {
      throw 'Selector parts should be arranged in the following order:'+
      ' element, id, class, attribute, pseudo-class, pseudo-element';
    }
    this.resultSelector.push(' e');
    this.resultSelector.push(value);
    return this;
  },

  id(value) {
    if(this.resultSelector[this.resultSelector.length - 2] === ' i') {
      throw 'Element, id and pseudo-element should not occur more then one time inside the selector';
    }
    if(this.resultSelector[this.resultSelector.length - 2] === ' c') {
      throw 'Selector parts should be arranged in the following order:'+
      ' element, id, class, attribute, pseudo-class, pseudo-element';
    }
    if(/^(::)/.test(this.resultSelector[this.resultSelector.length - 1])) {
      throw 'Selector parts should be arranged in the following order:'+
      ' element, id, class, attribute, pseudo-class, pseudo-element';
    }
    this.resultSelector.push(' i');
    this.resultSelector.push(`#${value}`);
    return this;
  },

  class(value) {
    if(/\[(.*?)]/.test(this.resultSelector[this.resultSelector.length - 1])) {
      throw 'Selector parts should be arranged in the following order:'+
      ' element, id, class, attribute, pseudo-class, pseudo-element';
    }
    this.resultSelector.push(' c');
    this.resultSelector.push(`.${value}`);
    return this;
  },

  attr(value) {
    if(/^(:)/.test(this.resultSelector[this.resultSelector.length - 1])) {
      throw 'Selector parts should be arranged in the following order:'+
      ' element, id, class, attribute, pseudo-class, pseudo-element';
    }
    this.resultSelector.push(`[${value}]`);
    return this;
  },

  pseudoClass(value) {
    if(/^(::)/.test(this.resultSelector[this.resultSelector.length - 1])) {
      this.resultSelector.push(`:${value}`);
      throw 'Selector parts should be arranged in the following order:' +
      ' element, id, class, attribute, pseudo-class, pseudo-element';
    }
    this.resultSelector.push(`:${value}`);
    return this;
  },

  pseudoElement(value) {
    if(/^(::)/.test(this.resultSelector[this.resultSelector.length - 1])) {
      this.resultSelector.push(`::${value}`);
      throw 'Element, id and pseudo-element should not occur more then one time inside the selector';
    }
    this.resultSelector.push(`::${value}`);
    return this;
  },

  combine(selector1, combinator, selector2) {
    const array = this.resultSelector.slice(1).reverse();
    const index = array.findIndex(e => e[0] === ' ' && e.length === 2);
    const index2 = array.findIndex((e, i) => e[0] === ' ' && e.length === 2 && i !== index );
    if (array[index2] === ' e' && array[index] ===' i' ) {
      array[index2] = ` ${combinator} `;
      array.splice(index, 1);
    } else {
      array[index] = ` ${combinator} `;
    }
    this.resultSelector = array.reverse();
    this.resultSelector.unshift(' ');
    return this;
  },

  stringify(){
    let result = this.resultSelector.filter(e=> e !== ' i' && e !== ' e' && e !== ' c').join('');
    if(result[0]=== ' ') {result = result.trim();}
    this.resultSelector = [];
    return result;
  }
};

module.exports = {
  Rectangle: Rectangle,
  getJSON: getJSON,
  fromJSON: fromJSON,
  cssSelectorBuilder: cssSelectorBuilder
};
