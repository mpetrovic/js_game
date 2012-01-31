/**@
 #Render
 @category 3D
 * Marks an entity to be rendered.
 * All others should not be rendered at all.
 */
Crafty.c('Render', {
	/**@
	 #.faces
	 * An array of all the 'faces' that make up the object
	 * Faces are rectangles. CSS doesn't support anything else, so neither will I.
	 * A single face consists of a start position, dimensions and rotations.
	 * For most cases, these will be static for the duration of the game.
	 * Example:
	 * ~~~~~~~~~~~~~~~~
	 * faces = [
		{
			x:0,
			y:0,
			z:0,
			w:0,
			l:0,
			h:0,
			rX:0,
			rY:0,
			rZ:0
			sprite: 'sprite',
			changed: true
		}
	 * ]
	 */
	faces: null,
	_renderData: null,
	
	/**@
	 #.changed
	 * Boolean value
	 * Should be true if any property that affects how the entity directly is rendered changes
	 * For instance, position, rotation, etc.
	 * Should be false if its parent changes, but not it.
	 */
	changed: true,
	
	init: function () {
		this.faces = [];
	}
	
	render: function (method) {
	
		if (method == '3D' && this.has('3D')) {
			this._getChanges();
			if (!this.changed) return;
			if (!this.parent) throw 'No parent set for entity';
			
			// prerender stuff
			var copy = this.clone();
			this.trigger('PreRender', copy);
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
				var rd = this._renderData = this._renderData || {container: null, transforms:{}, faces: []};
				if (rd.container == null) {
					rd.container = document.createElement('div');
					rd.container.style.position = 'absolute';
					rd.container.style.top = (-copy.l/2)+'px';
					rd.container.style.left = (-copy.w/2)+'px';
					this.parent.renderElement.appendChild(rd.container);
				}
				for (var i=0,l=this.faces.length; i<l; i++) {
					var fc, face = this.faces[i];
					if (!face.changed) continue;
					if (typeof rd.faces[i] == 'undefined') {
						fc = rd.faces[i] = document.createElement('div');
						fc.style.position = 'absolute';
					}
					else {
						fc = rd.faces[i];
					}
					fc.style.top = (-face.l/2)+'px';
					fc.style.left + (-face.w/2)+'px';
				}
				
				// calculate the transforms and put them in the transform object
				// NOTES:
				// ORDER MATTERS!
				// translate first, then rotateZ, then rotateX/Y. 
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
				rd.container.style.transform = rd.container.style[Crafty.support.prefix + "Transform"] = str;
				
				if (this.has('Sprite')) {
					rd.elem.style.background = "url('" + this.__image + "') no-repeat -" + this.__coord[0] + "px -" + this.__coord[1] + "px";
				}
			}
			else if (Crafty.support.webgl) {
				// webgl stuff
				// i have no idea what goes here
			}
			else if (Crafty.support.svg) {
				
			}
			else if (Crafty.support.vml) {
				
			}
			else {
				method = overhead;
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