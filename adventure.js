const loader = require("./loader.js");
const readline = require('readline');
const repl = require('repl');
const Context = require("./context.js").Context;

function adventure() {
	interaction_loop(loader.create());
}


function interaction_loop ([game, player]) {
	const context = new Context(game, player);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.setPrompt('> ');

	rl.on('line', (input) => {
		input=input.trim();
		var done = false;
		if (input.length > 0) {
			var tokens = input.split(" ");
			var verb = tokens[0];
			switch(verb) {
			case "quit":
				done = true;
				break;
			case "debug":
				rl.close();
				repl.start('A> ');
				break;
			case "invent":
				console.log("You are not carrying anything");
				break;
			default:
				var a = player.location.has_arc(verb);
				if (a) {
					game.follow(a);
				} else {
					console.log(`${verb}`);
				}

				// if it looks like a direction: "you cant go that way"
			}
		}
		if (done) {
			rl.close();
		}
		if (! done) {
			rl.prompt();
		} 
	});

	console.log(player.location.describe());
	rl.prompt();
};

adventure();

