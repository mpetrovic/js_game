window.onload = function() {

	Crafty.scene('intro', function() {
		// load any global game data
		// play opening video
		// begin loading of most-used assets (playable character spritemaps, UI backrounds, etc)
		var interrupt = Crafty.e('Keyboard').bind('KeyDown', function () {
			Crafty.view('gameMenu');
		});
	});
	
	Crafty.view('gameMenu', {
		create: function() {
			// options:
			// New Game
			// Load Game
			// Settings
			// Extra
			var props = 
		},
	});
	
	Crafty.view('saveLoad', {
	});
	
	Crafty.scene('gameSettings', function() {
	});
	
	Crafty.view('combat', {
	});
	
	Crafty.view('explore', {
	});
	
	Crafty.view('userMenu', {
	});
	
	Crafty.scene('intro');
}