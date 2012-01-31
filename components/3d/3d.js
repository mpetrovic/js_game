

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
			this.__defineSetter__('alpha', function(v) { this._alpha = v; this.changed = true;});
			
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
			Object.defineProperty(this, 'x', { set: function(v) { this._x = v; this.changed = true; this.trigger('Moved', 'x', v); }, get: function() { return this._x; }, configurable:true });
			Object.defineProperty(this, 'y', { set: function(v) { this._y = v; this.changed = true; this.trigger('Moved', 'y', v); }, get: function() { return this._y; }, configurable:true });
			Object.defineProperty(this, 'z', { set: function(v) { this._z = v; this.changed = true; this.trigger('Moved', 'z', v); }, get: function() { return this._z; }, configurable:true });
			Object.defineProperty(this, 'rX', { set: function(v) { this._rX = v; this.changed = true; this.trigger('Moved', 'rX', v); }, get: function() { return this._rX; }, configurable:true });
			Object.defineProperty(this, 'rY', { set: function(v) { this._rY = v; this.changed = true; this.trigger('Moved', 'rY', v); }, get: function() { return this._rY; }, configurable:true });
			Object.defineProperty(this, 'rZ', { set: function(v) { this._rZ = v; this.changed = true; this.trigger('Moved', 'rZ', v); }, get: function() { return this._rZ; }, configurable:true });
			Object.defineProperty(this, 'sX', { set: function(v) { this._sX = v; this.changed = true; this.trigger('Moved', 'sX', v); }, get: function() { return this._sX; }, configurable:true });
			Object.defineProperty(this, 'sY', { set: function(v) { this._sY = v; this.changed = true; this.trigger('Moved', 'sY', v); }, get: function() { return this._sY; }, configurable:true });
			Object.defineProperty(this, 'sZ', { set: function(v) { this._sZ = v; this.changed = true; this.trigger('Moved', 'sZ', v); }, get: function() { return this._sZ; }, configurable:true });
			Object.defineProperty(this, 'w', { set: function(v) { this._w = v; this.changed = true; this.trigger('Moved', 'w', v); }, get: function() { return this._w; }, configurable:true });
			Object.defineProperty(this, 'l', { set: function(v) { this._l = v; this.changed = true; this.trigger('Moved', 'l', v); }, get: function() { return this._l; }, configurable:true });
			Object.defineProperty(this, 'h', { set: function(v) { this._h = v; this.changed = true; this.trigger('Moved', 'h', v); }, get: function() { return this._h; }, configurable:true });
			Object.defineProperty(this, 'alpha', { set: function(v) { this._alpha = v; this.changed = true; }, get: function() { return this._alpha; }, configurable:true });
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
	 #.isSibling
	 @comp 3D
	 @sign public this.isSibling(Entity sib)
	 @param Entity sibling - Entity to test against
	 * Returns true if this and the given entity have the same parent
	 */
	isSibling: function (sib) {
		return 'parent' in sib && this.parent == sib.parent;
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
	},
	
	/**
	 #.getOBB
	 @comp 3D
	 @sign public this.getOBB()
	 * Returns an array of points representing the smallest box that can contain the entire object.
	 * The points returned are relative to the world coord system
	 */
	getOBB: function () {
		if (WebKitCSSMatrix) {
		}
	},
	
	// checks for changes in the object
	// to be run before PreRender
	_getChanges: function () {
		if (Crafty.support.setter || Crafty.support.defineProperty) return;
		
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
		}
		if (this.w != this._w) {
			this._w = this.w;
			this.changed = true;
			this.trigger('Moved', 'w', this.w);
		}
		if (this.l != this._l) {
			this._l = this.l;
			this.changed = true;
			this.trigger('Moved', 'l', this.l);
		}
		if (this.h != this._h) {
			this._h = this.h;
			this.changed = true;
			this.trigger('Moved', 'h', this.h);
		}
		this.trigger('GetChanges');
	}
});