function Context (game, player) {
	this.game = game;
	this.player = player;
}

Context.prototype.find = function (np) {
	return this.player.find(np) || this.player.room.find(np);
};

Context.prototype.speak = function (x) {
	console.log(x);
};

Context.prototype.look = function (verbose=false) {
	this.speak(this.player.describe_current_room(this, verbose));
};


exports.Context = Context;
