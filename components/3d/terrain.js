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
	_map: null,
	_cameras: null,
	active: null,
	
	init: function () {
		this.requires('3D');
		this._objects = [];
		this._floors = [];
		this._walls = [];
		this._cameras = {};
		this.active = {};
		this._map = new Crafty.HashMap3d();
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
		this._map.insert(obj);
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
		this._map.insert(floor);
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
		this._map.insert(wall);
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
		this._map.insert(doodad);
		return this;
	},
	
	useCamera: function (name) {
		if (this._cameras[name]) {
			for (var i in this._cameras) {
				this._cameras[i].active = false;
			}
			this.active = this._cameras[id];
			this._cameras[id].active = true;
		}
		else 
			throw "No camera with name "+name;
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
 * Defines an entity that always faces the camera
 */
Crafty.c("Doodad", {
	init: function () {
		this.bind('PreRender', function (data) {
			data.l = data.h;
			data.rX = -90;
			data.rY = 0;
			
			var trans = this.parent.transforms.form,
				i;
		
			for (i in trans) {
				if (trans[i].op == 'rotateZ') {
					data.rZ = -1 * parseInt(trans[i].val[0]);
					break;
				}
			}
		});
		
		this.bind('CameraChanged', function (cam) {
			if (this.isSibling(cam)) {
				this.changed = true;
			}
		});
	}
});