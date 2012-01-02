(function (Crafty, window, document) {
	Crafty.c("CombatEngine", {
		_allyPositions: null,
		
		_enemyPositions: null,
		
		_inCombat: false,
		
		_callbacks: null,
		_uiElements: null,
		
		// Every 10 seconds, the passage resets. The indicators are rebuilt and reset to 0,
		// and the song will evolve at this point. Players can push how long this passage time is out.
		// There needs to be a reason to do so.
		_passiveMaximum: 0*Crafty.timer.getFPS(),
		_passageLeft: 0,
		_indicatorsMaximum: null,
		_indicatorsCurrent: null,
		
		_currentSong: null,
		
		init: function () {
			this.requires('Controls');
			this._allyPositions = [];
			this._enemyPositions = [];
			
			this._callbacks = {
				onStart: [],
				onVictory: [],
				onDefeat: [],
			};
			this._uiElements = {};
			
			this._indicatorsMaximum = {
				harmonics: 0,
				rage: 0,
				synchro: 0,
				defend: 0,
			};
			this._indicatorsCurrent = {
				harmonics: 0,
				rage: 0,
				synchro: 0,
				defend: 0,
			};
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
				var pos = characters[i].position;
				if (pos) {
					this._allyPositions[pos] = characters[i];
					if (this._uiElements.allyPosition[pos] == null) {
						var new_elem = Crafty.e("Interface");
						
						new_elem.setup(characterHealthSetup, characters[i]);
						
						new_elem.addHandler(characterHealthHandler);
						this._uiElements.allyPosition[pos] = new_elem;
					}
					else {
						this._uiElements.allyPosition[pos].setData('character', characters[i]);
					}
				}
			}
			this.allyPositions[1]._partner = this._allyPositions[3];
			this.allyPositions[2]._partner = this._allyPositions[4];
			this.allyPositions[3]._partner = this._allyPositions[1];
			this.allyPositions[4]._partner = this._allyPositions[2];
			
			var st = this._callbacks.onStart;
			for (i=0; i<st.length; i++) {
				st.call(this);
			}
			this.bind("EnterFrame", this.enterFrame);
			this.bind("KeyDown", this.keyPress);
			this.bind('StartSinging', this.songStart);
			this.bind('ReleaseSong', this.releaseSong);
			this.bind('Tick', this.handleTicks);
			this.trigger('CombatStart');
		},
		
		endCombat: function() {
			this.unbind("EnterFrame", this.enterFrame);
			this.unbind("KeyDown", this.keyPress);
			this.unbind('StartSinging', this.songStart);
			this.unbind('ReleaseSong', this.releaseSong);
			this.unbind('Tick', this.handleTicks);
		},
		
		songStart: function(song) {
			var old_song = this._currentSong, 
				reyv1 = this._allyPositions[3], 
				reyv2 = this._allyPositions[4];
		
			this._currentSong = song;
			this._currentSong.attr({
				attack: reyv1.attr('attack') + reyv2.attr('attack'),
				burst: old_song.attr('burst') * (((reyv1.attr('burstReduc') + reyv2.attr('burstReduc'))/2)/100),
				bps: old_song.attr('bps'),
			}).sing();
			old_song.stopSinging();
			// draw song graphics
		},
		
		releaseSong: function(song) {
			// play and handle attack animation
			
			// apply song effects
			
			this._currentSong = null;
		},
		
		handleTicks: function (tickStuff) {
		},
		
		enterFrame: function () {
			var i=1, l=this._allyPositions.length+1;
			for (; i<l; i++) {
				if (this._allyPositions[i] && !this._allyPositions[i].isPlaying()) this._allyPositions[i].animate('idle', 1, -1);
				if (this._enemyPositions[i] && !this._enemyPositions[i].isPlaying()) this._enemyPositions[i].animate('idle', 1, -1);
			}
		},
		
		keyPress: function (e) {
			var dir_mod = -1;
			if (this.isDown('LEFT_ARROW')) {
				dir_mod = 0;
			}
			else if (this.isDown('UP_ARROW')) {
				dir_mod = 1;
			}
			else if (this.isDown('RIGHT_ARROW')) {
				dir_mod = 2;
			}
			else if (this.isDown('DOWN_ARROW')) {
				dir_mod = 3;
			}
			
			if (e.key == 65 || e.key == 83) {
				// vanguard is attacking			
				// figure out a target based on the current targeting scheme.
				// default scheme is highest absolute health.
			
				if (dir_mod == -1) dir_mod = 0;
				var target = null;	
			}
			switch (e.key) {
				case Crafty.keys.A:
					// back vanguard action
					this._allyPosition[1].attack(dir_mod, target);
				break;
				case Crafty.keys.S:
					// front vanguard action
					this._allyPosition[2].attack(dir_mod, target);
				break;
				case Crafty.keys.D:
					// song action
					if (this._currentSong == null || dir_mod != -1) {
						this.switchSong(dir_mod);
					}
					else {
						this._currentSong.release();
					}
				break;
				case Crafty.keys.W:
					// options screen
				break;
				default:
					// do nothing. stop pressing random keys!
				break;
			}
		},
	});
	
	// utility functions
	function characterHealthSetup() {
		this._data.character = arguments[0];
		this._element.innerHTML = '<div class="interface_header">'+this._data.character.name+'</div>';
		this._element.innerHTML += '<div class="interface_hp_num">'+this._data.character.hp+'/'+this._data.character.getStat('hp')+'</div>';
		this._element.innerHTML += '<div class="interface_hp_bar"><div width="'+((this._data.character.hp/this._data.character.getStat('hp'))*100)+'%"></div><div class="interface_hp_diff"></div></div>';
		this._data.number = this.getFirstOfClass('interface_hp_num');
		this._data.bar = this.getFirstOfClass('interface_hp_bar').getChildAt(0);
		this._data.diff = this.getFirstOfClass('interface_hp_bar').getChildAt(1);
		this._data.counter = 0;
	}
	
	function characterHealthHandler() {
		// if the HP in hp_num isn't equal to the actual HP, we're reducing still. 
		var ui_hp = this._data.number.innerHTML.split('/')[0];
		this._data.counter--;
		if (ui_hp != this._data.character.hp) {
			if (this._data.reduceByFrame == 0) {
				// this is the first time the hp bar is being updated since the diff bar went away
				this._data.reduceByFrame = Math.abs(this._data.character.hp - ui_hp)/(Crafty.FPS * 1.5);	// 1.5 seconds to bring the bar down
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
			var bar = Crafty.getHueScale('#0000FF', '#FF0000', new_prct/100);
			this._data.bar.style.backgroundColor = 'rgb('+bar[0]+','+bar[1]+','+bar[2]+')';
			this._data.diff.style.width = (parseInt(this._data.diff.style.width)+diff)+'%';
			this._data.counter = Crafty.FPS*0.5; 	// number of frames diff bar is visible
		}
		else {
			this._data.reduceByFrame = 0;
			if (this._data.counter == 0) {
				this._data.diff.style.backgroundColor = "transparent";
				this._data.diff.style.width = "0%";
			}
		}
	}
	
	function characterHealthReset() {
		this._data.counter = 0;
		this._data.number.innerHTML = this._data.character.hp+'/'+this._data.character.getStat('hp');
		this._data.bar.style.width = ((this._data.character.hp/this._data.character.getStat('hp'))*100)+'%';
	}
	
	/* color conversion functions
	 * 	I want to animate the hue, which is difficult with RGB
	 * 	Taken from:
	 * 	http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	 */
	Crafty.extend({	
		getRGB: function (hex) {
			var hex = (hex.charAt(0) === '#') ? hex.substr(1) : hex,
				c = [], result;

			c[0] = parseInt(hex.substr(0, 2), 16);
			c[1] = parseInt(hex.substr(2, 2), 16);
			c[2] = parseInt(hex.substr(4, 2), 16);

			return c;
		},
		/**
		 * Converts an RGB color value to HSV. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
		 * Assumes r, g, and b are contained in the set [0, 255] and
		 * returns h, s, and v in the set [0, 1].
		 *
		 * @param   Number  r       The red color value
		 * @param   Number  g       The green color value
		 * @param   Number  b       The blue color value
		 * @return  Array           The HSV representation
		 */
		rgbToHsv: function (r, g, b){
			if (arguments.length == 1) {
				var color = new Array();
				if (typeof arguments[0] == 'string') {
					color = Crafty.getRGB(r);
				}
				else if (typeof arguments[0] == 'array') {
					color = r;
				}
				r = color[0];
				g = color[1];
				b = color[2];
			}
		
			r = r/255, g = g/255, b = b/255;
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h, s, v = max;

			var d = max - min;
			s = max == 0 ? 0 : d / max;

			if(max == min){
				h = 0; // achromatic
			}else{
				switch(max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}

			return [h, s, v];
		},

		/**
		 * Converts an HSV color value to RGB. Conversion formula
		 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
		 * Assumes h, s, and v are contained in the set [0, 1] and
		 * returns r, g, and b in the set [0, 255].
		 *
		 * @param   Number  h       The hue
		 * @param   Number  s       The saturation
		 * @param   Number  v       The value
		 * @return  Array           The RGB representation
		 */
		hsvToRgb: function (h, s, v){
			var r, g, b;

			var i = Math.floor(h * 6);
			var f = h * 6 - i;
			var p = v * (1 - s);
			var q = v * (1 - f * s);
			var t = v * (1 - (1 - f) * s);

			switch(i % 6){
				case 0: r = v, g = t, b = p; break;
				case 1: r = q, g = v, b = p; break;
				case 2: r = p, g = v, b = t; break;
				case 3: r = p, g = q, b = v; break;
				case 4: r = t, g = p, b = v; break;
				case 5: r = v, g = p, b = q; break;
			}

			return [r * 255, g * 255, b * 255];
		},
		
		/**
		 * Takes 2 RGB values and a position between them
		 * and returns the RGB for that position.
		 */
		getHueScale: function(start, finish, percent) {
			start = Crafty.rgbToHsv(Crafty.getRGB(start));
			finish = Crafty.rgbToHsv(Crafty.getRGB(finish));
			if (percent > 1) {
				percent = percent/100;
			}
			var diff = finish[0] - start[0];
			var offset = diff * percent;
			var ret = hsvToRgb(start[0] + (finish[0]-start[0])*percent, start[1] + (finish[1]-start[1])*percent, start[2] + (finish[2]-start[2])*percent);
			
			return ret;
		},

	});
	
})(Crafty,window,window.document);