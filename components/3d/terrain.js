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
	active: null,
	
	init: function () {
		this.requires('3D');
		this._objects = [];
		this._floors = [];
		this._walls = [];
		this._cameras = {};
		this.active = {};
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
	
	useCamera: function (name) {
		if (this._cameras[name])
			for (var i in this._cameras) {
				this._cameras[i].active = false;
			}
			this.active = this._cameras[id];
			this._cameras[id].active = true;
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

/**
* Spatial HashMap for broad phase collision
*
* @author Louis Stowasser
*/
(function(parent) {

var HashMap = function(cell) {
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
		
		// search in all x buckets
		for(x=keys.x1;x<=keys.x2;x++) {
			// search in all z buckets
			for(y=keys.y1;y<=keys.y2;y++) {
				// search in all z buckets
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
		// i dont know what use this has in a 3D context, but w/e
		var k, ent,
			hash = {
				max: {x: -Infinity, y: -Infinity, z: -Infinity},
				min: {x: Infinity, y: Infinity, z: Infinity},
			}
			coords = {
				max: {x: -Infinity, y: -Infinity, z: -Infinity},
				min: {x: Infinity, y: Infinity, z: Infinity},
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
					coords.max.y = Math.max(coords.max.y, ent.y + ent.l);
				}
			}
			if (coord[1] <= hash.min.y) {
				hash.min.y = coord[1];
				for (k in this.map[h]) {
					ent = this.map[h][k];
					coords.min.y = Math.min(coords.min.y, ent.y);
				}
			}
			if (coord[2] >= hash.max.z) {
				hash.max.z = coord[2];
				for (k in this.map[h]) {
					ent = this.map[h][k];
					coords.max.z = Math.max(coords.max.z, ent.z + ent.h);
				}
			}
			if (coord[2] <= hash.min.z) {
				hash.min.z = coord[2];
				for (k in this.map[h]) {
					ent = this.map[h][k];
					coords.min.z = Math.min(coords.min.z, ent.z);
				}
			}
		}
		
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