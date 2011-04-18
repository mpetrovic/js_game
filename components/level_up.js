(function(Crafty, window, document) {
	Crafty.c("LevelsUp", {
		_tendencies: {
			hp: function () { return 0; },
			mp: function () { return 0; },
			atk: function () { return 0; },
			def: function () { return 0; },
		},
		
		init: function() {
			this.requires("Character");
			this.bind('levelup', function () {
				this.level_up();
			}
		},
		
		growth_for: function (stat, level) {
			 return this._tendencies[stat](level);
		},
		
		level_up: function() {
			var next = this._basestat.level+1;
			this.set_stat('hp', this.growth_for('hp', next));
			this.set_stat('mp', this.growth_for('mp', next));
			this.set_stat('atk', this.growth_for('atk', next));
			this.set_stat('def', this.growth_for('def', next));
		}
	});
});