
/**
 #Camera
 @category 3D
 * A camera that renders a World entity and all of the 3D entities in contains.
 * The camera has a target, which is another 3D entity, and a type, which determines how the world is rendered 
 * as well as certain behaviors on the camera itself.
 */
Crafty.c('Camera', {
	active: false,
	target: null,
	type: 'overhead',
	_transforms: null,
	
	init: function () {
		this.requires('3D');
		this.target = Crafty.e('3D');
		_transforms = {};
	},
	
	Camera: function (type, parent) {
		this.type = type;
		this.setParent(parent);
		this.target.setParent(parent);
		return this;
	},
	
	/**
	 * Looks at a point or an entity. Whichever
	 */
	lookAt: function (obj) {
		this.target.attr({x: obj.x, y: obj.y, z: obj.z});
		this.changed = true;
		return this;
	},
	
	/**
	 #.zoom
	 @comp Camera
	 @sign public this.zoom(float amt)
	 @param float amt	multiplier to zoom in by
	 * Moves the camera closer to or farther from the target
	 */
	zoom: function (amt) {
		var vect = this.target.sub(this);
		this.x = this.target.x + vect.x/amt;
		this.y = this.target.y + vect.y/amt;
		this.z = this.target.z + vect.z/amt;
		this.changed = true;
		return this;
	},
	
	/**
	 * Gets all the objects in the field of view of this camera. All other objects will not be updated.
	 * Calculate a set of vectors that create the FOV box, then find all objects that intersect the box
	 * The box will be a pyramid with a nexus of the camera's location, centered on the target. 
	 * The corners of the box will extend past the hash map to ensure it hits everything.
	 */
	_getObjectsInView: function () {
		return this.parent.get('Render');
	},
	
	/**
	 * gets the vector between the camera and the target,
	 * then calculates the needed transforms to manipulate the world
	 * to give the appearance that we're rendering from the camera's view.
	 
	 * camera transforms happen in 3 steps:
	 * translate/set origin to target's coords
	 * rotate world
	 * translate so viewpoint is on camera
	 */
	_calcTransforms: function () {
		var vector = this.sub(this.target),
			trans = {}, hyp;
		
		trans.origin = {};
		trans.origin.x = this.target.x;
		trans.origin.y = this.target.y;
		trans.origin.z = this.target.z;
		trans.form = [];
		trans.form.push('translateZ(1000px)');	// move the browser's viewpoint to 0,0,0
		trans.form.push('translate3d('+(-1*this.target.x)+'px, '+(-1*this.target.y)+'px, '+(-1*this.target.z)+'px)');
		
		// figure out the x rotation based on the vector
		hyp = Math.sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z);
		trans.form.push('rotateX('+(90 + Crafty.math.radToDeg(Math.asin(vector.z/hyp)))+'deg)');
		
		// figure out the z rotation based on the vector
		// this was tricky.
		// things to remember: 
		// the angle we want to measure has the camera at 0,0. so the vector needs to be reversed.
		// the coord grid is 90 degrees from what i expected, so x and y needed to be switched.
		trans.form.push('rotateZ('+(Crafty.math.radToDeg(Math.atan2(-vector.x, -vector.y)))+'deg)');
		
		// figure out the translation needed based on the vector
		trans.form.push('translate3d('+vector.x+'px, '+vector.y+'px, '+vector.z+'px)');
		
		return trans;
	},
	
	/**
	 * For DOM:
	 * Transforms the world according to angles and positions of camera and target relative to each other
	 * For Canvas:
	 * ???????
	 * Maybe use SVG for all this?
	 * Gets a list of all the entities in viewing range and only changes them.
	 * This should be the very very very last step in an EnterFrame, to ensure all changes have been made before drawing anything
	 */
	_render: function () {
		if (!this.active) return;
		
		if (this.changed) {
			if (this.type == '3D') {
				if (Crafty.support.css3dtransform) {
					var par = this.parent.renderElement, pref = Crafty.support.prefix;
					if (typeof this.parent.renderElement == 'undefined') {
						par = this.parent.renderElement = document.createElement('div');
						par.style.transformStyle = par.style[pref+"TransformStyle"] = 'preserve-3d';
						par.style.position = 'absolute';
						par.id = "CraftyTerrain";
					}
					
					var world = document.getElementById("CraftyTerrain");
					if (world && world !== par) {
						world.parentNode.appendChild(par);
						world.parentNode.removeChild(world);
						world = par;
					}
					else if (!world) {
						par.style.top = '50%';
						par.style.left = '50%';
						Crafty.stage.elem.appendChild(par);
						Crafty.stage.elem.style.perspective = Crafty.stage.elem.style[pref+"Perspective"] = '1000';
					}
					
					var transforms = this.parent.transforms = this._calcTransforms();
					// do things with them
					// its possible to chain transforms together,
					// translateX() rotateZ() translateX() does them in that order!
					par.style.transformOrigin = par.style[pref+"TransformOrigin"] = transforms.origin.x+"px "+transforms.origin.y+"px "+transforms.origin.z+"px";
					par.style.transform = par.style[pref+"Transform"] = transforms.form.join(' ');
					
				}
				else if (Crafty.support.webgl) {
				}
				else if (Crafty.support.svg) {
				}
				else if (Crafty.support.vml) {
				}
			}
		}
		
		var objs = this._getObjectsInView();
		for (var i in objs) {
			objs[i].render(this.type);
		}
		
		this.changed = false;
	},
});
