var _ = require('lodash');

function Player() {
	this.inventory=[];
	this.room=null;
	// state (hungry,thirsty, tired)?
	this.rooms_seen = {};
}

Player.prototype.has_item = function (noun) {
	return this.inventory.indexOf(noun) >= 0;
};

Player.prototype.add_item = function (noun) {
	this.inventory.push(noun);
};

Player.prototype.remove_item = function (noun) {
	var idx = this.inventory.indexOf(noun);
	if (idx >=0) {
		this.inventory.splice(idx, 1)
		return noun;
	}
};


Player.prototype.find_noun = function (np) {
	return _.find(this.inventory, n => n.match(np));
};


Player.prototype.describe_inventory = function () {
	return this.inventory.length == 0 ? 
		"You are not carrying anything" :
		"You have " + _.map(this.inventory, "description").join();
};

Player.prototype.goto = function (room) {
	if (room == null) {
		throw "Can't go to NULL";
	}
	this.room = room;
};

Player.prototype.describe_current_room = function (game, verbose=false) {
	var s = this.room.describe(game, verbose);
	this.rooms_seen[this.room.id] = true;
	return s;
};

Player.prototype.has_seen = function (room) {
	return this.rooms_seen[room.id] == true;
};

Player.prototype.nouns_in_reach = function () {
	return this.inventory.concat(this.room.contents);
};

exports.Player = Player;

