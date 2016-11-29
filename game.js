var _ = require('lodash');
const Context = require("./context.js").Context;
const Player = require("./player.js").Player;
const adhoc = require("./adhoc.js");
const verbs = require("./verbs.js");
const Verbs  = require("./verb.js").Verbs;
const Arc  = require("./arc.js").Arc;
const util = require("./util.js");

function Game () {
	this.player = new Player();
	this.rooms = {};
	this.context = new Context(this,this.player);
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

Game.prototype.add_arc = function (description, direction, from_id, to_id, symmetric=true,hidden=false) {
	var from = this.room(from_id);
	var to = this.room(to_id);
	var arc = new Arc(from, to, direction, description);
	from.add_arc(arc);
	if (symmetric) {
		to.add_arc(arc.reverse_arc());
	}
	return arc;
};

Game.prototype.when = function (regexp) {
	return new adhoc.Builder(this, regexp);
};

Game.prototype.add_adhoc = function (adhoc) {
	this.adhocs.push(adhoc);
	return adhoc;
};

Game.prototype.speak = function (s) {
	this.context.speak(s);
};

Game.prototype.interpret = function (input) {
	var adhoc;
	var arc;
	var verb;

	if (adhoc = _.find(this.adhocs, a => a.match(this.context,  input))) {
		adhoc.execute(this.context, input);
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
			this.context.player.goto(room);
			this.speak(this.player.room.describe());
		} else {
			this.speak("No such place.");
		}
		return false;
	}

	if (arc = this.player.room.has_arc(word)) {
		arc.follow(this.context);
		return false;
	}
	
	if (Arc.isDirection(word)) {
		this.speak("You can't go that way.");
		return false;
	}

	if (verb = Verbs.find(word)) {
		if (verb.isMotion) {
			if (tokens.length == 1) {
				this.speak(verb.word + " where/which way?. Try again, say a little more");
			} else {
				var arg = tokens[1];
				if (arc = this.player.room.has_arc(arg)) {
					arc.follow(this.context);
				} else if (Arc.isDirection(arg)) {
					this.speak("You can't " + verb.word + " in that direction.");
				} else {
					this.speak("Makes no sense.");
				}
			}
		} else if (verb.isIntransitive()) {
			verb.execute(this.context);
		} else if (tokens.length == 1) {
			this.speak(verb.word + " what?. Try again, say a little more");				} else {
			var arg = tokens[1];
			var noun = this.context.find(arg);
			if (! noun) {
				this.speak(util.pick_random(["You don't have that.",
												"I don't see any " + arg + " here"]));
			} else {
				if ( verb.selects_for(noun)) {
					verb.execute(this.context, noun);
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
