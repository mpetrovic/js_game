(function(Crafty, window, document) {
	var data = {};
	
	Crafty.extend({
		_externalURL: '',
		
		prepare: function(type, id, url) {
			if (!url) var url = this._url;
			
			// run ajax call
		},
		
		process: function(tr) {
			// process ajax call
		},
		
		get: function(type, id) {
			if (!this._data[type][id]) {
				this.loading(); 
				this.prepare(type, id);
				return;
			}
			
			var d = data[type][id];
			var new_entity = Crafty.e(d.components);
			for (comp in d.attr) {
				new_entity.attr(d.attr[i]);
			}
			
			return new_entity;
		},
		
		loading: function() {
		},
	});
});