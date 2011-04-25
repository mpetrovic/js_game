(function (Crafty, document, window) {
	Crafty.c("Vanguard", function() {
		attackGauge: 0,			// in frames
		attackGaugeMax: 100,	// also in frames
		_attackGaugeIncrease: 0	// amount the gauge increases per frame
		_attackGaugeIncreaseBase: 0	// default amount
		
		_attacks: null,			// every attack has an array
								// each key is a frame number with a value of true.
								// why key? Because javascript makes finding a value in an array difficult.
		
		_currentAttack: false,
		_target: false,
		
		init: function() {
			this.attacks = {};
			
			// enterFrame handler
			this.bind("enterFrame", function () {
				if (this._currentAttack) {
				
					var data = this._frame;
					var attack = this._attacks[this._currentAttack];
					
					if (typeof data == 'object') {
						if (attack.hits[data.frame]) {
							// each attack can hit multiple times.
							// either for elemental damage or for Hits++
							var hits = this.getAttackDamage();
							for (var i=0; i<hits.length; i++) {
								this._target.takeDamage(hits[i].amount, hits[i].type);
							}
						}
					}
				}
				else {
					// we're not attacking. add to attackGauge.
					this.attackGauge += this._attackGaugeIncrease;
				}
			});
			
			// AnimationEnd handler
			this.bind("AnimationEnd", function() {
				this._currentAttack = false;
				this._target = false;
			});
		},
		
		attack: function(atkName, target) {
			if (!(atkName in this._attack)) return;
			
			this._currentAttack = atkName;
			this._target = target;
			if (this.has('SpriteAnimation')) {
				this.animate(atkName, this._attacks[atkName].length);
			}
		},
	});
});