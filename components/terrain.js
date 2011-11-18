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
	
	init: function () {
		this.requires('3D');
		this._objects = [];
		this._floors = [];
		this._walls = [];
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
		this._objects.push(obj.attr({'x': x, 'y': y, 'z': z}));
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
	addWall: function (facing, l, h, z, texture) {
	},
});

/**
 * #3D
 * @comp 3D
 * An object in 3D space. Limited to planes, at the moment
 * Coordinates and dimensions are in 'units', a generic measurement with a variable relationship to pixels
 */
Crafty.c('3D', {
	x: 0,
	y: 0,
	z: 0,
	rX: 0,
	rY: 0,
	rZ: 0,
	w: 0,
	length: 0,
	parent: null,
	
	/**
	 #.setParent
	 @comp 3D
	 @sign public this.setParent(Entity parent)
	 @param Entity parent	The parent this entity should follow. 
	 * Allows a parent object to pass its transforms on to children.
	 */
	setParent: function (parent) {
		this.parent = parent;
	},
	
	/**
	 #.transformRelativeToSelf
	 @comp 3D
	 @sign public this.transformRelativeToSelf(Object transforms)
	 @param Object transforms	object of key => value pairs. The key is the transform property, the value is the amount
	 * A 3D object should have 2 sets of coordinates to refer to. It's parent and itself. By default, we manipulate data relative to the world.
	 * This function allows entities to move using their own coordnate system.
	 */
	transformRelativeToSelf: function (transforms) {
	}
});

/**
 #Camera
 @comp 3D
 * A camera that renders a World entity and all of the 3D entities in contains.
 * The camera has a target, which is another 3D entity, and a type, which determines how the world is rendered 
 * as well as certain behaviors on the camera itself.
 */
Crafty.c('Camera', {
	target: null,
	type: 'overhead',
	_transforms: null,
	
	init: function () {
		this.requires('3D');
		this.target = Crafty.e('3D');
		_transforms = {};
		this._calcTransforms();
	},
	
	Camera: function (type, parent) {
		this.type = type;
		this.target.setParent(parent);
	},
	
	/**
	 * Looks at a point or an entity. Whichever
	 */
	lookAt: function (obj) {
	}
	
	/**
	 #.zoom
	 @comp 3D
	 @sign public this.zoom(float amt)
	 @param float amt	multiplier to zoom in by
	 * Moves the camera closer to or farther from the target
	 */
	zoom: function (amt) {
		
	},
	
	_calcTransforms: function () {
	),
	
	/**
	 * For DOM:
	 * Transforms the world according to angles and positions of camera and target relative to each other
	 * For Canvas:
	 * ???????
	 * Maybe use SVG for all this?
	 */
	_render() {
	// oh god what goes here
	},
}