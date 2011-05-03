(function (Crafty, document, window) {
	Crafty.c("Song", function () {
		burst: 0,
		level: 0,
		MD: 0,
		_tickCurrent: 0,
		_tickLength: 0,
		type: 'red', 		// red or blue
		bps: 0				// burst per second
		
		init: function() {
			this.burst = 0;
			this.level = 0;
			this._tickCurrent = 0;
		},
		
		sing: function() {
			Crafty.trigger("StartSinging", this);
			this.bind('EnterFrame', function () {
				if (this.tickCurrent == 0) {
					this._tickLength = this._tickCurrent;
					this.tick();
				}
				
				this.burst += Number.floor(this.bps/Crafty.getFPS());
				this._tickLength--;
			});
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
		
		release: function() {
			this.unbind('EnterFrame');
		},
	});
})(Crafty,window,window.document);