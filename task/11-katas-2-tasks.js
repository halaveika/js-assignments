
/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist
 * in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account
 * that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it
 * into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
  const digits = new Map();
  digits.set(' _ | ||_|', 0);
  digits.set('     |  |', 1);
  digits.set(' _  _||_ ', 2);
  digits.set(' _  _| _|', 3);
  digits.set('   |_|  |', 4);
  digits.set(' _ |_  _|', 5);
  digits.set(' _ |_ |_|', 6);
  digits.set(' _   |  |', 7);
  digits.set(' _ |_||_|', 8);
  digits.set(' _ |_| _|', 9);
  function parser(str, i) {
    return str.slice(3*i, 3*i+3)+str.slice(3*i+28, 3*i+31)+str.slice(3*i+56, 3*i+59);
  }
  const result = Array(10).fill(0).map((e, i) => digits.get((parser(bankAccount, i)))).join('');
  return Number(result);
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make
 * sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>
 *      'The String global object',
 *      'is a constructor for',
 *      'strings, or a sequence of',
 *      'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>
 *      'The String',
 *      'global',
 *      'object is a',
 *      'constructor',
 *      'for strings,',
 *      'or a',
 *      'sequence of',
 *      'characters.'
 */
function* wrapText(text, columns) {
  const result =[];
  function reqParse(str, index=columns){
    if(str==='') { return true; }
    let checkedSymbol;
    (str.length > index) ? checkedSymbol = str[index] : checkedSymbol = str[str.length-1];
    if (checkedSymbol ===' ' || checkedSymbol ===',' || checkedSymbol ==='.') {
      if(str.length < index+1) {
        result.push(str.trim());
        str ='';
      } else {
        result.push(str.slice(0, index+1).trim());
        str = str.slice(index+1);
      }
    } else {return reqParse(str, index - 1);}
    return reqParse(str);
  }
  reqParse(text, columns);
  while (result.length){
    yield result.shift();
  }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
  StraightFlush: 8,
  FourOfKind: 7,
  FullHouse: 6,
  Flush: 5,
  Straight: 4,
  ThreeOfKind: 3,
  TwoPairs: 2,
  OnePair: 1,
  HighCard: 0
};

function getPokerHandRank(hand) {
  const x = hand.slice();
  const cardRank = new Map([
    ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6],
    ['7', 7], ['8', 8], ['9', 9], ['10', 10],
    ['J', 11], ['Q', 12], ['K', 13], ['A', 14]]);


  function sortHand(hand){
    return hand.sort((a, b)=>
      cardRank.get((a.length ===2)? a[0] : a[0]+a[1]) - cardRank.get((b.length ===2)? b[0] : b[0]+b[1]));
  }

  function skipSuit(hand){
    return hand.map(card=> (card.length ===2) ? card[0] : card[0]+card[1]);
  }

  function isFlush(hand){
    const check=hand.filter((v, i, arr)=> arr[0].slice(-1) === v.slice(-1));
    return (hand.length === check.length) ? true : false;
  }

  function checkStraight(hand){
    const pattern = skipSuit(sortHand(hand));
    const searchString = Array.from(cardRank.keys()).concat(Array.from(cardRank.keys())).join('');
    if(cardRank.get(pattern[pattern.length-1]) === 14 && cardRank.get(pattern[0])===2) {
      const pattern2 = pattern.slice(-1).concat(pattern.slice(0, -1)).join('');
      const result = searchString.search(pattern.join(''));
      const result2 = searchString.search(pattern2);
      return (result !==-1 || result2 !==-1 ) ? true : false;
    }
    const result = searchString.search(pattern.join(''));
    return (result !==-1) ? true : false;
  }

  function checkStraightFlush(hand){
    const isStraight = checkStraight(hand);
    const flush = isFlush(hand);
    return (isStraight && flush) ? true : false;
  }

  function cardCount(hand){
    const r = skipSuit(hand).
      reduce((acc, value)=> {acc[cardRank.get(value)] = (acc[cardRank.get(value)] || 0) + 1; return acc; }, {});
    const value = Object.values(r).sort((a, b)=>b-a);
    switch (value[0]) {
    case 4: return PokerRank.FourOfKind;
    case 3: if(value[1]===2) {return PokerRank.FullHouse;} else{return PokerRank.ThreeOfKind;}
    case 2: if(value[1]===2) {return PokerRank.TwoPairs;} else{return PokerRank.OnePair;}
    case 1: return PokerRank.HighCard;
    default:
      return 0;
    }
  }

  if (checkStraightFlush(x)) {return PokerRank.StraightFlush;}
  else if (cardCount(x) ===7) {return PokerRank.FourOfKind;}
  else if (cardCount(x) ===6) {return PokerRank.FullHouse;}
  else if (isFlush(x)) {return PokerRank.Flush;}
  else if (checkStraight(x)) {return PokerRank.Straight;}
  else if (cardCount(x) ===3) {return PokerRank.ThreeOfKind;}
  else if (cardCount(x) ===2) {return PokerRank.TwoPairs;}
  else if (cardCount(x) ===1) {return PokerRank.OnePair;}

  return PokerRank.HighCard;
}

/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +,
 * vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 *
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+        '+------------+\n'+
 *    '|            |\n'+        '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+   =>   '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+        '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'         '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+    s  =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
  const result =[];
  const parsedArr = figure.match(/\|(.*)\|/g);
  if(parsedArr) {
    parsedArr
      .map(e=>e.split('|')
        .slice(1, -1))
      .map(e=> e.map(i => i.length))
      .forEach((e, i, arr) => {
        if(i===0){
          result.push(e.map(item=>[item, 1]));
        } else {
          (result[result.length - 1].every((item, j)=> item[0] === e[j]))
            ? result[result.length - 1].map(e=>e[1]++) :  result.push(e.map(item=>[item, 1]));
        }
      });

    const drawArr = result.flat().map(e => Draw(e));
    for(let i=0; i < drawArr.length; i++){
      yield drawArr[i];
    }
  } else {
    const result = Array(figure.match(/[+]/g).length/2 - 1).fill('++\n' + '++\n');
    for(let i=0; i < result.length; i++){
      yield result[i];
    }
  }

  function Draw(arr){
    const str = `+${Array(arr[0]).fill('-').join('')}+\n`+
            Array(arr[1]).fill(`|${Array(arr[0]).fill(' ').join('')}|\n`).join('')+
          `+${Array(arr[0]).fill('-').join('')}+\n`;
    return str;
  }


}

module.exports = {
  parseBankAccount: parseBankAccount,
  wrapText: wrapText,
  PokerRank: PokerRank,
  getPokerHandRank: getPokerHandRank,
  getFigureRectangles: getFigureRectangles
};
