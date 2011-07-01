(function(Crafty, window, document) {
	var data = {};
	var xml = new XMLHTTPRequest();
	
	Crafty.extend({
		externalURL: '',
		
		prepare: function(type, id, url) {
			if (data[type][id]) return;
			if (!url) var url = this.externalURL;
			url = url+'?type='+type+'&id='+id;
			
			// run ajax call
			// ie8+ only. if you're using ie7 or below, i don't care
			if (!xml) return;
			
			xml.open("GET", this.externalURL, false);
			xml.onreadystatechange = function() {
				if (xml.readyState != 4) return;
				if (xml.status != 200 && xml.status != 302) {
				}
				this.process(type, id, eval(xml.transportText));
			};
			xml.ontimeout = function () {
			};
		},
		
		_process: function(type, id, data) {
			// process xml call
			for (var i in data) {
				var d = data[i];
				data[d.type][d.id] = d;
			}
		},
		
		get: function(type, id) {
			if (!this._data[type][id]) {
				this.loading(); 
				this.prepare(type, id);
				return;
			}
			
			var d = data[type][id], 
				new_entity = Crafty.e(d.components),
				i;
			for (i in d.attr) {
				new_entity.attr(d.attr[i]);
			}
			for (i in d.animations) {
				// add animation
			}
			
			// ensure that necessary data is loaded
			for (i in d.ensure) {
				this.prepare(type, id);
			}
			
			return new_entity;
		},
		
		loading: function() {
		},
	});
});