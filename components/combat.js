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
			for (var i=0; i<characters.length; i++) {
				if (characters[i].position) {
					this._allyPositions[characters[i].position] = this;
				}
			}
			
			var st = this._callbacks.onStart;
			for (i=0; i<st.length; i++) {
				st.call(this);
			}
			this.bind("EnterFrame", this.enterFrame);
			this.bind("KeyPress", this.keyPress);
		},
		
		endCombat: function() {
			
		},
		
		enterFrame: function () {
			var i=1, l=this._allyPositions.length+1;
			for (; i<l; i++) {
				if (this._allyPositions[i] && !this._allyPositions[i].isPlaying()) this._allyPositions[i].animate('idle', 0, -1);
				if (this._enemyPositions[i] && !this._enemyPositions[i].isPlaying()) this._enemyPositions[i].animate('idle', 0, -1);
			}
		},
		
		keyPress: function () {
		},
	});
})(Crafty,window,window.document);