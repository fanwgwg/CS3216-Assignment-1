var Algo = require('./matchalgo.js');

var user = 1;

var users = [{"userid" : 1, "attributes": [1,2,3,4,5]},
{"userid" : 2, "attributes": [1,1,1,1,1]},
{"userid" : 3, "attributes": [2,2,2,2,2]},
{"userid" : 4, "attributes": [3,3,3,3,3]},
{"userid" : 5, "attributes": [4,4,4,4,4]},
{"userid" : 6, "attributes": [5,5,5,5,5]},
{"userid" : 7, "attributes": [5,4,3,2,1]},
{"userid" : 8, "attributes": [1,3,5,2,4]},
{"userid" : 9, "attributes": [2,4,1,3,5]},
{"userid" : 10, "attributes": [1,2,3,4,5]}];

console.log(Algo.MostDifferent(user, users));

console.log(Algo.MostSimilar(user, users));