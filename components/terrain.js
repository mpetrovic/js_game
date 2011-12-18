/**@
 * #Terrain
 * @category 3D
 * Contains a map of of the terrain and any static or dynamic objects on it. 
 * Includes positions of things like blocking doodads, invisible triggers, etc. 
 * Should be independent of any rendering methods
 * Intended for use with 3D worlds, rather than 2D platformers.
 
 * All dimensions and positions should be a in a generic unit. The actual size of the unit could
 * be completely arbitrary, and will probably be different between games.
 * For simplicity, its best to pick a single size for the player character in units and stick with it.
 * I would suggest something big and round, like 100.
 * 
 */
Crafty.c('Terrain', {
	_objects: null,
	_floors: null,
	_walls: null,
	_hash: null,
	_cameras: null,
	
	init: function () {
		this.requires('3D');
		this._objects = [];
		this._floors = [];
		this._walls = [];
		this._cameras = {};
	},
	
	/**
	 #.get
	 @comp Terrain
	 @sign public this.get(String selector)
	 @param String selector		The entities you want from this object
	 @return Array 				An array of entities
	*/
	get: function (selector) {
		var i, j, set = true, ret = [], sel = selector.split(', '), obj;
		for (i in this._objects) {
			set = true;
			obj = this._objects[i];
			for (j in sel) {
				set = set && obj.has(sel[j]);
			}
			if (set) ret.push(obj);
		}
		return ret;
	},
	
	/**
	 #.addObject
	 @comp Terrain
	 @sign public this.addObject(Entity obj, int x, int y, int z)
	 @param Entity obj	The entity to add to the terrain
	 @param int x	Position on x axis
	 @param int y	Position on y axis
	 @param int z	Position on z axis
	 */
	addObject: function (obj, x, y, z) {
		this._objects.push(obj.requires('3D').setParent(this).attr({'x': x, 'y': y, 'z': z}));
		return this;
	},
	
	/**
	 #.addFloor
	 @comp Terrain
	 @sign public this.addFloor(int x, int y, int z, int h, int w, Sprite texture)
	 @param int x	Position of floor's origin on x axis
	 @param int y	Position on y axis
	 @param int z	Position on z axis
	 @param int h	'height' of floor. Really, its just 'other width'
	 @param int w	width of floor
	 @param Sprite texture	Pass the name of a sprite component to paint this floor with it
	 @param int tex_off_x	X Offset of the texture
	 @param int tex_off_y	Y Offset of the texture
	 
	* Adds a floor with the specified parameters to the terrain. 
	* For performance reasons, its best to use one large texture with all 
	* your detail rather than trying to layer several smaller one on top of each other
	* For non-square areas, create several smaller floor rects and offset the texture
	*
	* Floors are collision surfaces. Any mobile object will be on the highest floor without going over 
	* their own z-axis
	*/
	addFloor: function (x, y, w, l, z, texture, tex_off_x, tex_off_y) {
		var floor = Crafty.e('3D, Collides, Render, Floor, '+texture).setParent(this).attr({
			x: x,
			y: y,
			w: w,
			l: l,
			z: z
		});
		this._objects.push(floor);
		return this;
	},
	
	/**
	 #.addWall
	 @comp Terrain
	 @sign public this.addWall(int facing, int l, int h, int z, Sprite texture)
	 @param int facing	Angle for the normal of the wall to be facing. 0 points towards positive y
	 @param int l	How long the wall is
	 @param int h	How high the hall is
	 @param int z	How high up the wall is
	 @param Sprite texture	The Sprite component to paint this wall with
	 
	 * Adds a wall to the terrain.
	 * Walls should generally be smaller, and always square.
	 * For rounded surfaces, use several small walls.
	 * 
	 * Walls are collision surfaces. Mobile objects can not clip into
	 * them unless they have no_clip set. 
	 */
	addWall: function (x, y, z, facing, w, h, texture) {
		var wall = Crafty.e('3D, Collides, Render, Wall, '+texture).setParent(this).attr({
			x: x,
			y: y,
			z: z,
			w: w,
			l: h,
			z: z,
			rZ: facing,
			rX: -90,
		});
		this._objects.push(wall);
		return this;
	},
	
	addDoodad: function (x, y, z, w, l, h, texture, collides) {
		var doodad = Crafty.e('3D, Render, Doodad, '+texture).setParent(this).attr({
			x: x,
			y: y,
			z: z,
			w: w,
			l: l,
			h: h,
		});
		if (collides)
			doodad.requires('Collides');
		this._objects.push(doodad);
		return this;
	},
});

