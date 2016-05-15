var express = require('express');
var http = require('http');
var app = express();
var httpServer = http.Server(app);
var path = require('path')
var request = require('request');
var exec = require('child_process').exec;
var team = require('./lib/team.js');

var actualMatchUrl = "";
var itemsInQue = 1;
var call = 0;
var token = '510c84ef31ca4bb6b7b989b3b1e7d381';
var options = { url: 'http://api.football-data.org/v1/fixtures/145450', headers: {'X-Auth-Token': token}};

var homeGoal = 0;
var awayGoal = 0;

app.use(express.static(path.join(__dirname, 'public')));
/*
function getAllGames(){
  var requestUrl = 'http://api.football-data.org/v1/soccerseasons/394/fixtures'
  var options = { url: requestUrl, headers: {'X-Auth-Token': token}};
  request(options, allGames);
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

function getAllGames(){
  var requestUrl = 'http://api.football-data.org/v1/soccerseasons/394/fixtures'
  var options = { url: requestUrl, headers: {'X-Auth-Token': token}};
  request(options, allGames);
}

function allGames(error, response, body){
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    getNextGameForTeam("Hamburger SV", info);
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
  var dateNow = Date.now();
  var startTime = new Date(kickoff)
  var millisecondsNextGame = Math.abs(startTime - dateNow);
  if(millisecondsNextGame < 0 ) millisecondsNextGame = 0;
  console.log("next game in " + Math.round(millisecondsNextGame / 1000 / 60 ));
  setTimeout(function () {
    startTicker();
  }, millisecondsNextGame);
}


function startTicker() {
  signalStart();
  setInterval(function () {
    request(actualMatchUrl, checkForGoal);
  }, 10000)
  
}

function getNextGameForTeam (teamName, json) {
  for(var i = 0; i < json.fixtures.length; i++) {
    var game = json.fixtures[i];
    if((game.homeTeamName == teamName || game.awayTeamName == teamName) && (game.status == "TIMED" || game.status == "IN_PLAY")) {
      var requestUrl = game._links.self.href;
      console.log(requestUrl);
      var options = { url: requestUrl, headers: {'X-Auth-Token': token}};
      actualMatchUrl = options;
      request(options, getGame);
      return ;
    } 
  }
}

function signalStart() {
  setTimeout(function () {execCmd("pigs p 17 255");}, 0);  
  setTimeout(function () {execCmd("pigs p 17 0");}, 10000);  
}
*/
function signalGoal() {
  for (var i = 1; i < 101; i++) {
    if(i % 2 == 0){
      setTimeout(function () {execCmd("pigs p 17 255");}, i*100);  
    }

    else{
      setTimeout(function () {execCmd("pigs p 17 0");}, i*100);  
    }
  }
  console.log("done");
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  
});

app.get('/signalGoal', function(req, res){
  signalGoal();
  res.send(200, "signalGoal");
});

app.get('/start', function(req, res){
  signalStart();
  res.send(200, "signalStart");
});

function init () {
  myTeam = team.create('Hamburger SV');
  
  execCmd("sudo pigpiod");
  // signalStart();
  // getAllGames();
}

function execCmd(cmd) {
  exec(cmd, function(error, stdout, stderr) {});
}

httpServer.listen(3000, function(){
    console.log('listening on *:3000');
    init();
});
