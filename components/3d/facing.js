Crafty.c("Facing", {
	_facing: 0,
	_facingSettings: null,
	using: 0,
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
			});
		}
		
		this.bind('CameraChanged', function camChange (cam) {
			if (this.isSibling(cam)) {
				this.changed = true;
			}
		});
		
		
		this.bind("PreRender", function preRender (data) {
			// get the parent's Z rotation
			// get the angle difference
			// get the sprite to use
			// flip the entity if necessary
			data.l = data.h;
			data.rX = -90;
			data.rY = 0;
			
			var trans = this.parent.transforms.form,
				i, cam = 0, diff, fs = this._facingSettings.slice(0),
				use, avg, l = fs.length;
		
			for (i in trans) {
				if (trans[i].op == 'rotateZ') {
					cam = parseInt(trans[i].val[0]);
					data.rZ = -1 * cam;
					break;
				}
			}
			
			// get a value that's always positive
			diff = (this._facing + cam + 360)%360;
			
			for (i=0; i<l; i++) {
				if (fs[i].angle == diff) {
					use = i;
				}
				// only if we loop around
				if (!(i+1 in fs)) {
					fs[i+1] = {angle: fs[0].angle+360, data: fs[0].data};
				}
				else if (fs[i].angle > fs[i+1].angle) {
					fs[i+1].angle += 360;
				}
				
				// the diff is between 2 angles, get the avg, compare and use that one
				if (fs[i].angle < diff && diff < fs[i+1].angle) {
					avg = (fs[i].angle + fs[i+1].angle)/2;
					if (avg > diff) {
						use = i;
					}
					else {
						use = i+1;
					}
					break;
				}
				fs[i+1].angle %= 360;
			}
			
			use %= l;
			
			if (this.using != use) {
				this.removeComponent(fs[this.using].data);
				this.addComponent(fs[use].data);
				this.using = use;
				if (fs[use].flip) {
					data.sX = Math.abs(data.sX)*-1;
				}
				else {
					data.sX = Math.abs(data.sX);
				}
			}
		});
		
		this.bind('RemoveComponent', function (c) {
			if (c == 'Facing') {
				this.unbind('CameraChanged', camChanged);
				this.unbind('PreRender', preRender);
				this.unbind('RemoveComponent', arguments.callee);
			}
		});
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
	 *		and combinations of the above, delimited with "_". These map to cardinal and ordinal directions.
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
				case 'away_right':
				case 'right_away':
					angle = 45;
					break;
				case 'right':
					angle = 90;
					break;
				case 'towards_right':
				case 'right_towards':
					angle = 135;
					break;
				case 'towards':
					angle = 180;
					break;
				case 'towards_left':
				case 'left_towards':
					angle = 225;
					break;
				case 'left':
					angle = 270;
					break;
				case 'away_left':
				case 'left_away':
					angle = 315;
					break;
				case 'flip':
					// a flag for later
					break;
				default:
					m = i.match(deg);
					angle = parseInt(m[1]);
			}
			
			d.push({angle: angle, data: p, flip: false});
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
	}
});