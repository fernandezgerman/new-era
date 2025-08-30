var Articulo = Backbone.Model.extend({
				validate: function(attrs){  //VALIDACION
					aux=''; //si no devuelve nada están válidos
					var filtro = /^[0-9]+(\.[0-9]+)?$/;
					if(!filtro.test(attrs.cantidad)) {
						aux = "La cantidad debe tener el formato 0.000";
					}
					return aux;
				}, 
				initialize:function(){		//CONSTRUCTOR
					this.on("invalid",function(model, error){  //MUESTRA ERROR SI SURJE ALGUNO
						alert(error);
					});
				},
				toJSON: function() { //redefino la función toJSON por que no incluye el cid
				  var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
				  json.cid = this.cid;
				  return json;
				}
				,
				defaults:{
					id: 0,  //VALORES POR DEFECTO DE LOS ATRIBUTOS
					descripcion: '',
					costo: '',
					dni: '',
					fechaNacimiento: '',
					sexo: 'M'
				}
});