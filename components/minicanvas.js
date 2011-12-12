(function (Crafty, window, document) {
	Crafty.c("MiniCanvas", {
		_ctx: null,
		
		init: function (
		
			if (!Crafty.support.canvas) {
				Crafty.trigger("NoCanvas");
				Crafty.stop();
				return;
			}
			this.requires('2D DOM');
			this.DOM(document.createElement('canvas'));
			var elem = this._element;
			
			elem.width = this.w;
			elem.height = this.h;
			elem.style.position = 'absolute';
			elem.style.left = this.x+'px';
			elem.style.top = this.y+'px';
			
			this._ctx = elem.getContext('2d');
		),
	});
})(Crafty, window, window.document);