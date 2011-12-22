(function(Crafty, window, document) {
	Crafty.c("Stats", {
		_baseStats: null,
		_adjustedStats: null,
		_isResetting: false,
		
		init: function() {
			this._baseStats = {
				multipliers: {},
			};
			this._adjustedStats = {
				multipliers: {},
			};
		
			this.bind('StatGrowth', function(growth, targ) {
				for (var stat in growth) {
					targ._baseStats[stat] += growth[stat];
				}
			});
		},
		
		getStat: function(stat) {
			this._isResetting = false;
			return this._adjustedStats[stat] * this._adjustedStats.multipliers[stat];
		},
		
		getStatRaw: function(stat) {
			this._isResetting = false;
			return this._adjustedStats[stat];
		},
		
		// semi constants
		PHYS: 'physical',
		FIRE: 'fire',
		ICE: 'ice',
		LIGHT: 'lightning',
		WIND: 'wind',
		RST: '_resist',
		
		// the only time i should be calling this is on level up
		setStat: function(stat, value) {
			this._baseStats[stat] = value;
		},
		
		addStat: function (stat, value) {
			this._adjustedStats[stat] += value;
			if (stat == 'xp' && this._adjustedStats[stat] <= 0) {
				this.trigger('LevelUp');
			}
		},
		
		resetStats: function () {
			this._adjustedStats = this._baseStats.clone();
			this._isResetting = true;
		},
		
		merge: function (new_stats) {
			if (!this._isResetting) {
				this.resetStats();
			}
			for (var stat in new_stats) {
				if (stat == 'multipliers') {
					for (multi_stat in new_stats.multipliers) {
						this._adjustedStats.multipliers[stat] += new_stats.multipliers[multi_stat];
					}
				}
				else {
					this._adjustedStats[stat] += new_stats._adjustedStats[stat];
				}
			}
			this._isResetting = true;
		},
	});
})(Crafty,window,window.document);