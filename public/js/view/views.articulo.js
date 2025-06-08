ViewArticulosPlural = Backbone.View.extend({
					initialize: function(){ 
						this.template = $("#templateArticuloCompuestoPlural").html();
						//this.personas = new Personas();					
						},
					model: Articulos,
					tagName : 'div',
					render: function(){
						
						this.$el.html(_.template(this.template,{articulos: this.articulos.toJSON() }));
						//$(this.el).html('<div>Hola mundeee!</div>');
						//asocio el evento agregar al boton 
						
						$("#btnAgregarCompuesto").bind("click",function(){
						 	vst = new ViewArticuloCompuestoAdd();
							vst.setElement($('#target')).render();			
						});				
						$("#EditarCompuesto").bind("click",function(){
						 	vst = new ViewArticuloCompuestoEdit();
							var cidSeleccionado = $('input[name=inpSeleccionarArticulo]').filter(':checked').val();							
							if (cidSeleccionado){
								vst.articulo = articulos.get({id:cidSeleccionado});
								vst.setElement($('#target')).render();			
							}
						});
						
						$("#btnEliminarCompuesto").bind("click",function(){
							var cidSeleccionado = $('input[name=inpSeleccionarArticulo]').filter(':checked').val();							
							if (cidSeleccionado){
								articulos.remove(cidSeleccionado);
								var vstP = new ViewArticulosPlural();
								vstP.articulos = articulos;
								vstP.setElement($('#target')).render();
							}
						});		
						return this;
					}
});

ViewArticuloCompuestoEdit = Backbone.View.extend({
					initialize: function(){ 
						this.template = $("#templateArticuloCompuestoEdit").html();
					},
					model: Articulo,
					tagName : 'div',
					render: function(){
						var sArticuloJson;
						sArticuloJson = {articulo: this.articulo.toJSON() };
						this.$el.html(_.template(this.template,sArticuloJson));

						$("#btnCancelarArticuloEdit").bind("click",function(){
						 	vst = new ViewArticulosPlural();
							vst.articulos = articulos;
							vst.setElement($('#target')).render();			
						});
						
						$("#btnAceptarArticuloEdit").bind("click",function(){												 
							articulo = articulos.get($('#inpIdentificador').val());
							
							var aux = articulo;
							aux.set({cantidad:$("#inpCantidadCompuesto").val()});

							if (articulo.set(aux, {validate:true})){ // si el set no es válido no guardo la persona
								vst = new ViewArticulosPlural();
								articulos.add(articulo);
								vst.articulos = articulos;
								vst.setElement($('#target')).render();			
							}
						});		
						
						return this;
					}
});

ViewArticuloCompuestoAdd = Backbone.View.extend({
					initialize: function(){ 
						this.template = $("#templateArticuloCompuestoAdd").html();
					},
					model: Articulo,
					tagName : 'div',
					render: function(){

						this.$el.html(_.template(this.template,''));

						$("#btnCancelarArticuloCompuestoBuscar").bind("click",function(){
						 	vst = new ViewArticulosPlural();
							vst.articulos = articulos;
							vst.setElement($('#target')).render();			
						});
						
						$("#btnAceptarArticuloCompuestoBuscar").bind("click",function(){												 
   
							var codigo = $('#inpSeleccionarArticuloCodigo').val();
							$("#imgAguardeArticulo").css("display", "block");
							$.ajax({
							  url: 'obtenerArticulosJson.php?token='+$('#mToken').val(),
							  type: 'POST',
							  datatype :'json',
							  async: true,
							  data: 'inpCodigo='+codigo,
							  success: function(resultado){
								  	json = $.parseJSON(resultado);
									if (json.error){
										alert(json.errorDescripcion);
									}else{
										var articulo = new Articulo(json);
										var vstDesc = new ViewArticuloCompuestoAddDescripcion();
										vstDesc.articulo = articulo;
										vstDesc.setElement($('#target')).render();									
									}
									$("#imgAguardeArticulo").css("display", "none");
								},
							  error: function(){
								  	alert('Error al obtener el artículo. Pagina inexistente') ;
									$("#imgAguardeArticulo").css("display", "none");
								}
							});
/*
							if (articulo.set(aux, {validate:true})){ // si el set no es válido no guardo la persona
								vst = new ViewArticulosPlural();
								articulos.add(articulo);
								vst.articulos = articulos;
								vst.setElement($('#target')).render();			
							}*/
						});		
						
						return this;
					}
});

ViewArticuloCompuestoAddDescripcion = Backbone.View.extend({
					initialize: function(){ 
						this.template = $("#templateArticuloAddDescripcion").html();
					},
					model: Articulo,
					tagName : 'div',
					render: function(){
						
//						this.$el.html(_.template(this.template,this.articulo.toJSON()));

						var sArticuloJson;
						sArticuloJson = {articulo: this.articulo.toJSON() };
						this.$el.html(_.template(this.template,sArticuloJson));
						
						$("#btnCancelarArticuloAddSeleccion").bind("click",function(){
						 	vst = new ViewArticulosPlural();
							vst.articulos = articulos;
							vst.setElement($('#target')).render();	
						});
						
						$("#btnAceptarArticuloAddSeleccion").bind("click",function(){												 
   						
							ausJ = {descripcion: $('#inpDescripcionCompuesto').val(),
									codigo: $('#inpCodigoCompuesto').val(),
									costo: $('#inpCostoCompuesto').val(),
									cantidad: $('#inpSeleccionarArticuloCantidad').val(),
									id: $('#inpIdCompuesto').val()
									};
							
							var artAdd = new Articulo();
							
							if (artAdd.set(ausJ,{validate:true})){
								articulos.add(artAdd);
								vst = new ViewArticulosPlural();
								vst.articulos = articulos;
								vst.setElement($('#target')).render();								
							}
						});
						return this;
					}
});