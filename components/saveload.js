(function (Crafty, window, document) {
	var db = NULL, url = '';
	
	Crafty.c("Save", {
		saveName: '',			// machine name for the save. 
								// either gameName_save_01 OR gameName_userName_save_01
		
		init: function() {
			// determine which save solution we'll be using.
			this.bind("SaveGame", function() {
				var data = this._getSaveData();
				if (this.saveOnline(data)) {
					// do nothing
				}
				else if (window.indexedDB) {
					this.saveIndexed(data);
				}
				else if (openDatabase) {
					this.saveSql(data);
				}
				else if (window.localStorage) {
					this.saveStorage(data)
				}
				else {
					window.saveCookies(data);
				}
			});
			
			this.bind("LoadGame", function() {
				
			});
		},
		
		// gets all the data a component is saving
		getSaveData() {
			var data = {
				c: this.__c,
				a: {},
			};
			this.trigger("SaveData", data.a);
			return data;
		},
		
		// in order of things I will try
		saveIndexed: function() {
			if (db == NULL) {
				db = {};
				var request = window.indexDB.open("ArTonelico_CellianNights", "Saved Data for Ar Tonelico: Cellian Nights");
				request.onsuccess = function(event) {
					db.database = event.result;
					var request2 = this.db.database.setVersion(1);
					request2.onsuccess = function(e) {
						db.store = this.db.database.createObjectStore("GameSaves", "id", false);
					};
				};
			}
		},
		loadIndexed: function() {
		},
		
		saveSql: function() {
		},
		loadSql: function() {
		},
		
		saveStorage: function() {
		},
		loadStorage: function() {
		},
		
		saveCookies: function() {
			// alert a warning that we're saving with cookies
			// which means the browser is very old.
			// suggest they upgrade for better performance
		},
		loadCookies: function() {
		},
		
		saveOnline: function() {
			// save to a server
		},
		loadOnline: function() {
		},
	});
	
	Crafty.extend({
		setSaveGameURL: function (new_url) {
			// check the URL works
			if (1) {
				url = new_url;
			}
		},
		
		loadFromSave: function (saveName) {
			if (loadOnline(saveName)) {
				// do nothing
			}
			else if (window.indexedDB) {
				loadIndexed(saveName);
			}
			else if (openDatabase) {
				loadSql(saveName);
			}
			else if (window.localStorage) {
				loadStorage(saveName)
			}
			else {
				loadCookies(saveName);
			}
		},
	});
	
	function loadOnline(saveName) {
	}
	
	function loadIndexed(saveName) {
	}
	
	function loadSql(saveName) {
	}
	
	function loadStorage(saveName) {
	}
	
	function loadCookies(saveName) {
	}
});