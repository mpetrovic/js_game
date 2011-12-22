(function (Crafty, window, document) {
	Crafty.c("Slots", {
		_slotsMax: 4,
		_slots: null,
		
		init: function() {
			this._slots = new Array(null, null, null, null);
		},
		
		// use null to remove an upgrade without placing a new one
		slot: function(upgrade, slot_num) {
			
			if (this._slots[slot_num] != null) {
				// an upgrade exists already.
				Crafty.trigger("AddToInventory", this._slots[slot_num]);
			}
			
			this._slots[slot_num] = upgrade;
		},
		
		getCumulative: function() {
			var stats = Crafty.e("Stats");
			
			for (var i=0; i<this._slotsMax; i++) {
				if (this._slots[i]) stats.merge(this._slots[i]);
			}
			
			return stats;
		}
	});
})(Crafty,window,window.document);