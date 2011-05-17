(function (Crafty, document, window) {
	Crafty.c("Song", function () {
		burst: 0,
		level: 0,
		MD: 0,
		_tickCurrent: 0,
		_tickLength: 10*Crafty.getFPS(),
		type: 'red', 		// red or blue
		bps: 0				// burst per second
		
		init: function() {
		},
		
		sing: function() {
			Crafty.trigger("StartSinging", this);
			this.bind('enterframe', this.step);
		},
		
		step: function () {
			if (this._tickCurrent == 0) {
				this._tickCurrent = this._tickLength;
				Crafty.trigger('Tick', this.tick());
			}
			
			this.burst += Number.floor(this.bps/Crafty.getFPS());
			this._tickCurrent--;
		},
		
		/**
		 * This function is gonna be awful...
		 */
		compileAnimation: function () {
		}
		
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
		
		release: function() {
			this.unbind('enterframe', this.step);
			Crafty.trigger('ReleaseSong', this);
		},
	});
})(Crafty,window,window.document);