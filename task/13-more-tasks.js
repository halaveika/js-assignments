/**
 * Takes two strings including only letters from a to z.
 * Returns a new sorted string containing distinct letters.
 *
 * @param {string} value1
 * @param {string} value2
 * @return {string}
 *
 * @example
 *   'azy', 'bk' => 'abkyz'
 *   'zxxlal','laxk'    => 'aklxz'
 *   'abcdefghijklmnop',  'lmnopqrstuvwxyz'  => 'abcdefghijklmnopqrstuvwxyz'
 */
function distinctLettersString(value1, value2) {
  return [...value1, ...value2 ]
    .sort((a, b)=> a.localeCompare(b))
    .reduce((accum, v, i, arr)=> { if (i>0){( v !== arr[i - 1]) ? accum+=v : accum;}
    else {accum = v;} return accum;}, '' );
}


/**
 * Takes a string with any characters.
 * Returns an object containing appearence of every distinct letters in lower case.
 *
 * @param {string} value
 * @return {Object}
 *
 * @example
 *  'Who you are, Buddy?' => { a:1, d:2, e:1, h:1, o:2, r:1, u:2, y:2 }
 *
 */

function lowerLetters(value) {
  return [...value.match(/[a-z]/g)]
    .sort((a, b)=> a.localeCompare(b))
    .reduce((accum, value)=>{accum[value] = (accum[value] | 0 ) + 1 ; return accum;}, {});
}

/**
 * Write a function that will convert a string into title case, given an optional
 * list of exception (minor words). The list of minor words will be given as a
 * string with each word separated by a space. Your function should ignore the
 * case of the minor words string - it should behave in the same way even if the
 * case of the minor word is changed
 *
 * @param {string} the original string to be converted
 * @param {string} list of minor words that must always be lowercase except for
 *                  the first word in the string
 * @return {string}
 *
 * @example
 *    'a clash of KINGS', 'a an the of'  =>  'A Clash of Kings'
 *    'THE WIND IN THE WILLOWS', 'The In'  => 'The Wind in the Willows'
 *    'the quick brown fox'  => 'The Quick Brown Fox'
 */

function titleCaseConvert(title, minorWords) {
  const original = title.split(' ').map(e => e.toLowerCase());
  let minor = (minorWords) ? minorWords.split(' ').map(e => e.toLowerCase()) : minorWords;
  if(minor) {minor =  minor.filter(e =>  (original.find(i => i === e)) ? true : false);}
  if (minor) {
    return original.map(e => e.replace(e[0], e[0].toUpperCase()))
      .map(e => (minor.find(i => i.toLowerCase() === e.toLowerCase())) ? e.replace(e[0], e[0].toLowerCase()) : e )
      .map((e, i)=> (i===0) ? e.replace(e[0], e[0].toUpperCase()) : e).join(' ');
  }
  return original.map(e => e.replace(e[0], e[0].toUpperCase()))
    .map((e, i)=> (i===0) ? e.replace(e[0], e[0].toUpperCase()) : e).join(' ');
}

/**
 * Your job is to create a calculator which evaluates expressions in Reverse Polish
 * notation (https://en.wikipedia.org/wiki/Reverse_Polish_notation). Empty expression
 * should evaluate to 0. Expression without operation returns the last number.
 *
 * @param {string} RPN string, each number and operation separated by a space
 *
 * @return {Number}
 *
 * @example
 *  ''  =>  0  // empty expression returns 0
 *  '1 2 3'  =>  3  // expression without operation returns the last number
 *  '4 2 +'  =>  6  // 4 + 2
 *  '2 5 * 2 + 3 /'  =>  4   //  ((5 * 2) + 2) / 3
 *  '5 1 2 + 4 * + 3 -'  =>  14   // 5 + ((1 + 2) * 4) -3
 */

function calcRPN(expr) {
  const str = expr.split(' ').map(e => (Number(e)) ? Number(e) : e);
  const stack =[];
  if(str === ''){
    return 0;
  }

  for(let i=0; i<str.length; i++) {
    if(!isNaN(str[i])) {
      stack.push(str[i]);
    }else {
      const a = stack.pop();
      const b = stack.pop();
      if(str[i] === '+') {
        stack.push(a + b);
      } else if(str[i] === '-') {
        stack.push(b - a);
      } else if(str[i] === '*') {
        stack.push(a * b);
      } else if(str[i] === '/') {
        stack.push(b / a);
      }
    }
  }

  if(stack.length > 1) {
    return stack[stack.length - 1];
  }else {
    return stack[0];
  }
}

module.exports = {
  distinctLettersString,
  lowerLetters,
  titleCaseConvert,
  calcRPN
};
