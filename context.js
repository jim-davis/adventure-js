function Context (game, player) {
	this.game = game;
	this.player = player;
}

Context.prototype.find = function (np) {
	return this.player.find(np) || this.player.room.find(np);
}

exports.Context = Context;
