

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