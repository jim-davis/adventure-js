const opposite = require ("./opposite.js");

function Room(id, brief, description) {
	this.id = id;
	this.brief = brief;
	this.description=description;
	this.arcs = {};
	this.contents = [];
}

Room.prototype.describe = function () {
	return "You are on " + this.description;
	// add nouns here
	// add list of arcs here
}

Room.prototype.add_arc = function (arc) {
	this.arcs[arc.direction]=arc;
}

Room.prototype.has_arc = function (direction) {
	return this.arcs[direction];
}

function Arc (from, to, direction, description) {
	this.from = from;
	this.to=to;
	this.direction=direction;
	this.description=description;
}

Arc.prototype.reverse_arc = function () {
	return new Arc(this.to, this.from,
			opposite.direction(this.direction), this.description);
}

function Verb () {
	// selection
	// side effects
}

function Noun (description) {
	// categories
	// state
}

function Player() {
	this.inventory=[];
	this.location=null;
	// state (hungry,thirsty, tired)?
}

function Game () {
	this.player = null;
	this.rooms = {};
}

Game.prototype.set_player = function (p) {
	this.player = p;
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
};

Game.prototype.follow = function (arc) {
	// maybe add "transition hook" on arc
	// or general game arc counter
	this.player.location = arc.to;
	console.log(this.player.location.describe());
};

Game.prototype.add_arc = function (direction, from_id, to_id, symmetric=true,hidden=false) {
	var from = this.room(from_id);
	var to = this.room(to_id);
	var arc = new Arc(from, to, direction);
	from.add_arc(arc);
	if (symmetric) {
		to.add_arc(arc.reverse_arc());
	}
};

exports.Room = Room;
exports.Arc = Arc;
exports.Verb = Verb;
exports.Noun = Noun;
exports.Player = Player;
exports.Game = Game;
