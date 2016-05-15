
var request = require('request');
var token = '510c84ef31ca4bb6b7b989b3b1e7d381';
var options = { url: 'http://api.football-data.org/v1/fixtures/145450', headers: {'X-Auth-Token': token}};



var _team;
var _name;
var _teamUrl;
var Team = function (name) {
    _name = name;
    startTicker();
    getTeamId();
    //getTeam();
    
};

Team.prototype.sayHello = function () {
    console.log('My name is: ' + _name);
};

Team.prototype.startTicker = function () {
  startTicker()
};

Team.prototype.getTeam = function () {
  console.log("bablbaalbal");
  return _team;
};

exports.create = function (test) {
  name = test;
  return new Team(test);
};

function startTicker (argument) {
  getAllGames();
    
}

function getAllGames(){
  var requestUrl = 'http://api.football-data.org/v1/soccerseasons/394/fixtures'
  var options = { url: requestUrl, headers: {'X-Auth-Token': token}};
  request(options, allGames);
  
}
function getTeamId(){
  var requestUrl = 'http://api.football-data.org/v1/soccerseasons/394/teams'
  var options = { url: requestUrl, headers: {'X-Auth-Token': token}};
  request(options, teamId);
  
}

function teamId (error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    for(var i = 0; i < info.teams.length; i++) {
      if(info.teams[i].name == _name){
        _teamUrl = info.teams[i]._links.self.href;
        var options = { url: _teamUrl, headers: {'X-Auth-Token': token}};
        request(options, initTeamInfos);
      }
    }
  }
}

function initTeamInfos (error, response, body) {
  if (!error && response.statusCode == 200) {
    var _team = JSON.parse(body);
    console.log(_team);
    usingItNow(myCallback);
  }
}

function allGames(error, response, body){
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    
    getNextGameForTeam(_name , info);

  }
}

function getNextGameForTeam (teamName, json) {
  console.log("getNextGameForTeam" + teamName);
  for(var i = 0; i < json.fixtures.length; i++) {
    var game = json.fixtures[i];
    if((game.homeTeamName == teamName || game.awayTeamName == teamName) && (game.status == "TIMED" || game.status == "IN_PLAY")) {
      var requestUrl = game._links.self.href;
      console.log(requestUrl);
      var options = { url: requestUrl, headers: {'X-Auth-Token': token}};
      actualMatchUrl = options;
      console.log("match URL " + actualMatchUrl)
      request(options, getGame);
      return ;
    } 
  }
}

function getGame(error, response, body){
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    //console.log(info);
    setTimer(info.fixture.date);
  }
}

function setTimer(kickoff) {
  console.log("set timer");
  var dateNow = Date.now();
  var startTime = new Date(kickoff)
  var millisecondsNextGame = Math.abs(startTime - dateNow);
  if(millisecondsNextGame < 0 ) millisecondsNextGame = 0;
  console.log("next gssame in " + Math.round(millisecondsNextGame / 1000 / 60 ));
  setTimeout(function () {
    checkForGoal();
  }, millisecondsNextGame);
}

function checkForGoal(error, response, body){
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    if(info.fixture.result.goalsHomeTeam || info.fixture.result.goalsAwayTeam){
      if(homeGoal != info.fixture.result.goalsHomeTeam || awayGoal != info.fixture.result.goalsAwayTeam){
        homeGoal = info.fixture.result.goalsHomeTeam;
        awayGoal = info.fixture.result.goalsAwayTeam;
        console.log("goal");
      }
      else{
        console.log("no goals");  
      }
    }
  }
}


var myCallback = function(err, data) {
  if (err) throw err; // Check for the error and throw if it exists.
  console.log('got data: '+data); // Otherwise proceed as usual.
};

var usingItNow = function(callback) {
  callback(null, 'get it?'); // I dont want to throw an error, so I pass null for the error argument
};


