(function (Crafty, window, document) {
window.onload = function() {

	Crafty.scene('intro', function() {
		// load any global game data
		// play opening video
		// begin loading of most-used assets (playable character spritemaps, UI backrounds, etc)
		var interrupt = Crafty.e('Keyboard').bind('KeyDown', function () {
			Crafty.view('gameMenu');
			this.destroy();
		});
	});
	
	Crafty.view('gameMenu', {
		create: function() {
			// options:
			// New Game
			// Load Game
			// Settings
			// Extras
			var width = 100;
			var height = 25;
			var start = {x: Crafty.stage.width/2 - width/2, y: Crafty.stage.height - (height + 5) * 4};
			var menus = {
				new_game: {
					name: 'New Game',
					callback: function() {
						this.deactivate();
						Crafty.get('cutscene', 'scene_00').play();
					},
				}, 
				load_game: {
					name: 'Load Game',
					callback: function() {
						Crafty.view('saveLoad', 'slideUp');
					},
				}, 
				settings: {
					name: 'Settings',
					callback: function() {
						Crafty.scene('gameSettings');
					},
				}, 
				extras: {
					name: 'Extras',
					callback: function() {
						Crafty.view('extras', 'slideUp');
					},
				}
			};
			var count = 0;
			for (var i in menus) {
				var m = menus[i];
				
				this.addButton({
					x: start.x + count * (height + 5),
					y: start.y,
					w: width,
					h: height,
					text: m.name,
					handler: m.callback,
					className: '',
				});
			}
		},
	});
	
	Crafty.view('saveLoad', {
	});
	
	Crafty.scene('gameSettings', function() {
	});
	
	Crafty.view('combat', {
		create: function() {
			this.addComponent('CombatEngine Cutscene');
		}
	});
	
	Crafty.view('explore', {
	});
	
	Crafty.view('userMenu', {
	});
	
	Crafty.view('extras', {
	});
	
	Crafty.scene('intro');
}
})(Crafty, window, window.document);