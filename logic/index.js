var _ = require("underscore");


function MostDifferent(id, users){
	let user = {};
	let rest = [];
	for(i = 0; i < users.length; i++){
		if(users[i].id == id){
			rest = users.slice(0);
			user = users[i];
			rest.splice(i,1);
		}
	}
	if (rest.length === 0) return [];
	let matchscores = [];
	for(i = 0; i < rest.length; i++){
		let diffsum = 0;
		for(y = 0; y < user.attributes.length; y++){
			diffsum = diffsum + Math.abs(user.attributes[y] - rest[i].attributes[y]);
		}
		matchscores.push({
			"id" : rest[i].id,
			"name": rest[i].name,
			"desc": rest[i].user_desc,
			"score" : diffsum
		});
	}
	matchscores = _.sortBy(matchscores, function(user){
		return (0-user.score);
	})
	let bestscore = matchscores[0].score;
	if(bestscore && bestscore != 0){
		matchscores = _.map(matchscores, (user) =>{
			return {"id" : user.id, "score" : Math.ceil((user.score/bestscore * 100 ))};
		});
	}
	return matchscores;
}

function MostSimilar(id, users){
	let user = {};
	let rest = [];
	for(i = 0; i < users.length; i++){
		if(users[i].id == id){
			rest = users.slice(0);
			user = users[i];
			rest.splice(i,1);
		}
	}
	if (rest.length === 0) return [];
	let matchscores = [];
	for(i = 0; i < rest.length; i++){
		let diffsum = 0;
		for(y = 0; y < user.attributes.length; y++){
			diffsum = diffsum + Math.abs(user.attributes[y] - rest[i].attributes[y]);
		}
		matchscores.push({
			"id" : rest[i].id,
			"name": rest[i].name,
			"desc": rest[i].user_desc,
			"score" : diffsum
		});
	}
	matchscores = _.sortBy(matchscores, "score");
	let bestscore = (matchscores[0].score == 0) ? 1 : matchscores[0].score;
	if(bestscore && bestscore != 0){
		matchscores = _.map(matchscores, (user) =>{
			if(user.score == 0){
				return {"id" : user.id, "score" : 100};
			}
			return {"id" : user.id, "score" : Math.ceil(1/user.score * bestscore * 100)};
		});
	}
	return matchscores;
}

module.exports.MostDifferent = MostDifferent;
module.exports.MostSimilar = MostSimilar;