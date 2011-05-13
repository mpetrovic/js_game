(function (Crafty, document, window) {
	Crafty.c("Vanguard", {
		attackGauge: 0,					// in frames
		attackGaugeMax: 100,			// also in frames
		_attackGaugeIncrease: 0,		// amount the gauge increases per frame
		_attackGaugeIncreaseBase: 0,	// default amount
		attackGaugeLevel: 1,
		attackGaugeLevelMax: 1,
		
		_attacks: null,			// every attack has an array
								// each key is a frame number with a value of true.
								// why key? Because javascript makes finding a value in an array difficult.
		
		_currentAttack: false,
		_target: false,
		
		init: function() {
			this.requires('Character');
			
			this._attacks = {};
			
			// enterFrame handler
			this.bind("enterFrame", function () {
			});
			
			// AnimationEnd handler
			// the attack is over. reset attack related vars
			this.bind("AnimationEnd", function() {
				this._currentAttack = false;
				this._target = false;
				this._num_hits = {};
			});
			
			this.bind('CombatStart', this.setupForCombat);
		},
		
		setupForCombat: function() {
			this.bind("enterframe", this.combatFrame);
			this.bind("TakeDamage", this.gaugeFromDamage);
		},
		
		combatFrame: function() {
			if (this._currentAttack) {
			
				var data = this._frame;
				var attack = this._attacks[this._currentAttack];
				
				if (typeof data == 'object') {
					if (attack.hits[data.frame]) {
						// each attack can hit multiple times.
						// either for elemental damage or for Hits++
						
						var hits = this.getAttackDamages();
						this._target.createDamageReadout();
						for (var i=0; i<hits.length; i++) {
							this._target.takeDamage(hits[i].amount, hits[i].type);
						}
					}
				}
			}
			else {
				// we're not attacking. add to attackGauge.
				if (this.attackGaugeLevel != this.attackGaugeLevelMax) {
					this.attackGauge += this._attackGaugeIncrease;
					if (this.attackGauge >= this.attackGaugeMax) {
						this.attackGaugeLevel++;
						this.attackGauge -= this.attackGaugeMax;
					}
				}
			}
		},
		
		gaugeFromDamage: function(unit, value, type) {
			if (unit != this) continue;
			
			this.b
		},
		
		/**
		 * atkType is 0-3. They correspond to cardinal directions, starting with left.
		 *      1
		 *    0   2
		 *      3
		 */
		attack: function(atkType, target) {
			var atkName = '';
			switch (atkType) {
				case 1: 
					atkName = 'harmo';
				break;
				case 2:
					atkName = 'defend';
				break;
				case 3:
					atkName = 'syncro';
				break;
				case 0:
				default:
					atkName = 'burst';
				break;
			}
			atkName += this.attackGaugeLevel;
		
			if (!(atkName in this._attack)) return;
			
			this._currentAttack = atkName;
			this._target = target;
			
			// calculate damage now so we don't do it on every frame. 
			
			var attackDamage = this.getStat('attack');
			attackDamage = Math.round(attackDamage*0.75 + Math.random()*(attackDamage*0.5));
			
			// calculate damage here so it's consistent across an attack
			
			if (this.has('SpriteAnimation')) {
				this.animate(atkName, 1);
			}
			// cue up markers on the block gauge
			
			this.attackGaugeLevel = 1;
			this.attackGauge = 0;
		},
		
		getAttackHits: function(damage) {
			
			var attack = this.getStat('attack');
			var damage = attack; // apply a function here
			var damage = new Array();
			
			var types = {};
			types[this.PHYS] = this.getStat('numHits');
			types[this.FIRE] = this.getStat('fireDmg');
			types[this.ICE] = this.getStat('iceDmg');
			types[this.LIGHT] = this.getStat('lightDmg');
			types[this.WIND] = this.getStat('windDmg');
			
			for (type in types) {
				// these values should be integers. We divide by 5 to get the % of total attack damage these things do
				
			}
		},
	});
})(Crafty,window,window.document);