const Arc = require("./arc.js").Arc;

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

exports.Game = Game;
