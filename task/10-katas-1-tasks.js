
/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints(sides = ['N', 'E', 'S', 'W']) {
  const result = new Array(32);
  sides.forEach((value, idx) => result[idx * 8] = value);
  function rec_travel(start_str, finish_str, start_pos, finish_pos) {
    const medium_pos = (finish_pos + start_pos) / 2;
    if (!Number.isInteger(medium_pos))
    {return;}
    let medium_str = start_str + finish_str;
    if (medium_str.length > 3) {
      const main_idx = (finish_pos - start_pos > 0 ? Math.ceil : Math.trunc)(medium_pos / 8) % 4;
      medium_str = start_str + 'b' + sides[main_idx];
    }
    if (!result[medium_pos]) {
      result[medium_pos] = medium_str;
    }
    rec_travel(start_str, result[medium_pos], start_pos, medium_pos);
    rec_travel(finish_str, result[medium_pos], finish_pos, medium_pos);
  }
  rec_travel('N', 'N', 0, 32);
  return result.map((abbr, idx) =>{return { abbreviation : abbr, azimuth : 11.25 * idx};});
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represultent alternations that specify multiple alternatives which are to appear
 * at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Picturesult}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Picturesult/*.jpg',
 *                                                '~/Picturesult/*.gif',
 *                                                '~/Picturesult/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
  const re =/{((?:[^{}]|{{[^}]*}})*)}/;
  function replaceAndAddStrings(str, re) {
    const pattern= str.match(re)[0];
    return str.match(re)[1].split(',').map(element => str.replace(pattern, element));
  }
  let result = [str];
  let isTrue = true;
  while(isTrue){
    const turnResult = result.map(e => re.test(e) ? replaceAndAddStrings(e, re) : e).flat();
    if (result.length === turnResult.length) {
      result = turnResult;
      isTrue =false;
    } else{
      result = turnResult;
    }

  }
  const uniq = [...new Set(result)];
  for (const i of uniq){
    yield i;
  }
}



/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compresultsion algorithm is to sort coefficient
 * of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
  const mtx = [];
  for (let i = 0; i < n; i++){
    mtx[i] = [];
  }
  let i=1, j=1;
  for (let e = 0; e < n*n; e++) {
    mtx[i-1][j-1] = e;
    if ((i + j) % 2 === 0) {
      if (j < n) j ++;
      else       i += 2;
      if (i > 1) i --;
    } else {
      if (i < n) i ++;
      else       j += 2;
      if (j > 1) j --;
    }
  }
  return mtx;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presultented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row
 *  (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
  const a = dominoes
    .map(element => element
      .sort((a, b)=>a-b))
    .sort((a, b)=> (a[0] === b[0]) ? a[1] - b[1] : a[0] - b[0]);
  const b = a.slice();
  const objectA = a.reduce((accum, value)=>{
    (accum[value[0]]===undefined) ? accum[value[0]] = 1 : accum[value[0]] +=1; return accum;}, {});
  const objectB = b.reduce((accum, value)=>{
    (accum[value[1]]===undefined) ? accum[value[1]] = 1 : accum[value[1]] +=1; return accum;}, {});
  const withoutPare = [];
  for (const i in objectA){
    if(objectA[i]%2 !==0) {withoutPare.push(i);}
  }
  for (const i in objectB){
    if(objectB[i]%2 !==0) {withoutPare.push(i);}
  }
  const firstDomino = withoutPare
    .sort((a, b) => a-b)
    .join('')
    .replace(/(.)\1/g, '')
    .split('')
    .map(e=>Number(e))
    .map(item => dominoes
      .flat()
      .filter(element=> element === item))
    .sort((a, b)=>a.length-b.length)
    .flat()[0];
  const result = [];
  const startArr = dominoes.slice();
  dominoes.find(element => element[0]===firstDomino || element[1]===firstDomino );
  function findDomino(number){
    const i = startArr.findIndex(element => element[0] === number || element[1] === number);
    if (i === -1) {return false;}
    const x = startArr.splice(i, 1).flat();
    (x[0] === number) ? result.push(x) : result.push(x.reverse());
    return true;
  }
  findDomino(firstDomino);
  let isTrue = true;
  while (isTrue){
    isTrue = findDomino(result[result.length-1][1]);
  }
  return (startArr.length) ? false : true;
}


/**
 * Returns the string expresultsion of the specified ordered list of integers.
 *
 * A format for expresultsing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end
 *     integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to
 *     more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
  return nums
    .map((e, i, arr)=> (i !==0 && i !==arr.length -1 &&  arr[i+1]===e+1 && arr[i-1]===e-1 ) ? '-' : e)
    .filter((e, i, arr)=> ( i !==0) ? (arr[i-1] === e) ? false : true : true)
    .join()
    .replace(/(,-,)/g, '-');
}

module.exports = {
  createCompassPoints : createCompassPoints,
  expandBraces : expandBraces,
  getZigZagMatrix : getZigZagMatrix,
  canDominoesMakeRow : canDominoesMakeRow,
  extractRanges : extractRanges
};