/**
 * #3D
 * @category 3D
 * An object in 3D space. Limited to boxes, cause I ain't doing meshes.
 * Coordinates and dimensions are in 'units', a generic measurement with a variable relationship to pixels
 * All transforms should be done relative to the world itself, NOT the viewport
 */
Crafty.c('3D', {
	_x: 0,	// translation
	_y: 0,
	_z: 0,
	_rX: 0,	// rotation
	_rY: 0,
	_rZ: 0,
	_sX: 1,	// scale...ation
	_sY: 1,
	_sZ: 1,
	_w: 0,	// dimension
	_l: 0,
	_h: 0,
	_alpha: 1.0,
	
	parent: null,
	origin: null,
	changed: true,
	
	init: function() {
		this.origin = {x: 0, y: 0, z: 0};
		
		// goddamn this sucks
		if (Crafty.support.setter) {
			this.__defineSetter__('x', function(v) { this._x = v; this.changed = true; this.trigger('Moved', 'x', v)});
			this.__defineSetter__('y', function(v) { this._y = v; this.changed = true; this.trigger('Moved', 'y', v)});
			this.__defineSetter__('z', function(v) { this._z = v; this.changed = true; this.trigger('Moved', 'z', v)});
			this.__defineSetter__('rX', function(v) { this._rX = v; this.changed = true; this.trigger('Moved', 'rX', v)});
			this.__defineSetter__('rY', function(v) { this._rY = v; this.changed = true; this.trigger('Moved', 'rY', v)});
			this.__defineSetter__('rZ', function(v) { this._rZ = v; this.changed = true; this.trigger('Moved', 'rZ', v)});
			this.__defineSetter__('sX', function(v) { this._sX = v; this.changed = true; this.trigger('Moved', 'sX', v)});
			this.__defineSetter__('sY', function(v) { this._sY = v; this.changed = true; this.trigger('Moved', 'sY', v)});
			this.__defineSetter__('sZ', function(v) { this._sZ = v; this.changed = true; this.trigger('Moved', 'sZ', v)});
			this.__defineSetter__('w', function(v) { this._w = v; this.changed = true; this.trigger('Moved', 'w', v)});
			this.__defineSetter__('l', function(v) { this._l = v; this.changed = true; this.trigger('Moved', 'l', v)});
			this.__defineSetter__('h', function(v) { this._h = v; this.changed = true; this.trigger('Moved', 'h', v)});
			this.__defineSetter__('alpha', function(v) { this._alpha = v; this.changed = true; this.trigger('Moved', 'alpha', v)});
			
			this.__defineGetter__('x', function() { return this._x });
			this.__defineGetter__('y', function() { return this._y });
			this.__defineGetter__('z', function() { return this._z });
			this.__defineGetter__('rX', function() { return this._rX });
			this.__defineGetter__('rY', function() { return this._rY });
			this.__defineGetter__('rZ', function() { return this._rZ });
			this.__defineGetter__('sX', function() { return this._sX });
			this.__defineGetter__('sY', function() { return this._sY });
			this.__defineGetter__('sZ', function() { return this._sZ });
			this.__defineGetter__('w', function() { return this._w });
			this.__defineGetter__('l', function() { return this._l });
			this.__defineGetter__('h', function() { return this._h });
			this.__defineGetter__('alpha', function() { return this._alpha });
		}
		else if (Crafty.support.defineProperty) {
			Object.defineProperty(this, 'x', { set: function(v) { this_x = v; this.changed = true; this.trigger('Moved', 'x', v); }, get: function() { return this._x; }, configurable:true });
			Object.defineProperty(this, 'y', { set: function(v) { this_y = v; this.changed = true; this.trigger('Moved', 'y', v); }, get: function() { return this._y; }, configurable:true });
			Object.defineProperty(this, 'z', { set: function(v) { this_z = v; this.changed = true; this.trigger('Moved', 'z', v); }, get: function() { return this._z; }, configurable:true });
			Object.defineProperty(this, 'rX', { set: function(v) { this_rX = v; this.changed = true; this.trigger('Moved', 'rX', v); }, get: function() { return this._rX; }, configurable:true });
			Object.defineProperty(this, 'rY', { set: function(v) { this_rY = v; this.changed = true; this.trigger('Moved', 'rY', v); }, get: function() { return this._rY; }, configurable:true });
			Object.defineProperty(this, 'rZ', { set: function(v) { this_rZ = v; this.changed = true; this.trigger('Moved', 'rZ', v); }, get: function() { return this._rZ; }, configurable:true });
			Object.defineProperty(this, 'sX', { set: function(v) { this_sX = v; this.changed = true; this.trigger('Moved', 'sX', v); }, get: function() { return this._sX; }, configurable:true });
			Object.defineProperty(this, 'sY', { set: function(v) { this_sY = v; this.changed = true; this.trigger('Moved', 'sY', v); }, get: function() { return this._sY; }, configurable:true });
			Object.defineProperty(this, 'sZ', { set: function(v) { this_sZ = v; this.changed = true; this.trigger('Moved', 'sZ', v); }, get: function() { return this._sZ; }, configurable:true });
			Object.defineProperty(this, 'alpha', { set: function(v) { this_alpha = v; this.changed = true; this.trigger('Moved', 'alpha', v); }, get: function() { return this._alpha; }, configurable:true });
		}
		else {
			// prerender check
			this.bind('PreRender', function (copy) {
				if (this.x != this._x) {
					this._x = this.x;
					this.changed = true;
					this.trigger('Moved', 'x', this.x);
				}
				if (this.y != this._y) {
					this._y = this.y;
					this.changed = true;
					this.trigger('Moved', 'y', this.y);
				}
				if (this.z != this._z) {
					this._z = this.z;
					this.changed = true;
					this.trigger('Moved', 'z', this.z);
				}
				if (this.rX != this._rX) {
					this._rX = this.rX;
					this.changed = true;
					this.trigger('Moved', 'rX', this.rX);
				}
				if (this.rY != this._rY) {
					this._rY = this.rY;
					this.changed = true;
					this.trigger('Moved', 'rY', this.rY);
				}
				if (this.rZ != this._rZ) {
					this._rZ = this.rZ;
					this.changed = true;
					this.trigger('Moved', 'rZ', this.rZ);
				}
				if (this.sX != this._sX) {
					this._sX = this.sX;
					this.changed = true;
					this.trigger('Moved', 'sX', this.sX);
				}
				if (this.sY != this._sY) {
					this._sY = this.sY;
					this.changed = true;
					this.trigger('Moved', 'sY', this.sY);
				}
				if (this.sZ != this._sZ) {
					this._sZ = this.sZ;
					this.changed = true;
					this.trigger('Moved', 'sZ', this.sZ);
				}
				if (this.alpha != this._alpha) {
					this._alpha = this.alpha;
					this.changed = true;
					this.trigger('Moved', 'alpha', this.alpha);
				}
			});
		}
	},
	
	/**
	 #.setParent
	 @comp 3D
	 @sign public this.setParent(Entity parent)
	 @param Entity parent	The parent this entity should follow. 
	 * Allows a parent object to pass its transforms on to children.
	 */
	setParent: function (parent) {
		this.parent = parent;
		return this;
	},
	
	/**
	 * #.sub
	 * @comp 3D
	 * @sign public this.sub(Entity point)
	 * @param Entity point	The entity to get the difference for
	 * Gets a Vector for the distance between 2 3D entities
	 */
	sub: function (point) {
		if (typeof point != 'object' || !('has' in point) || !point.has('3D')) throw "Point is not a 3D entity.";
		return Crafty.e('3D').attr({
			x: point.x - this.x,
			y: point.y - this.y,
			z: point.z - this.z
		});
	},
	
	/**
	 #.transformRelativeToSelf
	 @comp 3D
	 @sign public this.transformRelativeToSelf(Object transforms)
	 @param Object transforms	object of key => value pairs. The key is the transform property, the value is the amount
	 * A 3D object should have 2 coordinate systems to refer to. It's parent and itself. By default, we manipulate data relative to the world.
	 * This function allows entities to move using their own coordnate system.
	 */
	transformRelativeToSelf: function (transforms) {
	}
});

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

