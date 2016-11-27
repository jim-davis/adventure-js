var _ = require('lodash');
const loader = require("./loader.js");
const readline = require('readline');
const repl = require('repl');
const Context = require("./context.js").Context;
const verbs = require("./verbs.js");
const Verbs  = require("./verb.js").Verbs;
const Arc  = require("./arc.js").Arc;
const util = require("./util.js");

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
			var word = tokens[0];
			var arc = null;
			var verb = null;
			if (word == "quit") {
				done = true;
			} else if (word == "debug") {
				rl.close();
				repl.start('A> ');
			} else if (word == "goto") {
				context.speak("Not yet implemented");
			} else if (arc = player.room.has_arc(word)) {
				game.follow(context, arc);
			} else if (Arc.isDirection(word)) {
				context.speak("You can't go that way.");				
			} else if (verb = Verbs.find(word)) {
				if (verb.isMotion) {
					// TODO: if there is second token, then
					// add code to look for an arc with that name,
					// e.g. GO WEST
					context.speak("You can't go that way.");
				} else if (verb.isIntransitive()) {
					verb.execute(context);
				} else if (tokens.length == 1) {
					context.speak(`What do you want to ${verb.word}`);
				} else {
					var arg = tokens[1];
					var noun = context.find(arg);
					if (! noun) {
						context.speak(util.pick_random(["You don't have that.",
												 "I don't see any " + arg + " here"]));
					} else {
						if ( verb.selects_for(noun)) {
							verb.execute(context, noun);
						} else {
							context.speak("You can't " + verb.word + " that");
						} 
					}
				}
			} else {
				context.speak("You can't do that.");
			}
		}
		if (done) {
			rl.close();
		}
		if (! done) {
			rl.prompt();
		} 
	});

	context.speak(player.room.describe());
	rl.prompt();
};



adventure();
