ViewComprasPlural = Backbone.View.extend({
	initialize : function() {
		this.template = $("#templateCompraPlural").html(); /*
															 * this.personas =
															 * new Personas();
															 */
	},
	model : Compras,
	tagName : 'div',
	render : function() {
        
		this.$el.html(_.template(this.template, {
			compras : this.compras
		}));
		calcularTotalFactura();
		/* var total = 0;

         _.each(this.compras.toJSON(), function(elem){
             total += elem.get('totalLinea');
         });

         // Actualizo el valor
         $('#inpTotalDetalle').val(total);     */    
		
		/* $(this.el).html('<div>Hola mundeee!</div>'); *//*
																 * asocio el
																 * evento
																 * agregar al
																 * boton
																 */

		
		$("#btnAgregar").bind("click", function() {
			if($('#inpSucursalId').val()==0){
				alert('Debe seleccionar la SUCURSAL');
				$('#inpSucursalId').focus();
				return;
			}
			vst = new ViewCompraAdd();
			vst.setElement($('#target')).render();
			$("#inpSeleccionarCompraCodigo").focus();
		});
		$("#btnEditar").bind(
				"click",
				function() {
					vst = new ViewCompraEdit();
					var cidSeleccionado = $('input[name=inpSeleccionarCompra]')
							.filter(':checked').val();
					if (cidSeleccionado) {
						vst.compra = compras.get({
							id : cidSeleccionado
						});
						vst.setElement($('#target')).render();
					}
				});
		$("#btnEliminar").bind(
				"click",
				function() {
					var cidSeleccionado = $('input[name=inpSeleccionarCompra]')
							.filter(':checked').val();
					if (cidSeleccionado) {
						compras.remove(cidSeleccionado);
						var vstP = new ViewComprasPlural();
						vstP.compras = compras;
						vstP.setElement($('#target')).render();
					}
				});
		return this;
	}
});
ViewCompraEdit = Backbone.View.extend({
	initialize : function() {
		this.template = $("#templateCompraEdit").html();
	},
	model : Compra,
	tagName : 'div',
	render : function() {
		var sCompraJson;
		sCompraJson = {
			compra : this.compra.toJSON()
		};

		_.templateSettings.variable = 'compra';
		this.$el.html(_.template(this.template, this.compra.toJSON()));

		$("#btnCancelarCompraEdit").bind("click", function() {
			vst = new ViewComprasPlural();
			vst.compras = compras;
			vst.setElement($('#target')).render();
		});
		$("#btnAceptarCompraEdit").bind("click", function() {
			compra = compras.get($('#inpIdentificador').val());
			var aux = compra;
			aux.set({
				cantidad : $("#inpCantidad").val(),
				totalLinea : $("#inpCantidad").val() * $("#inpCostoNuevo").val()
			});
			if (compra.set(aux, {
				validate : true
			})) { /* si el set no es v�lido no guardo la persona */
				vst = new ViewComprasPlural();
				compras.add(compra);
				vst.compras = compras;
				vst.setElement($('#target')).render();
				calcularTotalFactura();
				
			}
		});
		return this;
	}
});
function cargoCosto()
{
	var costoNuevo = $('#inpSeleccionarCompraCosto').val();
	if ($("#divLabelNombreArticuloTitulo")!=""){
		if (!isNaN(parseFloat(costoNuevo)))
		{
			traerArticulo();
			return;
		};		
	}
}
function mostrarArticulo()
{
	var codigo = $('#inpSeleccionarCompraCodigo').val();
	var costoNuevo = $('#inpSeleccionarCompraCosto').val();


	if (codigo==""){
		return;
	}
	
	$("#imgAguardeCompra").css("display", "block");
	$.ajax({
		url : 'ajaxObtenerArticuloFacturaCompra.php?token='+document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'codigo':codigo,
				'sucursalId': + $('#inpSucursalId').val()
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);

			$('#inpCosto').val('');
			$('#inpCodigo').val('');
			$('#inpCompra').val('');
			$('#inpDescripcion').val('');
			$('#inpIdCompra').val('');
			$('#inpIdentificador').val('');
			$('#inpIdCompraSeleccionado').val('');


			mostrarTemplateGeneral(json,'resultado','templateCompraBusquedaArticulo','divDetalleArticuloCMP');

			if (json.error!=1) {
				datos = json['datos'];
				if(datos.length >0) {
					dato = datos[0];
					$('#inpCosto').val(dato['costosucursalconimpuestos']);
					$('#inpCodigo').val(dato['codigo']);
					$('#inpCompra').val(dato['codigo']);
					$('#inpDescripcion').val(dato['nombre']);
					$('#inpIdCompra').val(dato['id']);
					$('#inpIdentificador').val(dato['id']);
					$('#inpIdCompraSeleccionado').val(dato['id']);
				}
			}

			$("#imgAguardeCompra").css("display", "none");
			/*if (!isNaN(parseFloat(costoNuevo)))
			{
				traerArticulo();
				return;
			};*/
		},
		error : function() {
			alert('Error al obtener la compra. Pagina inexistente');
			$("#imgAguardeCompra").css("display", "none");
		}	
	});	
}
function aceptarArticulo(){
	mostrarArticulo();
	$("#inpSeleccionarCompraCosto").focus();
}
function traerArticulo()
{
	var codigo = $('#inpSeleccionarCompraCodigo').val();
	var costoNuevo = $('#inpSeleccionarCompraCosto').val();
	if (codigo==""){
		return;
	}
	
	$("#imgAguardeCompra").css("display", "block");
	$.ajax({
		url : 'obtenerArticulosJson.php?token='+document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {'inpCodigo':codigo,
				'inpSucursalId': + $('#inpSucursalId').val(),
				'detallePrecios':1,
				'costoNuevo': costoNuevo
				 },
		success : function(resultado) {
			json = $.parseJSON(resultado);
			
			if (json.error) {
				if (json.errorTipo == "no_hay_articulo")
				{
					alert("El articulo no existe, esta inactivo o no fue configurada la lista de precios.");
					var agregar = confirm("Desea agregar un nuevo articulo?");
					if (agregar)
					{
						nuevoArticuloAjax();
					}
				}else{
					alert(json.errorDescripcion);
					$('#inpSeleccionarCompraCodigo').val("");
					$('#inpCantidad').val("");
					$("#divLabelNombreArticuloTitulo").css("display", "none");
					$("#divLabelNombreArticulo").css("display", "none");
					$("#divLabelCostoAnteriorTitulo").css("display", "none");
					$("#divLabelCostoAnterior").css("display", "none");
				}
				//alert('sdfasd');
			} else {
				var compra = new Compra(json);
				$("#divLabelNombreArticuloTitulo").css("display", "block");
				$("#divLabelNombreArticulo").css("display", "block");
				$("#divLabelCostoAnteriorTitulo").css("display", "block");
				$("#divLabelCostoAnterior").css("display", "block");
				
				$('#divLabelNombreArticulo').text(compra.get("descripcion"));
				$('#divLabelCostoAnterior').text(compra.get("costo"));
				$('#inpCosto').val(compra.get("costo"));
				$('#inpPrecioVenta').val(compra.get("precioVenta"));
				$('#inpPrecioVentaCalculado').val(compra.get("precioVentaCalculado"));
				$('#inpCodigo').val(compra.get("codigo"));
				$('#inpCompra').val(compra.get("costo"));
				$('#inpDescripcion').val(compra.get("descripcion"));
				$('#inpIdCompra').val(compra.get("id"));
				$('#inpIdentificador').val(compra.get("id"));
				$('#inpIdCompraSeleccionado').val(compra.get("id"));
				
			/*	$("#inpSeleccionarCompraCodigo").prop('disabled', 'disabled');
				$("#inpSeleccionarCompraCosto").prop('disabled', 'disabled');*/
				
				
				/*var compra = new Compra(json);
				var vstDesc = new ViewCompraAddDescripcion();
				vstDesc.compra = compra;
				vstDesc.setElement($('#target')).render();*/
			}
			$("#imgAguardeCompra").css("display", "none");
		},
		error : function() {
			alert('Error al obtener la compra. Pagina inexistente');
			$("#imgAguardeCompra").css("display", "none");
		}	
	});
}
ViewCompraAdd = Backbone.View.extend({
	initialize : function() {
		this.template = $("#templateCompraAdd").html();
	},
	model : Compra,
	tagName : 'div',
	render : function() {
		this.$el.html(_.template(this.template, ''));
		$("#btnCancelarCompraBuscar").bind("click", function() {
			
			vst = new ViewComprasPlural();
			vst.compras = compras;
			vst.setElement($('#target')).render();
			$("#btnAgregar").focus();
		});
		
		$("#btnAceptarCompraBuscar").bind("click", function() {
			
			var cantidad = $('#inpCantidad').val();
			var codigo = $('#inpSeleccionarCompraCodigo').val();
			var costo = $('#inpSeleccionarCompraCosto').val();
			if (cantidad==isNaN)
			{
				alert('Debe ingresar una cantidad');
				return;
			}
			if (codigo=="")
			{
				alert('Debe ingresar un articulo');
				return;
			}
			if (costo==isNaN|| costo == "")
			{
				alert('Debe ingresar un costo');
				return;
			}
			if($('#inpIdCompra').val()==''){
				alert('Debe seleccionr un articulo existente');
				return;
			}
			if (parseFloat($('#inpCosto').val()) > parseFloat($('#inpSeleccionarCompraCosto').val()))
			{
				$mostrarCheck = "1";
			}else
			{
				$mostrarCheck = "0";
			}
			
			ausJ = {
					descripcion : $('#inpDescripcion').val(),
					codigo : $('#inpCodigo').val(),
					costo : formatearPrecio($('#inpCosto').val()),
					costoNuevo : formatearPrecio($('#inpSeleccionarCompraCosto').val()),
					cantidad : formatearCantidad($('#inpCantidad').val()),
					precioVenta : formatearPrecio($('#inpPrecioVenta').val()),
					precioVentaCalculado : formatearPrecio($('#inpPrecioVentaCalculado').val()),
					totalLinea: formatearPrecio($('#inpCantidad').val()*$('#inpSeleccionarCompraCosto').val()),
					mostrarCheck : $mostrarCheck,
					id : $('#inpIdCompra').val()
				};
				var artAdd = new Compra();
				if (artAdd.set(ausJ, {
					validate : true
				})) {
					compras.add(artAdd);
					vst = new ViewComprasPlural();
					vst.compras = compras;
					vst.setElement($('#target')).render();
					
					$("#inpSucursalId").prop('disabled', 'disabled');
					$("#btnAgregar").focus();
				}			
			
			//aceptarArticulo();
			/*
				 * if (articulo.set(aux, {validate:true})){ /* si el set no es
				 * v�lido no guardo la persona vst = new ViewArticulosPlural();
				 * articulos.add(articulo); vst.articulos = articulos;
				 * vst.setElement($('#target')).render(); }
				 */
		});
		return this;
	}
});
ViewCompraAddDescripcion = Backbone.View.extend({
	initialize : function() {
		this.template = $("#templateCompraAddDescripcion").html();
	},
	model : Compra,
	tagName : 'div',
	render : function() { /* this.$el.html(_.template(this.template,this.articulo.toJSON())); */
		var sCompraJson;
		sCompraJson = {
			compra : this.compra.toJSON()
		};
		this.$el.html(_.template(this.template, sCompraJson));
		$("#btnCancelarCompraAddSeleccion").bind("click", function() {
			vst = new ViewComprasPlural();
			vst.compras = compras;
			vst.setElement($('#target')).render();
		});
		$("#btnAceptarCompraAddSeleccion").bind("click", function() {
			
			ausJ = {
				descripcion : $('#inpDescripcion').val(),
				codigo : $('#inpCodigo').val(),
				costoNuevo : formatearPrecio($('#inpCosto').val()),
				cantidad : formatearCantidad($('#inpCantidad').val()),
				precioVenta : formatearPrecio($('#inpPrecioVenta').val()),
				precioVentaCalculado : formatearPrecio($('#inpPrecioVentaCalculado').val()),
				totalLinea: formatearPrecio($('#inpCantidad').val()*$('#inpCosto').val()),
				id : $('#inpId').val()
			};
			var artAdd = new Compra();
			if (artAdd.set(ausJ, {
				validate : true
			})) {
				compras.add(artAdd);
				vst = new ViewComprasPlural();
				vst.compras = compras;
				vst.setElement($('#target')).render();
				
				$("#inpSucursalId").prop('disabled', 'disabled');
				
			}
		});
		return this;
	}
});