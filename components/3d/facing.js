Crafty.c("Facing", {
	_facing: 0,
	_facingSettings: null,
	changed: true,
	
	init: function () {
		this._facingSettings = {};
		if (Crafty.support.setter) {
			this.__defineSetter__('facing', function(v) { this._facing = v; this.changed = true;});
			this.__defineGetter__('facing', function() { return this._facing; });
		}
		else if (Crafty.support.defineProperty) {
			Object.defineProperty(this, 'facing', { set: function(v) { this._facing = v; this.changed = true;}, get: function() { return this._facing; }, configurable:true });
		}
		else {
			this.bind("GetChanges", function () {
				if (this._facing != this.facing) {
					this._facing = this.facing;
					this.changed = true;
				}
			}
		}
		
		this.bind("PreRender", this.prerender);
	},
	
	/*
	 * Takes an object with sprites to use for different directions
	 * 0 refers to straight away from screen
	 * keywords can be used instead of degrees. Allowed keywords are:
	 * 		away
	 *		left
	 * 		right
	 *		towards
	 *		and combinations of the above. These map to cardinal directions.
	 * custom angles can be given with 'deg{angle}' syntax. IE. deg90
	 */
	Facing: function(prop) {
	},
	
	prerender: function (copy) {
	},
});