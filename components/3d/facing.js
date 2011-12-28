Crafty.c("Facing", {
	_facing: 0,
	_facingSettings: null,
	changed: true,
	
	init: function () {
		this._facingSettings = [];
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
	 *		flip
	 *		and combinations of the above, delimited with " ". These map to cardinal directions.
	 * custom angles can be given with 'deg{angle}' syntax. IE. deg90
	 * using flip will tell the entity to render the opposite of the given horizontal axis
	 * that made no sense, so here's an example
	 * {
	 *	away: sprite1,
	 *	towards: sprite2,
	 *  left: sprite3,
	 *	right: flip,
	 *  left-away: sprite13,
	 *  left-towards: sprint23,
	 * }
	 * When the entity is facing to the right, it will use the sprite given in 'left' and flip it horizontally.
	 */
	Facing: function(props) {
		var i, p, angle, deg = /deg([-]?[\d\.]*)/, m, 
			d = [], last = null, mid;
		
		for (i in props) {
			p = props[i];
			switch (i) {
				case 'away':
					angle = 0;
					break;
				case 'away right':
				case 'right away':
					angle = 45;
					break;
				case 'right':
					angle = 90;
					break;
				case 'towards right':
				case 'right towards':
					angle = 135;
					break;
				case 'towards':
					angle = 180;
					break;
				case 'towards left':
				case 'left towards':
					angle = 225;
					break;
				case 'left':
					angle = 270;
					break;
				case 'away left':
				case 'left away':
					angle = 315;
					break;
				case 'flip':
					// a flag for later
					break;
				default:
					m = i.match(deg);
					angle = parseInt(m[1]);
			}
			
			d.push({angle: angle, data: p});
		}
		if (props.flip) {
			for (i in d) {
				if (d[i].angle == 0 || d[i].angle == 180) continue;
				
				d.push({angle: 360-d[i].angle, data: d[i].data, flip: true});
			}
		}
		
		d.sort(function (a, b) {
			return a.angle - b.angle;
		});
		
		this._facingSettings = d;
		return this;
	},
	
	prerender: function (copy) {
		// get the parent's Z rotation
		// get the angle difference
		// get the sprite to use
		// flip the entity if necessary
	},
});