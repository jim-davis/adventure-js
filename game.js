var _ = require('lodash');
const Player = require("./player.js").Player;
const adhoc = require("./adhoc.js");
const verbs = require("./verbs.js");
const Verbs  = require("./verb.js").Verbs;
const arc  = require("./arc.js");
const Arc = arc.Arc;
const Room = require("./room.js").Room;
const util = require("./util.js");

const loader = require("./loader.js");

function Game () {
	this.clear();
}

Game.prototype.clear = function () {
	this.player = new Player();
	this.rooms = {};
	this.adhocs = [];
};

Game.prototype.load = function () {
	this.player = new Player();
	loader.create(this);
	return this;
};

Game.prototype.restart = function () {
	this.clear();
	this.load();
};

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

Game.prototype.make_room = function (id, brief, description, preposition) {
	return this.add_room(new Room(id, brief, description, preposition));
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
			null,
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

Game.prototype.find_noun = function (np) {
	return this.player.find_noun(np) || this.player.room.find_noun(np);
};

Game.prototype.tick = function () {
	_.forEach(this.player.nouns_in_reach(), n => n.tick(this));
};


Game.prototype.do_noun_with_adhoc_verb = function (input)  {
	var f =  _(this.player.nouns_in_reach())
		.map(n => n.adhoc(input))
		.filter()
		.first();
	return f && f.call(null, this, input);
};

// return true to exit
Game.prototype.interpret = function (input) {
	var adhoc;

	// Try adhoc matches first
	if (adhoc = _.find(this.adhocs, a => a.match(this,  input))) {
		adhoc.execute(this, input);
		this.tick();
		return false;
	}
	
	// not adhoc, so try to parse

	var tokens = input.split(" ");
	var word = tokens[0];
	var a;
	var verb;

	if (word == "quit") {
		return true;
	}

	// goto is a hack for debugging
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

	// arc name, e.g. north
	if (a = this.player.room.has_arc(word)) {
		a.follow(this);
		this.tick();
		return false;
	}
	
	// nouns with special verbs
	if (this.do_noun_with_adhoc_verb(input)) {
		this.tick();
		return false;
	}

	// verbs are the most generic (least easily customized) so they come last
	if (verb = Verbs.find(word)) {
		if (verb.isMotion) {	// go, walk, crawl etc
			if (tokens.length == 1) { 
				// all motion verbs need an argument
				this.speak(verb.word + " where/which way?. Try again, say a little more");
			} else {
				// and the argument must be the name of an arc
				var arg = tokens[1];
				if (a = this.player.room.has_arc(arg)) {
					a.follow(this);
					this.tick();
				} else {
					// make the error message meaningful
					if (arc.isDirection(arg)) {
						this.speak("You can't " + verb.word + " in that direction.");
					} else {
						this.speak("Makes no sense.");
					}
				}
			}
		} else {
			// all other verbs (and junk)
			if (tokens.length == 1) {
				// no arg.  So it better be intransitive
				if  (verb.isIntransitive()) {
					verb.execute(this);
					this.tick();
				} else {
					this.speak(verb.word + " what?. Try again, say a little more");
				}
			} else {
				var arg = tokens[1];
				var noun = this.find_noun(arg);
				if (! noun) {
					this.speak(util.pick_random(["You don't have that.",
												 "I don't see any " + arg + " here"]));
				} else {
					if ( verb.selects_for(noun)) {
						// This might be a better place to put the adhoc verb
						verb.execute(this, noun);
						this.tick();
					} else {
						this.speak("You can't " + verb.word + " that");
					} 
				}
			}
		}
		return false;
	} 

	// if we get here, we didn't understand the utterance
	
	if (arc.isDirection(word)) {
		this.speak("You can't go that way.");
	} else {
		this.speak("You can't do that.");
	}
	
	return false;
};

exports.Game = Game;
