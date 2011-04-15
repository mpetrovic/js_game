Crafty.c("Stats", {
	_stats: new Object(),
	init: function() {
	},
	
	get_stat: function(stat) {
		return this._stats[stat] * this._stats.multipliers[stat];
	},
	
	get_stat_raw: function(stat) {
		return this._stats[stat];
	},
	
	set_stat: function(stat, value) {
		this._stats[stat] = value;
	},
	
	set_stat_multi: function (stat, multi) {
		this._stats.multipliers[stat] = multi;
	},
	
	merge: function (new_stats) {
		if (typeof new_stats._stats) == 'undefined') return;
		for (stat in new_stats._stats) {
			if (stat == 'multipliers') {
				for (multi_stat in new_stats._stats.multipliers) {
					this._stats.multipliers[stat] += new_stats._stats.multipliers[multi_stat];
				}
			}
			else {
				this._stats[stat] += new_stats._stats[stat];
			}
		}
	},
});