

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