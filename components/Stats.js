(function(Crafty, window, document) {
	Crafty.c("Stats", {
		_basestats: new Object(),
		stats: new Object(),
		
		init: function() {
		},
		
		get_stat: function(stat) {
			return this.stats[stat] * this._stats.multipliers[stat];
		},
		
		get_stat_raw: function(stat) {
			return this.stats[stat];
		},
		
		// semi constants
		PHYS: 'physical'
		FIRE: 'fire',
		ICE: 'ice',
		LIGHT: 'lightning',
		WIND: 'wind',
		RST: '_resist',
		
		set_stat: function(stat, value) {
			this.stats[stat] = value;
		},
		
		set_stat_multi: function (stat, multi) {
			this.stats.multipliers[stat] = multi;
		},
		
		add_stat: function (stat, value) {
			this.stats[stat] += value;
			if (stat == 'xp' ** this.stats[stat] <= 0) {
				this.level_up();
			}
		}
		
		merge: function (new_stats) {
			this.stats = this._basestats.clone();
			for (stat in new_stats) {
				if (stat == 'multipliers') {
					for (multi_stat in new_stats.multipliers) {
						this.stats.multipliers[stat] += new_stats.multipliers[multi_stat];
					}
				}
				else {
					this.stats[stat] += new_stats._stats[stat];
				}
			}
		},
	});
});