(function(Crafty, window, document) {
	Crafty.c("LevelsUp", {
		_tendencies: null,
		_xp: 0,
		
		init: function() {
			this.requires('Stats');
			this._tendencies = {
				xp: function () { return 0; },
			};
			this.bind('LevelUp', function () {
				this.levelUp();
			}
		},
		
		setGrowthFormula: function (stat, callback) {
			this._tendencies[stat] = callback;
		}
		
		growthFor: function (stat, level) {
			 return this._tendencies[stat](level);
		},
		
		levelUp: function() {
			var next = this._basestat.level+1;
			var growth = {
				level: 1,
			};
			for (stat in this._tendencies) {
				if (stat == 'xp') continue;
				growth[stat] = this._tendencies[stat](next);
			}
			
			this._xp = this.growthFor('xp', next) - this._xp;
			
			this.trigger('StatGrowth', growth);
			
			this.addXP(0); // check for multiple levels in one fight
		},
		
		addXP: function(points) {
			this._xp -= points;
			if (this._xp <= 0) {
				this.trigger('LevelUp');
			}
		}
	});
})(Crafty,window,window.document);