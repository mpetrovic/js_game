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
		_uiElements: {},
		
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
					this._allyPositions[characters[i].position] = characters[i];
					var new_elem = Crafty.e("Interface");
					
					new_elem.setup(function() {
						this._data.character = arguments[0];
						this._element.innerHTML = '<div class="interface_header">'+this._data.character.name+'</div>';
						this._element.innerHTML += '<div class="interface_hp_num">'+this._data.character.hp+'/'+this._data.character.getStat('hp')+'</div>';
						this._element.innerHTML += '<div class="interface_hp_bar"><div width="'+((this._data.character.hp/this._data.character.getStat('hp'))*100)+'%"></div><div class="interface_hp_diff"></div></div>';
						this._data.number = this.getFirstOfClass('interface_hp_num');
						this._data.bar = this.getFirstOfClass('interface_hp_bar').getChildAt(0);
						this._data.diff = this.getFirstOfClass('interface_hp_bar').getChildAt(1);
						this._data.counter = 0;
						
					}, characters[i]);
					
					new_elem.addHandler(function() {
						// if the HP in hp_num isn't equal to the actual HP, we're reducing still. 
						var ui_hp = this._data.number.innerHTML.split('/')[0];
						this._data.counter--;
						if (ui_hp != this._data.character.hp) {
							if (this._data.reduceByFrame == 0) {
								// this is the first time the hp bar is being updated since the diff bar went away
								this._data.reduceByFrame = Math.abs(this._data.character.hp - ui_hp)/15;	// 15 frames to bring the bar down
							}
							if (ui_hp > this._data.character.hp) {
								// dmg taken
								ui_hp -= this._data.reducePerFrame;
								this._data.diff.style.backgroundColor = "#FF0000";
							}
							else if (ui_hp < this._data.character.hp) {
								// healing
								ui_hp += this._data.reducePerFrame;
								this._data.diff.style.backgroundColor = "#00FF33";
							}
							this._data.number.innerHTML = ui_hp+'/'+this._data.character.getStat('hp');
							var old_prct = parseInt(this._data.bar.style.width);
							var new_prct = (ui_hp/this._data.character.getStat('hp'))*100;
							var diff = Math.abs(old_prct - new_prct);
							this._data.bar.style.width = new_prct+'%';
							this._data.diff.style.width = (parseInt(this._data.diff.style.width)+diff)+'%';
							this._data.counter = 25; 	// number of frames diff bar is visible
						}
						else {
							if (this._data.counter == 0) {
								this._data.diff.style.backgroundColor = "transparent";
								this._data.diff.style.width = "0%";
								this._data.reduceByFrame = 0;
							}
						}
					});
					this._uiElements.allyPosition[i] = new_elem;
				}
			}
			
			var st = this._callbacks.onStart;
			for (i=0; i<st.length; i++) {
				st.call(this);
			}
			this.bind("enterFrame", this.enterFrame);
			this.bind("KeyPress", this.keyPress);
		},
		
		endCombat: function() {
			this.unbind("enterFrame", this.enterFrame);
			this.unbind("KeyPress", this.keyPress);
		},
		
		enterFrame: function () {
			var i=1, l=this._allyPositions.length+1;
			for (; i<l; i++) {
				if (this._allyPositions[i] && !this._allyPositions[i].isPlaying()) this._allyPositions[i].animate('idle', 1, -1);
				if (this._enemyPositions[i] && !this._enemyPositions[i].isPlaying()) this._enemyPositions[i].animate('idle', 1, -1);
			}
		},
		
		keyPress: function () {
		},
	});
})(Crafty,window,window.document);