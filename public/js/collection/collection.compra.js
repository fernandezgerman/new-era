Compras = Backbone.Collection.extend({
    model: Compra,
	comparator: function(compra){
			return compra.descripcion;
	}
	
});