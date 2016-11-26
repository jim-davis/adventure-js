const readline = require('readline');
const repl = require('repl');

exports.interaction_loop = (game) => {
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
				var a = game.player.location.has_arc(verb);
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

	console.log(game.player.location.describe());
	rl.prompt();
};
