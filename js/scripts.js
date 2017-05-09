var stSc = {};
stSc.loadApp = function(){ 
	// Model
	var City = Backbone.Model.extend({
		data: [],
		getCitySize: function() {
			return this.attributes.data.length;
		},
		getCityHeight: function() {
			return Math.max(...this.attributes.data);
		},
		house: function(id) {
			return this.attributes.data[id];
		},
		checkWaterLevel: function(id) {
			if (id == 0) return 0; // this is the left most building, cannot be water above it.
			if (id == this.getCitySize() - 1) return 0; // this is the right most building, cannot be water above it.

			//check max height on the left, then on the right
			if ((Math.max(...this.attributes.data.slice(0, id)) > this.attributes.data[id]) && (Math.max(...this.attributes.data.slice(id+1, this.getCitySize())) > this.attributes.data[id])) {
				// return water level above top floor
				return Math.min(Math.max(...this.attributes.data.slice(0, id)),Math.max(...this.attributes.data.slice(id+1, this.getCitySize()))) - this.attributes.data[id];  
			} else {
				return 0;
			}
		},
		checkIfFlooded: function(col, row) {
			if (col == 0 || col == this.getCitySize - 1) return false; // if it's left most or right most building.
			if ((Math.max(...this.attributes.data.slice(0, col)) > row) && (Math.max(...this.attributes.data.slice(col+1, this.attributes.data.length)) > row)) {
				return true;
			} else {
				return false;
			}
		}
	});
	var city = new City({
		data: [3,2,1,2,3,3,2,1,7,6,5,6,7,1,2,3]
	});

	//View
	var CityView = Backbone.View.extend({
		model: city,
		el: "#container_result", 							// this is the element to contain the view
		template: _.template($('#cityTemplate').html()),	// template for displaying
		events: {
			'click #populate': 'populateBuildings',
			'click #flood': 'floodCity'
		},		
		initialize: function(){},
		render: function() {
			this.$el.append(this.template);
			this.drawCity();
			return this;
		},
		drawCity: function() {
			var tbl = this.$el.find('table.city');
			var row = $('<tr />');
			var i;
			for (i = 0; i < this.model.getCitySize(); i++) {
				row.append($('<td />').addClass('col'+i));
			}
			for (i=this.model.getCityHeight() - 1; i >= 0; i--) {
				tbl.append(row.clone().addClass('row'+i));
			}
			return tbl;
		},
		populateBuildings: function() {
			for(var i=0; i < this.model.getCitySize(); i++) {
				for (var j=0; j < this.model.attributes.data[i]; j++) {
					this.$el.find('.row'+ j + ' .col' + i).addClass('house');
				}
			}
		},
		floodCity: function() {
			this.populateBuildings();
			for (var i=0; i < this.model.getCitySize(); i++) {
				for (var j=0; j < this.model.getCityHeight(); j++) {
					if (this.model.checkIfFlooded(i, j)) {
						this.$el.find('.row' + j + ' .col' + i + ':not(.house)').addClass('water');
					}					
				}
			}
		}
	});


	// Router
	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'defaultRoute'
		}
	});
	// Initiate the router
	var app_router = new AppRouter;
	// Start the application
	app_router.on('route:defaultRoute', function() {
		view = new CityView();
		view.render();
	});
	// Start Backbone history a necessary step for bookmarkable URL's
	Backbone.history.start();


}

stSc.loadApp();


