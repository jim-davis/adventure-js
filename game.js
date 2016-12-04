var _ = require('lodash');
const Player = require("./player.js").Player;
const adhoc = require("./adhoc.js");
const verbs = require("./verbs.js");
const Verbs  = require("./verb.js").Verbs;
const arc  = require("./arc.js");
const Arc = arc.Arc;
const util = require("./util.js");

function Game () {
	this.player = new Player();
	this.rooms = {};
	this.adhocs = [];
}

Game.prototype.goto = function (id) {
	this.player.goto(this.room(id));
};

Game.prototype.room = function (id) {
	var r = this.rooms[id];
	if (r) {
		return r;
	} else {
		throw(`No room '${id}'`);
	}
};

Game.prototype.add_room = function (room) {
	this.rooms[room.id] = room;
	return room;
};

Game.prototype.add_arc = function (np, direction, from_id, to_id, msg=null) {
	return new Arc(this.room(from_id),
				   this.room(to_id),
				   direction,
				   np,
				   msg);
};

Game.prototype.add_arc_pair = function (np, direction, from_id, to_id) {
	var a = this.add_arc(np, direction, from_id, to_id);
	var b = a.reverse_arc();
	return [a,b];
};


// a transition arc is hidden, one-way, and has a message.  It has no associated np
// It's used for movements (you might as well call them actions) that don't make
// sense as associated with anything visible, e.g. WAIT
Game.prototype.add_transition_arc = function (direction, from_id, to_id, msg) {
	new Arc(this.room(from_id),
			this.room(to_id),
			direction,
			msg);
};

Game.prototype.when = function (regexp) {
	return new adhoc.Builder(this, regexp);
};

Game.prototype.add_adhoc = function (adhoc) {
	this.adhocs.push(adhoc);
	return adhoc;
};

Game.prototype.speak = function (s) {
	console.log(s);
};

Game.prototype.look = function (verbose=false) {
	this.speak(this.player.describe_current_room(this, verbose));
};

Game.prototype.find = function (np) {
	return this.player.find(np) || this.player.room.find(np);
};

Game.prototype.interpret = function (input) {
	var adhoc;
	var a;
	var verb;

	if (adhoc = _.find(this.adhocs, a => a.match(this,  input))) {
		adhoc.execute(this, input);
		return false;
	}
	
	var tokens = input.split(" ");
	var word = tokens[0];

	if (word == "quit") {
		return true;
	}

	if (word == "goto") {
		// useful when debugging
		if (tokens.length == 1) {
			this.speak("You can't do that.");
		} else if (room = this.rooms[tokens[1]]) {
			this.player.goto(room);
			this.look();
		} else {
			this.speak("No such place.");
		}
		return false;
	}

	if (a = this.player.room.has_arc(word)) {
		a.follow(this);
		return false;
	}
	
	if (arc.isDirection(word)) {
		this.speak("You can't go that way.");
		return false;
	}

	if (verb = Verbs.find(word)) {
		if (verb.isMotion) {
			if (tokens.length == 1) {
				this.speak(verb.word + " where/which way?. Try again, say a little more");
			} else {
				var arg = tokens[1];
				if (a = this.player.room.has_arc(arg)) {
					a.follow(this);
				} else if (arc.isDirection(arg)) {
					this.speak("You can't " + verb.word + " in that direction.");
				} else {
					this.speak("Makes no sense.");
				}
			}
		} else if (verb.isIntransitive()) {
			verb.execute(this);
		} else if (tokens.length == 1) {
			this.speak(verb.word + " what?. Try again, say a little more");
		} else {
			
			var arg = tokens[1];
			var noun = this.find(arg);
			if (! noun) {
				this.speak(util.pick_random(["You don't have that.",
												"I don't see any " + arg + " here"]));
			} else {
				if ( verb.selects_for(noun)) {
					// This might be a better place to put the adhoc verb
					verb.execute(this, noun);
				} else {
					this.speak("You can't " + verb.word + " that");
				} 
			}
		}
		return false;
	} 

	this.speak("You can't do that.");
	return false;
};

exports.Game = Game;
