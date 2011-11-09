(function (Crafty, window, document) {
window.onload = function() {
	Crafty.init();
	if (Crafty.storage) Crafty.storage.open("ArTonelicoLunar01");
	Crafty.data.externalURL = 'http://www.guneva.net/artonelico/data.php';
	Crafty.scene('intro', function() {
		// load any global game data
		// play opening video
		// begin loading of most-used assets (playable character spritemaps, UI backrounds, etc)
		var interrupt = Crafty.e('Keyboard').bind('KeyDown', function () {
			Crafty.view('gameMenu');
			this.destroy();
		});
		
		Crafty.data.prepare('combat', 'combat.rous');
		Crafty.data.prepare('combat', 'combat.sera');
		Crafty.data.prepare('combat', 'combat.tahna');
		Crafty.data.prepare('combat', 'combat.berix');
		Crafty.data.prepare('combat', 'combat.ceyna');
		Crafty.data.prepare('combat', 'combat.hara');
		Crafty.data.prepare('combat', 'combat.kid');
		Crafty.data.prepare('combat', 'combat.nerd');
	});
	
	Crafty.view('gameMenu', {
		create: function() {
			// options:
			// New Game
			// Load Game
			// Settings
			// Extras
			var view = this,
				width = 100,
				height = (25 + 5) * 5,
				start = {w: width, h: height, x: Crafty.viewport.width/2 - width/2, y: Crafty.viewport.height - height},
				menus = "\r\n";
			menus += "	<ul class=\"menu_main\">\r\n";
			menus += "		<li id=\"continue\">Continue</li>\r\n";
			menus += "		<li id=\"new_game\">New Game</li>\r\n";
			menus += "		<li id=\"load_game\">Load Game</li>\r\n";
			menus += "		<li id=\"settings\">Settings</li>\r\n";
			menus += "		<li id=\"extras\">Extras</li>\r\n";
			menus += "	</ul>";
			
			Crafty.e("HTML Mouse")
				  .replace(menus)
				  .attr(start)
				  .attr(_element: this._element)
				  .bind('Click', function (e) {
					switch (e.target.id) {
						case 'continue':
							Crafty.storage.load('last_game', 'cache', function (data) {
								this.deactivate();
								// load game
							});
						break;
						case 'new_game':
							this.deactivate();
							Crafty.get('cutscene', 'scene_00').play();
						break;
						case 'load_game':
							Crafty.view('saveLoad', 'slideUp');
						break;
						case 'settings':
							Crafty.scene('gameSettings');
						break;
						case 'extras':
							Crafty.view('extras', 'slideUp');
						break;
					}
				  });
			
		},
	});
	
	Crafty.view('saveLoad', {
	});
	
	Crafty.scene('gameSettings', function() {
	});
	
	Crafty.view('combat', {
		create: function() {
			this.addComponent('CombatEngine Cutscene');
		},
		
		start: function() {
			this.startCombat();
		},
		
		stop: function() {
			this.endCombat();
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