/**
 #Ramp
 @category 3D
 * Allows for actors to move up and down z-levels
 */
Crafty.c('Ramp', {
	init: function () {
		this.requires('Collision');
		
		this.bind('OnHit', this.onHit);
	},
	
	onHit: function (e) {
		// i have no idea how collision works
	}
});

/** 
 #Collides
 @category 3D
 * Adding this component to an entity will check for collision with all entities with Collides.
 * Don't bother filtering by which component to collide with. This should be handled in the onCollide
 * handler.
 */
Crafty.c('Collides', {

	init: function() {
		this.bind('EnterFrame', this._checkCollision);
	},
	
	_checkCollision: function() {
		var collide, SAT;
		if (this.has('3D') && this.parent) {
			// check the parent's HashMap then check against individual entities for collision
			
			if (collide) {
				this.trigger('OnCollide', collide, SAT);
				collide.trigger('OnCollide', this, SAT);
			}
		}
		else if (this.has('2D')) {
			// check HashMap, then individual entities
			
			if (collide) {
				this.trigger('OnCollide', collide, SAT);
				collide.trigger('OnCollide', this, SAT);
			}
		}
	},
});

/**
 #Render
 @category 3D
 * Marks an entity to be rendered.
 * All others should not be rendered at all.
 */
Crafty.c('Render', {
	_renderData: null,
	changed: true,
	
	render: function (method) {
		var copy = this.clone();
		this.trigger('PreRender', copy);
		if (!this.changed) return;
	
		if (method == '3D' && this.has('3D')) {
			if (!this.parent) throw 'No parent set for entity';
			// transform the entity
			
			if (Crafty.support.css3dtransform) {
				// css properties:
				// perspective goes on parent: 
				//		needs to be 1000 or so for Z-rotation to work right
				// camera transforms go on world element
				// 		NEEDS transform-style: preserve-3d
				//		camera Z = negative translateZ
				//		camera X and Y appear to be be positive
				// object transforms go on child elements
				//		should be straightforward
				// doodad transforms:
				//		position comes from object
				//		rotation comes from camera
				var rd = this._renderData = this._renderData || {elem: null, changed: true, transforms:{}};
				if (rd.elem == null) {
					rd.elem = document.createElement('div');
					rd.elem.style.position = 'absolute';
					rd.elem.style.top = (-copy.l/2)+'px';
					rd.elem.style.left = (-copy.w/2)+'px';
					rd.elem.style.width = copy.w+'px';
					rd.elem.style.height = copy.l+'px';
					if (this.has('Sprite')) {
						rd.elem.style.background = "url('" + this.__image + "') no-repeat -" + this.__coord[0] + "px -" + this.__coord[1] + "px";
					}
					rd.changed = true;
					this.parent.renderElement.appendChild(rd.elem);
				}
				
				if (rd.changed) {
					// calculate the transforms and put them in the transform object
					// NOTES:
					// ORDER MATTERS!
					// translate first, then rotateZ, then rotateZ/Y. 
					// default origin is w/2, h/2
					// first step is matching the element's 0,0 to the world's 0,0. This just makes things easier. 
					// this is different from the transform origin
					
					// the position will need to be offset if any rotation on X or Y has happened
					var offset = {x:0, y:0, z:0};
					if (copy.rX && copy.rY) {
						// some special math I don't know yet
					}
					else if (copy.rX || copy.rY) {
						var axis = copy.rX?'X':'Y',
							tilt = copy['r'+axis],
							compl = 90 - tilt,
							hyp = (axis=='X')?copy.l/2:copy.w/2;
						offset.z = Math.sin(Crafty.math.degToRad(tilt)) * -hyp;
						//offset[axis.toLowerCase()] = (Math.sin(Crafty.math.degToRad(tilt)) * -hyp);
					}
					rd.transforms.translate3d = (copy.x + offset.x) + 'px, ' +  (copy.y + offset.y) + 'px, ' + (copy.z + offset.z) + 'px';
					rd.transforms.rotateZ = copy.rZ+'deg';
					rd.transforms.rotateX = copy.rX+'deg';
					rd.transforms.rotateY = copy.rY+'deg';
					rd.transforms.scaleX = copy.sX;
					rd.transforms.scaleY = copy.sY;
					rd.transforms.scaleZ = copy.sZ;
					
					var str = '';
					for (var i in rd.transforms) {
						str += i+'('+rd.transforms[i]+')' ;
					}
					rd.elem.style.transform = rd.elem.style[Crafty.support.prefix + "Transform"] = str;
				}
				
			}
			else if (Crafty.support.webgl) {
				// webgl stuff
				// i have no idea what goes here
			}
		}
		else if (method == 'isometric') {
			// some trig is needed here
		}
		else {
			// assume overhead view
			// there's little difference between this view and using the standard 2D component.
			// except there should be some handling of Z levels.
		}
		
		this.changed = false;
	},
});


