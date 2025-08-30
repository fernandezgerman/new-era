var Compra = Backbone.Model.extend({
	validate : function(attrs) { /* VALIDACION */
		aux = ''; /* si no devuelve nada están válidos */
		var filtro = /^[0-9]+(\.[0-9]+)?$/;

		if (!filtro.test(attrs.costo)) {
			aux = "El costo debe tener el formato 0.00 (" + attrs.costo + ")";
		}
		if (parseFloat(attrs.cantidad)!=attrs.cantidad) {
			aux = "La cantidad debe tener el formato 0";
		}		
		//precioVenta = formatearPrecio(attrs.precioVenta);
	/*	attrs.costo = formatearPrecio(attrs.costo);
		attrs.precioVenta = formatearPrecio(attrs.precioVenta);
		attrs.precioVentaCalculado = formatearPrecio(attrs.precioVentaCalculado);
		attrs.cantidad = formatearCantidad(attrs.cantidad);
		*/
		return aux;
	},
	initialize : function() { /* CONSTRUCTOR */
		this.on("invalid", function(model, error) { /*
													 * MUESTRA ERROR SI SURJE
													 * ALGUNO
													 */
			alert(error);
		});
	},
	toJSON : function() { /*
							 * redefino la función toJSON por que no incluye el
							 * cid
							 */
		var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
		json.cid = this.cid;
		return json;
	},
	defaults : {
		id : 0, /* VALORES POR DEFECTO DE LOS ATRIBUTOS */
		descripcion : '',
		costo : '',
		dni : '',
		fechaNacimiento : '',
		sexo : 'M',
		cantidad : '',
		codigo : '',
		precioVenta : '',
		precioVentaCalculado: '',
		actualizarCosto:1 
	}
});