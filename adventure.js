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
				// useful when debugging
				if (tokens.length == 1) {
					context.speak("You can't do that.");
				} else if (room = game.rooms[tokens[1]]) {
					player.goto(room);
					context.speak(player.room.describe());
				} else {
					context.speak("No such place.");
				}
			} else if (arc = player.room.has_arc(word)) {
				arc.follow(context);
			} else if (Arc.isDirection(word)) {
				context.speak("You can't go that way.");				
			} else if (verb = Verbs.find(word)) {
				if (verb.isMotion) {
					if (tokens.length == 1) {
						context.speak(verb.word + " where/which way?. Try again, say a little more");
					} else {
						var arg = tokens[1];
						if (arc = player.room.has_arc(arg)) {
							arc.follow(context);
						} else if (Arc.isDirection(arg)) {
							context.speak("You can't " + verb.word + " in that direction.");
						} else {
							context.speak("Makes no sense.");
						}
					}
				} else if (verb.isIntransitive()) {
					verb.execute(context);
				} else if (tokens.length == 1) {
					context.speak(verb.word + " what?. Try again, say a little more");					
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