/**
 * Defines an entity that always faces the camera
 */
Crafty.c("Doodad", {
	init: function () {
		this.bind('PreRender', this._prerender);
	},

	_prerender: function (data) {
		data.l = data.h;
		data.rX = -90;
		data.rY = 0;
		
		var trans = this.parent.transforms.form,
			reg = /rotateZ\(([-]?[\d\.]*)deg\)/,
			i, matches;
	
		for (i in trans) {
			if (matches = reg.exec(trans[i])) {
				data.rZ = -1 * Number(matches[1]);
				break;
			}
		}
	},
});

/**
* Spatial HashMap for broad phase collision
*
* @author Louis Stowasser
*/
(function(parent) {

HashMap = function(cell) {
		this.cellsize = cell || 64;
		this.map = {};
	},
	SPACE = " ";

HashMap.prototype = {
	insert: function(obj) {
		var keys = HashMap.key(obj),
			entry = new Entry(keys,obj,this),
			x = 0,
			y, z,
			hash;
			
		//insert into all x buckets
		for(x=keys.x1;x<=keys.x2;x++) {
			//insert into all y buckets
			for(y=keys.y1;y<=keys.y2;y++) {
				// insert into all z buckets
				for (z=keys.z1;z<=keys.z2;z++) {
					hash =  x + SPACE + y + SPACE + z;
					if(!this.map[hash]) this.map[hash] = [];
					this.map[hash].push(obj);
				}
			}
		}
		
		return entry;
	},
	
	search: function(rect,filter) {
		var keys = HashMap.key(rect),
			x,y,z,
			hash,
			results = [];
			
			if(filter === undefined) filter = true; //default filter to true
		
		//search in all x buckets
		for(x=keys.x1;x<=keys.x2;x++) {
			//insert into all y buckets
			for(y=keys.y1;y<=keys.y2;y++) {
				for (z=keys.z1;z<=keys.z2;z++) {
					hash =  x + SPACE + y + SPACE + z;
					
					if(this.map[hash]) {
						results = results.concat(this.map[hash]);
					}
				}
			}
		}
		
		if(filter) {
			var obj, id, finalresult = [], found = {}, l;
			//add unique elements to lookup table with the entity ID as unique key
			for(i=0,l=results.length;i<l;i++) {
				obj = results[i];
				if(!obj) continue; //skip if deleted
				id = obj[0]; //unique ID
				
				//check if not added to hash and that actually intersects
				if(!found[id] && obj.x < rect._x + rect._w && obj._x + obj._w > rect._x &&
								 obj.y < rect._y + rect._l && obj._l + obj._y > rect._y
							  && obj.z < rect._z + rect._h && obj._z + obj._h > rect._z)
				   found[id] = results[i];
			}
			
			//loop over lookup table and copy to final array
			for(obj in found) finalresult.push(found[obj]);
			
			return finalresult;
		} else {
			return results;
		}
	},
	
	remove: function(keys,obj) {
		var x = 0, y, z, hash;
			
		if(arguments.length == 1) {
			obj = keys;
			keys = HashMap.key(obj);
		}	
		
		// search in all x buckets
		for(x=keys.x1;x<=keys.x2;x++) {
			// search into all y buckets
			for(y=keys.y1;y<=keys.y2;y++) {
				// search all z buckets
				hash = x + SPACE + y + SPACE + z;
				
				if(this.map[hash]) {
					var cell = this.map[hash], m = 0, n = cell.length;
					//loop over objs in cell and delete
					for(;m<n;m++) if(cell[m] && cell[m][0] === obj[0]) 
						cell.splice(m,1);
				}
			}
		}
	},
	
	boundaries: function() {
		var k, ent,
			hash = {
				max: {x: -Infinity, y: -Infinity},
				min: {x: Infinity, y: Infinity},
			}
			coords = {
				max: {x: -Infinity, y: -Infinity},
				min: {x: Infinity, y: Infinity},
			};
			
		for (var h in this.map) {
			if (!this.map[h].length) continue;
			
			var coord = h.split(SPACE);
			if (coord[0] >= hash.max.x) { 
				hash.max.x = coord[0];
				for (k in this.map[h]) {
					ent = this.map[h][k];
					coords.max.x = Math.max(coords.max.x, ent.x + ent.w);
				}
			}
			if (coord[0] <= hash.min.x) {
				hash.min.x = coord[0];
				for (k in this.map[h]) {
					ent = this.map[h][k];
					coords.min.x = Math.min(coords.min.x, ent.x);
				}
			}
			if (coord[1] >= hash.max.y) {
				hash.max.y = coord[1];
				for (k in this.map[h]) {
					ent = this.map[h][k];
					coords.max.y = Math.max(coords.max.y, ent.y + ent.h);
				}
			}
			if (coord[1] <= hash.min.y) {
				hash.min.y = coord[1];
				for (k in this.map[h]) {
					ent = this.map[h][k];
					coords.min.y = Math.min(coords.min.y, ent.y);
				}
			}
		}
			// At least the entire viewport should be inside boundary box 
			//(else _clamp will fail when the entities does not take up entire viewport)
		coords.min.x = Math.min(0, coords.min.x);
		coords.min.y = Math.min(0, coords.min.y);
		coords.max.x = Math.max(Crafty.viewport.width, coords.max.x);
		coords.max.y = Math.max(Crafty.viewport.height, coords.max.y);
		
		return coords;
	},
};

HashMap.key = function(obj) {
	if (obj.hasOwnProperty('mbr')) {
		obj = obj.mbr();
	}
	var x1 = Math.floor(obj._x / cellsize),
		y1 = Math.floor(obj._y / cellsize),
		z1 = Math.floor(obj._z / cellsize),
		x2 = Math.floor((obj._w + obj._x) / cellsize),
		y2 = Math.floor((obj._l + obj._y) / cellsize);
		z2 = Math.floor((obj._h + obj._z) / cellsize);
	return {x1: x1, y1: y1, z1: z1, x2: x2, y2: y2, z2: z2};
};

HashMap.hash = function(keys) {
	return keys.x1 + SPACE + keys.y1 + SPACE + keys.z1 + SPACE + keys.x2 + SPACE + keys.y2 + SPACE + keys.z2;
};

function Entry(keys,obj,map) {
	this.keys = keys;
	this.map = map;
	this.obj = obj;
}

Entry.prototype = {
	update: function(rect) {
		//check if buckets change
		if(HashMap.hash(HashMap.key(rect)) != HashMap.hash(this.keys)) {
			this.map.remove(this.keys, this.obj);
			var e = this.map.insert(this.obj);
			this.keys = e.keys;
		}
	}
};

parent.HashMap3d = HashMap;
})(Crafty);