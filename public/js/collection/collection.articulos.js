Articulos = Backbone.Collection.extend({
    model: Articulo,
	comparator: function(articulo){
			return articulo.descripcion;
	}
	
});