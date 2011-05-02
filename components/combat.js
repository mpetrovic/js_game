(function (Crafty, window, document) {
	Crafty.c("CombatEngine", {
		_allyPositions: [],
		
		_enemyPositions: [],
		
		_inCombat: false,
		
		_callbacks: {
			onStart: [],
			onVictory: [],
			onDefeat: [],
		},
		
		placeEnemies: function(enemy1, enemy2, enemy3, enemy4) {
			this._enemyPositions[1] = enemy1;
			this._enemyPositions[2] = enemy2;
			this._enemyPositions[3] = enemy3;
			this._enemyPositions[4] = enemy4;
		},
		
		startCombat: function () {
			// populate positions from character data
			var characters = Crafty('Character, persist');
			characters.each(function(i) {
				if (this.position) {
					this._allyPositions[i] = this;
				}
			});
			
			var st = this._callbacks.onStart;
			for (var i=0; i<st.length; i++) {
				st.call(this);
			}
			this.bind("EnterFrame", this.enterFrame);
			this.bind("KeyPress", this.keyPress);
		},
		
		enterFrame: function () {
		},
		
		keyPress: function () {
		},
	});
})(Crafty,window,window.document);