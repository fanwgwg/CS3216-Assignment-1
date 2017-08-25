var _ = require("underscore");

function MostDifferent(user, rest){
	let matchscores = [];
	for(i = 0; i < rest.length; i++){
		let diffsum = 0;
		for(y = 0; y < user.attributes.length; y++){
			diffsum = diffsum + Math.abs(user.attributes[y] - rest[i].attributes[y]);
		}
		matchscores.push({"userid" : rest[i].userid, "score" : diffsum});
	}
	matchscores = _.sortBy(matchscores, function(user){
		return (0-user.score);
	})
	let bestscore = matchscores[0].score;
	if(bestscore && bestscore != 0){
		matchscores = _.map(matchscores, (user) =>{
			return {"userid" : user.userid, "score" : Math.ceil((user.score/bestscore * 100 ))};
		});
	}
	return matchscores;
}

function MostSimilar(user, rest){
	let matchscores = [];
	for(i = 0; i < rest.length; i++){
		let diffsum = 0;
		for(y = 0; y < user.attributes.length; y++){
			diffsum = diffsum + Math.abs(user.attributes[y] - rest[i].attributes[y]);
		}
		matchscores.push({"userid" : rest[i].userid, "score" : diffsum});
	}
	matchscores = _.sortBy(matchscores, "score");
	let bestscore = (matchscores[0].score == 0) ? 1 : matchscores[0].score;
	if(bestscore && bestscore != 0){
		matchscores = _.map(matchscores, (user) =>{
			if(user.score == 0){
				return {"userid" : user.userid, "score" : 100};
			}
			return {"userid" : user.userid, "score" : Math.ceil(1/user.score * bestscore * 100)};
		});
	}
	return matchscores;
}

exports.MostDifferent = MostDifferent;
exports.MostSimilar = MostSimilar;