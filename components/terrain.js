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
	addFloor: function (x, y, w, h, z, texture, tex_off_x, tex_off_y) {
		var floor = Crafty.e('3D, Collides, Render, Floor, '+texture).setParent(this).attr({
			x: x,
			y: y,
			w: w,
			h: h,
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
			h: h,
			z: z,
			rZ: facing,
			rX: 90,
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
		this._objects.push();
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
	x: 0,	// translation
	y: 0,
	z: 0,
	rX: 0,	// rotation
	rY: 0,
	rZ: 0,
	sX: 1,	// scale...ation
	sY: 1,
	sZ: 1,
	w: 0,	// dimension
	l: 0,
	h: 0,
	parent: null,
	origin: null,
	
	init: function() {
		this.origin = {x: 0, y: 0, z: 0};
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
		if (type == '3D' && (!Crafty.support.css3dtransform && !Crafty.support.webgl)) {
			this.type = 'overhead';
		}
		return this;
	},
	
	/**
	 * Looks at a point or an entity. Whichever
	 */
	lookAt: function (obj) {
		this.target.attr({x: obj.x, y: obj.y, z: obj.z});
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
			trans = {};
		
		trans.origin = {};
		trans.origin.x = this.target.x;
		trans.origin.y = this.target.y;
		trans.origin.z = this.target.z;
		trans.form = [];
		trans.form.push('translateZ(1000px)');	// move the browser's viewpoint to 0,0,0
		trans.form.push('translate3d('+this.target.x+'px, '+this.target.y+'px, '+(-this.target.z)+'px)');
		
		// figure out the x rotation based on the vector
		hyp = Math.sqrt(vector.x*vector.x + vector.y*vector.y + vector.z*vector.z);
		trans.form.push('rotateX('+(90 + Crafty.math.radToDeg(Math.asin(vector.z/hyp)))+'deg)');
		
		// figure out the z rotation based on the vector
		hyp = Math.sqrt(vector.x*vector.x + vector.y*vector.y);
		trans.form.push('rotateZ('+(Crafty.math.radToDeg(Math.atan2(vector.y, vector.x) - Math.atan2(hyp, 0))-90)+'deg)');
		
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
				
				var transforms = this._calcTransforms();
				// do things with them
				// its possible to chain transforms together,
				// translateX() rotateZ() translateX() does them in that order!
				par.style.transformOrigin = par.style[pref+"TransformOrigin"] = transforms.origin.x+"px "+transforms.origin.y+"px "+transforms.origin.z+"px";
				par.style.transform = par.style[pref+"Transform"] = transforms.form.join(' ');
				
				var objs = this._getObjectsInView();
				for (var i in objs) {
					objs[i].render(this.type);
				}
			}
		}
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
	
	render: function (method) {
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
					rd.elem.style.top = '0px';
					rd.elem.style.left = '0px';
					rd.elem.style.width = this.w+'px';
					rd.elem.style.height = this.h+'px';
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
					if (this.rX && this.rY) {
						// some special math I don't know yet
					}
					else if (this.rX || this.rY) {
						var axis = this.rX?'X':'Y',
							tilt = this['r'+axis],
							compl = 90 - tilt,
							hyp = (axis=='X')?this.h/2:this.w/2;
						offset.z = Math.sin(Crafty.math.degToRad(tilt)) * hyp;
						offset[axis.toLowerCase()] = (Math.sin(Crafty.math.degToRad(tilt)) * -hyp);
					}
					rd.transforms.translateX = this.x + offset.x + 'px';
					rd.transforms.translateY = this.y + offset.y + 'px';
					rd.transforms.translateZ = this.z + offset.z + 'px';
					rd.transforms.rotateZ = this.rZ+'deg';
					rd.transforms.rotateX = this.rX+'deg';
					rd.transforms.rotateY = this.rY+'deg';
					rd.transforms.scaleX = this.sX;
					rd.transforms.scaleY = this.sY;
					rd.transforms.scaleZ = this.sZ;
					
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
	},
});