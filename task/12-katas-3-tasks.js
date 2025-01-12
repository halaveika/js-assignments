
/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left,
 * right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ];
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {

  const vectors = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
  ];

  const n = puzzle.length;
  const m = puzzle[0].length;

  const visited = createZeroMatrix(n, m);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (puzzle[i][j] === searchStr[0]) {
        visited[i][j] = 1;
        if (findStrOnPuzzle(puzzle, searchStr, i, j, visited, 1)) {
          return true;
        }
        visited[i][j] = 0;
      }
    }
  }

  return false;

  function findStrOnPuzzle(puzzle, searchStr, x, y, visited, wordIndex) {
    const n = puzzle.length;
    const m = puzzle[0].length;

    if (wordIndex === searchStr.length) {
      return true;
    }

    for (let i = 0; i < vectors.length; i++) {
      const [nx, ny] = [
        x + vectors[i][0],
        y + vectors[i][1]
      ];

      if (nx >= 0 && nx < n && ny >= 0 && ny < m &&
          !visited[nx][ny] &&
          puzzle[nx][ny] === searchStr[wordIndex]) {
        visited[nx][ny] = 1;
        if (findStrOnPuzzle(puzzle, searchStr, nx, ny, visited, wordIndex + 1)) {
          return true;
        }
        visited[nx][ny] = 0;
      }
    }

    return false;
  }


  function createZeroMatrix(n, m) {
    const matrix = [];
    for (let i = 0; i < n; i++) {
      matrix.push(new Array(m).fill(0));
    }
    return matrix;
  }

}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 *
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from
 *    the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
  function getPermutationsRecurs(chars){
    if (chars.length < 2 ){
      return chars;
    }
    const permutationsArray = [];

    for (let i = 0; i < chars.length; i++){
      const char = chars[i];
      if (chars.indexOf(char) !== i)
      {continue;}

      const remainingChars = chars.slice(0, i) + chars.slice(i + 1, chars.length);

      for (const permutation of getPermutationsRecurs(remainingChars)){
        permutationsArray.push(char + permutation); }
    }
    return permutationsArray;
  }
  const resultArr = getPermutationsRecurs(chars);
  for (let i=0; i < resultArr.length; i++ ){
    yield resultArr[i];
  }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units
 * you have already bought, or do nothing.
 * Therefore, the most profit is the maximum difference of all pairs in a sequence
 * of stock prices.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
  let profit = 0;
  let max = quotes[quotes.length - 1];
  for(let i = quotes.length - 2; i>= 0; i-- ){
    max = Math.max(max, quotes[i]);
    if(quotes[i] < max) {
      profit += max - quotes[i];
    }
  }
  return profit;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 *
 * @class
 *
 * @example
 *
 *   var urlShortener = new UrlShortener();
 *   var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *   var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 *
 */
function UrlShortener() {
  this.urlAllowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                          'abcdefghijklmnopqrstuvwxyz' +
                          "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {
  encode(url) {
    let newString = '',
      char, nextChar, combinedCharCode;
    for (let i = 0; i < url.length; i += 2) {
      char = url.charCodeAt(i);
      nextChar = url.charCodeAt(i + 1) - 31;
      combinedCharCode = char + '' + nextChar.toLocaleString('en', {
        minimumIntegerDigits: 2
      });
      newString += String.fromCharCode(parseInt(combinedCharCode, 10));
    }
    return newString;
  },

  decode(code) {
    let newString = '',
      char, codeStr, firstCharCode, lastCharCode;
    for (let i = 0; i < code.length; i++) {
      char = code.charCodeAt(i);
      if (char > 132) {
        codeStr = char.toString(10);
        firstCharCode = parseInt(codeStr.substring(0, codeStr.length - 2), 10);
        lastCharCode = parseInt(codeStr.substring(codeStr.length - 2, codeStr.length), 10) + 31;
        newString += String.fromCharCode(firstCharCode) + String.fromCharCode(lastCharCode);
      } else {
        newString += code.charAt(i);
      }
    }
    return newString;
  }
};

module.exports = {
  findStringInSnakingPuzzle: findStringInSnakingPuzzle,
  getPermutations: getPermutations,
  getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
  UrlShortener: UrlShortener
};
