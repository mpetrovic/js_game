/*
 * props:
 * 	name
 * 	url
 *	w
 *	h
 *  padX
 * 	padY
 *  map {
 *		name: [x, y, {anims}]
 *	}
 */
Crafty.spriteReel = function (prop) {
		var paddingX = prop.padX, 
			paddingY = prop.padY,
			img = Crafty.assets[url],
			tile = w,
			tileHh = h,
			map = prop.map,
			anims;
		
		//if no paddingY, use paddingX
		if(!paddingY && paddingX) paddingY = paddingX;
		paddingX = parseInt(paddingX || 0, 10); //just incase
		paddingY = parseInt(paddingY || 0, 10);
		
		if(!img) {
			img = new Image();
			img.src = url;
			Crafty.assets[url] = img;
			img.onload = function() {
				//all components with this img are now ready
				for(var pos in map) {
					Crafty(pos).each(function() {
						this.ready = true;
						this.trigger("Change");
					});
				}
			};
		}
		
		for(pos in map) {
			if(!map.hasOwnProperty(pos)) continue;
			
			temp = map[pos];
			x = temp[0] * (tile + paddingX);
			y = temp[1] * (tileh + paddingY);
			if (typeof temp[2] != 'object') {
				w = temp[2] * tile || tile;
				h = temp[3] * tileh || tileh;
				anims = temp[4];
			}
			else if (typeof temp[2] != 'undefined') {
				anims = temp[2];
			}
			else {
				anims = [];
			}
			
			/**@
			* #Sprite
			* @category Graphics
			* Component for using tiles in a sprite map.
			*/
			Crafty.c(pos, {
				ready: false,
				__coord: [x,y,w,h],
				
				init: function() {
					this.requires("Sprite");
					this.requires("SpriteAnimation");
					this.__trim = [0,0,0,0];
					this.__image = url;
					this.__coord = [this.__coord[0], this.__coord[1], this.__coord[2], this.__coord[3]];
					this.__tile = tile;
					this.__tileh = tileh;
					this.__padding = [paddingX, paddingY];
					this.img = img;
		
					//draw now
					if(this.img.complete && this.img.width > 0) {
						this.ready = true;
						this.trigger("Change");
					}

					//set the width and height to the sprite size
					this.w = this.__coord[2];
					this.h = this.__coord[3];
					
					for (var i in anims) {
						this.animate(i, anims[i][0], anims[i][1], anims[i][2]);
					}
				}
			});
		}
		
		return this;
}