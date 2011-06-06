(function (Crafty, document, window) {
	Crafty.c("Song", {
		burst: 0,
		level: 0,
		MD: 0,
		_tickCurrent: 0,
		_tickLength: 10*Crafty.getFPS(),
		type: 'red', 		// red or blue
		bps: 0,				// burst per second
		attack: 0,			// sum of caster attacks
		
		init: function() {
		},
		
		sing: function() {
			Crafty.trigger("StartSinging", this);
			this.bind('enterframe', this.step);
			
			return this;
		},
		
		step: function () {
			if (this._tickCurrent == 0) {
				this._tickCurrent = this._tickLength;
				Crafty.trigger('Tick', this.tick());
			}
			
			this.burst += Number.floor(this.bps/Crafty.getFPS());
			this._tickCurrent--;
		},
		
		compileIdleAnimation: function () {
		},
		
		/**
		 * This function is gonna be awful...
		 */
		compileAttackAnimation: function () {
		},
		
		levelUp: function() {
			this.level++;
		},
		
		tick: function() {
			// accumulate the effects of all upgrades
			// and send them off to the combat engine, i guess?
			
			if (this.has('Upgrade')) {
				return this.getCumulative();
			}
			return new Array();
		},
		
		stopSinging: function () {
			this.bps = 0;
			this.level = 1;
			this.burst = 0;
			return this.unbind('enterframe', this.step);
		},
		
		release: function() {
			Crafty.trigger('ReleaseSong', this);
			
			return this.stopSinging();
		},
	});
})(Crafty,window,window.document);