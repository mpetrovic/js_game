(function(Crafty, window, document) {
	var xpTable = [];

	Crafty.c("LevelsUp", {
		_tendencies: null,
		_level: 1,
		_xp: 0,
		
		init: function() {
			this._tendencies = {
				xp: function (next) { return xpTable[next]; },
			};
			this.bind('AddXp', function (xp) {
				this._xp -= xp;
				if (this._xp <= 0) {
					this.levelUp();
				}
			});
		},
		
		setGrowthFormula: function (stat, callback) {
			this._tendencies[stat] = callback;
		}
		
		growthFor: function (stat, level) {
			 return this._tendencies[stat](level);
		},
		
		levelUp: function() {
			var next = this._level+1;
			var growth = {
				level: 1,
			};
			for (var stat in this._tendencies) {
				if (stat == 'xp') continue;
				growth[stat] = this._tendencies[stat](next);
			}
			
			// we go into this function with either a 0 or negative XP value
			// growthFor returns a positive int that we want to reduce.
			this._xp = this.growthFor('xp', next) + this._xp;
			
			this.trigger('StatGrowth', growth);
			
			if (this._xp <= 0) {
				this.levelUp();
			}
		},
	});
})(Crafty,window,window.document);