/** 
 #Collides
 @category 3D
 * Adding this component to an entity will check for collision with all entities with Collides.
 * Don't bother filtering by which component to collide with. This should be handled in the onCollide
 * handler.
 */
Crafty.c('Collides', {

	init: function() {
		this.bind('Moved', this._checkCollision);
	},
	
	_checkCollision: function() {
		var collide, SAT;
		if (this.has('3D') && this.parent) {
			// check the parent's HashMap then check against individual entities for collision
			
			if (collide) {
				this.trigger('Collide', collide, SAT);
				collide.trigger('Collide', this, SAT);
			}
		}
		else if (this.has('2D')) {
			// check HashMap, then individual entities
			
			if (collide) {
				this.trigger('Collide', collide, SAT);
				collide.trigger('Collide', this, SAT);
			}
		}
	},
});