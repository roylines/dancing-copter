var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var _ = require('underscore');
var util = require('util');
var arDrone = require('ar-drone');
var client  = arDrone.createClient();

client.takeoff(function() {
  this.up(0.5);
  this.after(500, function() {
    this.stop();    
  });
});

function WordEmitter () {
  EventEmitter.call(this);
}

util.inherits(WordEmitter, EventEmitter);

process.on('exit', function() {
  client.land();
});

var emitter = new WordEmitter;
emitter.on('gangnamseutail', function() {
  client.animate('yawShake', 1500);
});
emitter.on('ttasaroun', function() {
  client.animate('yawShake', 1500);  
})
emitter.on('lady', function() {
  client.land();
})


fs.readFile('test.lrc', 'utf8', function(err, data) {
  var lines = data.split('\n');
  _.each(lines, function(line) {
    var lyricsRegex = /\[(\d\d):(\d\d)\.(\d\d)\](.*)/;
    if (!lyricsRegex.test(line)) return;

    var match = lyricsRegex.exec(line);
    var minutes = match[1];
    var seconds = match[2];
    var millis = match[3];
    var lyrics = match[4];

    var delay = minutes * 60 * 1000 + seconds * 1000 + millis * 1;

    setTimeout(function() {
        console.log(lyrics);      
      _.each(lyrics.split(' '), function(word) {
        emitter.emit(word.toLowerCase());
      });
    }, delay);
  }) 

});