var one = 'cat';
var two = one;
two = 'dog';
console.log(one, two);

var oneA = [1, 2, 3];
var twoA = oneA;
twoA.push(4);
oneA.push(5)
console.log(oneA, twoA)

var spreadA = [1,2,3];
var spreadB = [...spreadA];
spreadA.push('A')
spreadB.push('B')
console.log(spreadA, spreadB)

var concatA = [1,2,3];
var concatB = [].concat(concatA)
concatA.push('A'.toLowerCase())
concatB.push('B')
console.log(concatA, concatB)
