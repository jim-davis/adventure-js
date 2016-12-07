var _ = require('lodash');
const readline = require('readline');
const repl = require('repl');
const Game = require("./game.js").Game;

function adventure() {
	interaction_loop(new Game().load());
}

function interaction_loop (game) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.setPrompt('> ');

	rl.on('line', (input) => {
		input=input.trim();
		var done = false;
		if (input.length > 0) {
			done = game.interpret(input);
		}
		if (done) {
			rl.close();
		} else {
			rl.prompt();
		}
	});

	game.look();
	rl.prompt();
};

adventure();
