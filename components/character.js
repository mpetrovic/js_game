Crafty.c("Character", {
	_effects: new Array(),
	equipment: new Object(),
	position: 0,
	name: '',
	_sceneImages: new Object(),
	hp: 0,		// hp and mp are the only 2 stats that won't change on stat_update
	_damageDisplay: null,
	
	init: function() {
		this.requires('Stats');
		this._equipment = {
			weapon: null,
			armor: null,
			trinket: null,
		};
		this.bind("HpChange", function (hp, targ) {
			if (hp == 0) targ.die();
		});
		
		this.bind("SaveData", function (data) {
			data.equipment = this._equipment.clone();
			data.position = this.position;
			data.name = this.name;
			data.hp = this.hp;
		});
	},
	
	statUpdate: function() {
		this.resetStats();
		for (e in this._equipment) {
			if (typeof this._equipment[e] == 'object') {
				this.merge(this._equipment[e].stats);
			}
		}
		
		for (var i=0; i<this._effects.length; i++( {
			this.merge(this._equipment[e].stats);
		}
		
		if (this.hp > this.getStat('hp')) {
			this.hp = this.getStat('hp');
		}
	},
	
	takeDamage: function (value, type) {
		// let's start with a simple reduction formula. 
		// if it sucks, i can revisit it later
		
		if (type != this.PHYS) {
			// resistances are always out of 100
			value = value*(1-this.getStat(type+this.RST));
		}
		else {
			// physical formula is what?
			value = Number.max(value - this.getStat(type),1);
		}
		
		value = value.toFixed();
		
		// display damage in a popup over the character's head
		if (this._damageDisplay)
			this._damageDisplay.addDamage(value,type);
		
		var upd_hp = this.hp - value;
		var new_prct = upd_hp/this.getStat('hp');
		var old_prct = this.hp/this.getStats('hp');
		for (var i=old_prct; i >= new_prct; i--) {
			if (i%10 == 0) {
				this.trigger("HpChange", i, this);
			}
		}
		this.hp = Number.max(upd_hp,0);
		
		// play hit animation
		this.animate("Hit", 1);
		
		// alert interface elements
		Crafty.trigger('InterfaceUpdate', this);
		
	},
	
	die: function() {
		// knock out the character
		// or
		// remove the NPC
	},
	
	applyEffect: function (new_effect) {
		if (new_effect.__c.tempeffect) {
			this.effects.push(tempeffect);
			this.statUpdate();
		}
	},
	
	createDamageReadout: function () {
		var dmgDisp = Crafty.e("Interface");
		this.attach(dmgDisp);
		if (this.has('persist')) dmgDisp.addComponent('persist');
		dmgDisp.setup(function() {
			this.reset = function() {
				this._element.innerHTML = '';
			}
			this.addDamage = function(num, type) {
				var sign = (num>0)?'+':'';
				this._element.innerHTML += '<div class="dmg '+sign+type+'">'+num+'</div>';
				this._data.counter = 15;
			}
		});
		dmgDisp.handler(function() {
			if (this._data.counter-- == 0) {
				this.reset();
			}
		});
		this._damageDisplay = dmpDisp;
	}
	
})(Crafty,window,window.document);