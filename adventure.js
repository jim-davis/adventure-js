var _ = require('lodash');
const loader = require("./loader.js");
const readline = require('readline');
const repl = require('repl');

function adventure() {
	interaction_loop(loader.create());
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

	game.context.look();
	rl.prompt();
};

adventure();
