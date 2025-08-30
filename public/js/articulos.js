

    var compuestos = Array();
    var articulo = Array();
    var ultimasCompras = Array();
	var sucursalesDisponibles = Array();


	window.onbeforeunload = preguntarAntesDeSalir;
	function datosValidos(){
		
		if ($('#inpNombreArticulo').val() == ""){
			alert('Debe ingresar un nombre');
			return false;
		}
		if ($('#inpCodigo').val() == ""){
			alert('Debe ingresar un codigo');
			return false;
		}
		if ($('#inpRubroId').val() == "0"){
			alert('Debe seleccionar un rubro');
			return false;
		}
        if (!$('#inpAplicaPorcentajeMinimoUtilidad').is(':checked')){
			if(!confirm("ATENCION!! Esta guardando un articulo sin aplicar minimo de utilidad, ¿Esta seguro?")){
				return false;
			}
		}
		if (!$('#inpEsCompuesto').is(':checked'))
		{
			if (!(parseFloat($('#inpCosto').val()) > 0)){
				alert('Debe ingresar un costo');
				return false;
			}
			if (validaFloat($('#inpCosto').val()) == false){
				alert('El valor del costo no es numerico');
				return false;
			}

		}else{
			$('#inpCosto').val('0');
			if (!($('#inpArticuloCompuestoTotalCantidad').val() > 1)){
				alert('La cantidad de articulos para un compuesto debe ser mayor a 1.');
				return false;
			}						
		}	
		
		return true;
	}
	function enviar(){
		if (datosValidos()){
			bPreguntar = false;
			document.getElementById('frm').submit();
		}
	}
	function enviarConAjax(){
		if (datosValidos()){
			
			bPreguntar = false;
			$.ajax({
				url : 'articuloGuardar.php?token='+document.getElementById('mToken').value,
				type : 'POST',
				datatype : 'json',
				async : true,
				data : {'origenInsercion':'ajax',
						'inpId':'',
						'inpActivo':1,
						'inpCodigo':$('#inpCodigo').val(),
						'inpNombreArticulo': $('#inpNombreArticulo').val(),
						'inpDescripcion': $('#inpDescripcion').val(),
						'inpAplicaPorcentajeMinimoUtilidad': $('#inpAplicaPorcentajeMinimoUtilidad').val(),
						'inpFechaModificacion':'',
						'inpFechaCreacion': '',
						'inpRubroId': $('#inpRubroId').val(),
						'inpMarcaId': $('#inpMarcaId').val(),
						'inpFechaActivoHasta': $('#inpFechaActivoHasta').val(),
						'inpCosto': $('#inpCosto').val(),
						'inpArticuloCompuestoTotal':0,
						'inpArticuloCompuestoTotalCantidad':0,
						'pagExito':'',
						'pagError':'',
						'pagNoValido':''
						 },
				success : function(resultado) {
					json = $.parseJSON(resultado);
					alert(json.mensaje);
					if (json.resultado == 1){
						$('#inpSeleccionarCompraCodigo').val(json.codigoArticulo);
						$('#inpSeleccionarCompraCosto').val(json.costo);
						ajaxCerrarVentana();
						aceptarArticulo();
						$("#inpCantidad").focus();
					}
				},
				error : function() {
					alert('Error al guardar el articulo. Pagina inexistente');
				}	
			});
		}
	}	
	function seleccionaCostoArticulo(){
		if ($('#inpCostoAnterior').val() == $('#inpCosto').val()){
			$('#descripcionCosto').css('visibility','hidden');
			
		}else{
			$('#descripcionCosto').css('visibility','visible');
		}
	}
    function functionClick() {
        if ($('#inpEsCompuesto').is(':checked')){
            $('#target').show(500);
            $('#divCosto').hide(500);
        }else{
            $('#target').hide(500);
            $('#divCosto').show(500);
        }
    }
	function editarCompuesto()
	{
        valor = $('input:radio[id=inpSeleccionarArticulo]:checked').val();
        artComp = compuestos[valor];

        artComp['indice'] = valor;

        _.templateSettings.variable = "articulo";

        var template = _.template(
            $( "#templateArticuloCompuestoEdit" ).html()
        );
        $( "#target" ).html(
            template(artComp)
        );
	}
	function mostrarCompuesto(){
        _.templateSettings.variable = "articulos";

        var template = _.template(
            $( "#templateArticuloCompuestoPlural" ).html()
        );
        $( "#target" ).html(
            template(compuestos)
        );
	}
    function agregarCompuesto(){
        var template = _.template(
            $( "#templateArticuloCompuestoAdd" ).html()
        );
        $( "#target" ).html(
            template()
        );
    }
    function agregarCompuesto2(){
    	codigo = $('#inpSeleccionarArticuloCodigo').val();

    	if(codigo==''|| !codigo){
    		alert('Debe ingresar un codigo. Para buscar utilice la lupa');
    		return;
		}

        var codigo = $('#inpSeleccionarArticuloCodigo').val();

        $("#imgAguardeArticulo").css("display", "block");

        url = 'obtenerArticulosJson.php';
		data = {inpCodigo:codigo};
		variable = 'articulo';
		template = 'templateArticuloAddDescripcion';
		divResultado = 'target';

        $("#imgAguardeArticulo").css("display", "block");

        cargarAjaxGenericoJson(url, data, variable, template, divResultado,false,'finBusquedaCOmpuesto()');
    }
    function finBusquedaCOmpuesto(){

        $("#imgAguardeArticulo").css("display", "none");
        if(!$('#inpDescripcionCompuesto').val()){
            alert('No se encontro el articulo');
            agregarCompuesto();
        }
    }
    function agregarCompuestoFinalizar(){
    	if(isNaN(parseFloat($('#inpSeleccionarArticuloCantidad').val())) ){
    		alert('La cantidad ingresada es invalida');
    		return;
		}

    	art =
        {
        	"id":"",
			"cantidad":$('#inpSeleccionarArticuloCantidad').val(),
			"articuloId":$('#inpIdCompuesto').val(),
			"articuloCodigo":$('#inpCodigoCompuesto').val(),
			"articuloNombre":$('#inpDescripcionCompuesto').val(),
			"articuloCosto":$('#inpCostoCompuesto').val(),
            "articuloCostoConImpuestos":$('#inpCostoConImpuestosCompuesto').val()

        }
        compuestos[compuestos.length] = art;
        mostrarCompuesto();
    }
	function guardarCompuestoEditar(){
        if(isNaN(parseFloat($('#inpCantidadCompuesto').val())) ){
            alert('La cantidad ingresada es invalida');
            return;
        }

    	indice = $('#inpIdentificador').val()
		articulo = compuestos[indice];

        articulo.cantidad = parseFloat($('#inpCantidadCompuesto').val());
        compuestos[indice]=articulo;
        mostrarCompuesto();
	}

    function eliminarCompuesto()
    {
        valor = $('input:radio[id=inpSeleccionarArticulo]:checked').val();

        compuestos.splice(valor, 1);
        mostrarCompuesto();
    }
    function mostrarUltmasCompras(){
        mostrarTemplateGeneral(ultimasCompras, 'resultado', 'ArticulosExistencias', 'divUtimasCompras');
    }
    function establecerUltimaCompra(idcompradetalle){
        ultimasCompras['idCompraAsociada'] = idcompradetalle;
        mostrarUltmasCompras();
	}

	function mostrarSucursalDisponibilidad(){
		if ($('#inpDisponibilidadEspecialId').is(':checked')){
			$('#divSucursalesDisponibles').hide(0);
			mostrarTemplateGeneral(sucursalesDisponibles, 'sucursales', 'templateDisponibilidadSucursales', 'divSucursalesDisponibles');
			$('#divSucursalesDisponibles').show(1000);
		}else{
			$('#divSucursalesDisponibles').hide(1000);
		}

	}