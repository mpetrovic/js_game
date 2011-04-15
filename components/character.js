Crafty.c("Character", {
	_effects: new Array(),
	_equipment: new Object(),
	_position: null,
	_name: '',
	_scene_images: new Object(),
	
	init: function() {
		this.requires('Stats');
		this._equipment = {
			'weapon': null,
			'armor': null,
			'trinket': null,
		};
	},
	
	stat_update: function() {
		for (e in this._equipment) {
			if (typeof this._equipment[e] == 'object') {
				this.merge(this._equipment[e].stats);
			}
		}
		
		for (var i=0; i<this._effects.length; i++( {
			this.merge(this._equipment[e].stats);
		}
	},
	
	take_damage: function (value, type) {
		
	},
	
	
});