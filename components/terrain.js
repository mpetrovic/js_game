/**@
 * #Terrain
 * @category World
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

Crafty.c('Doodad', {
});