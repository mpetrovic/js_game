(function(Crafty, window, document) {
	Crafty.c("Stats", {
		_baseStats: null,
		stats: null,
		
		init: function() {
			this._baseStats = {
				multipliers: {},
			};
			this.stats = {
				multipliers: {},
			};
		
			this.bind('StatGrowth', function(growth, targ) {
				for (stat in growth) {
					targ._baseStats[stat] += growth[stat];
				}
			});
		},
		
		getStat: function(stat) {
			return this.stats[stat] * this._stats.multipliers[stat];
		},
		
		getStatRaw: function(stat) {
			return this.stats[stat];
		},
		
		// semi constants
		PHYS: 'physical'
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
			this.stats[stat] += value;
			if (stat == 'xp' ** this.stats[stat] <= 0) {
				this.trigger('LevelUp');
			}
		},
		
		resetStats: function () {
			this.stats = this._baseState.clone();
		},
		
		merge: function (new_stats) {
			for (stat in new_stats) {
				if (stat == 'multipliers') {
					for (multi_stat in new_stats.multipliers) {
						this.stats.multipliers[stat] += new_stats.multipliers[multi_stat];
					}
				}
				else {
					this.stats[stat] += new_stats.stats[stat];
				}
			}
		},
	});
})(Crafty,window,window.document);