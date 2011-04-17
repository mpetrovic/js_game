Crafty.c("Character", {
	_effects: new Array(),
	_equipment: new Object(),
	_position: null,
	_name: '',
	_scene_images: new Object(),
	hp: 0,		// hp and mp are the only 2 stats that won't change
	
	init: function() {
		this.requires('Stats');
		this._equipment = {
			'weapon': null,
			'armor': null,
			'trinket': null,
		};
		this.bind("hp_change", function (hp) {
			if (hp == 0) this.die();
		});
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
		
		if (this.hp > this.get_stat('hp')) {
			this.hp = this.get_stat('hp');
		}
	},
	
	take_damage: function (value, type) {
		// let's start with a simple reduction formula. 
		// if it sucks, i can revisit it later
		
		if (type != this.PHYS) {
			// resistances are always out of 100
			value = value*(1-this.get_stat(type+this.RST));
		}
		else {
			// physical formula is what?
			value = Number.max(value - this.get_stat(type),1);
		}
		
		value = value.toFixed();
		
		// display damage in a popup over the character's head
		
		var upd_hp = this.hp - value;
		for (var i=upd_hp; i < this.hp; i++) {
			if (i%10 == 0) {
				this.trigger("hp_change", i);
			}
		}
		this.hp = upd_hp;
		
		// play hit animation
		// update ui elements
	},
	
	die: function() {
		// knock out the character
		// or
		// remove the NPC
	},
	
	apply_effect: function (new_effect) {
		
	},	
});