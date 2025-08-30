var contenedorFiltros = Array();
var contenedorDeResultados = Array();
var bajoElCosto = 0;
var bajoElMinimo = 0;
var incluirDependientes  = 0;
var cargaInstantanea  = 0;

$(document).ready(function(){
	_.templateSettings.variable = "filtros";


    var template = _.template($( "#filtrosGeneralesListasSingularTemplate" ).html());
    $( "#filtroListas" ).html(template(contenedorFiltros));

    var template = _.template($( "#filtrosGeneralesRubrosTemplate" ).html());
    $( "#filtroRubros" ).html(template(contenedorFiltros));



    var template = _.template($( "#filtrosGeneralesArticuloTemplate" ).html());
    $( "#filtroArticuloCodigo" ).html(template(contenedorFiltros));


    if(cargaInstantanea==1){

        if(incluirDependientes==1){
            $('#chkIncluirDependientes').prop('checked','true');
        }
        mostrarDatos('',bajoElCosto,bajoElMinimo);

    }

});

function validarDatosBusqueda(){

	if($('#inpFiltroListas').val()=="") {
		alert("Debe seleccionar alguna lista de precios.");
		return false;
	}
	rbr = $('#inpFiltroRubros').val();
	art = $('#inpFiltroCodigoArticulo').val();

    if(!$('#inpFiltroRubros').val() && $('#inpFiltroCodigoArticulo').val()=="") {
        alert("Debe seleccionar algún rubro o ingresar el codigo de algun articulo");
        return false;
    }
 	return true
}
function mostrarDatos(lote,pordebajodelcosto,pordebajodelminimo){
    atrasModificaciones();
	if (pordebajodelcosto == 1 || pordebajodelminimo == 1 || validarDatosBusqueda()){
		$('#idBotonBuscar').hide();
		$('#reporteCompleto').addClass('divBuscandoInformacion');
		$( "#main" ).html("");
		  $.ajax({
			  url: 'ajaxListaDePrecioGenerarLote.php?token='+document.getElementById('mToken').value,
			  type: 'POST',
			  datatype :'json',
			  async: true,
			  data: {
				     'filtroRubros': $('#inpFiltroRubros').val(),
				     'filtroListas': $('#inpFiltroListas').val(),
				     'filtroCodigoArticulo': $('#inpFiltroCodigoArticulo').val(),
				     'incluirInactivos': booleanoANumero($('#chkIncluirInactivos').is(':checked')),
                  	'incluirSinExistencias': booleanoANumero($('#chkIncluirSinExistencias').is(':checked')),
                  	'incluirDependientes': booleanoANumero($('#chkIncluirDependientes').is(':checked')),
                  	'mostrarSoloPorDebajoDelMinio':pordebajodelminimo,
                  	'mostrarSoloPorDebajoDelCosto': pordebajodelcosto,
                  	'mostrarSoloInactivos': '',
                  	'mostrarSoloSinExistencias': '',
                    'lote':lote,
				  	'contenedor':'main' ,
                    'incluirResumen':1},
			  success: function(resultado){


				  		res = $.parseJSON(resultado);
                  		contenedorDeResultados = res;
						_.templateSettings.variable = "resultado";
                  		var template = _.template($("#templateListaDePreciosGeneral").html());
					    $( "#main" ).html(template(res));

				  		$('#reporteCompleto').removeClass('divBuscandoInformacion');
				  		$('#idBotonBuscar').show();
					},
				  error: function(){
						alert('Error al cargar los datos.') ;
						$('#idBotonBuscar').show();
						$('#reporteCompleto').removeClass('divBuscandoInformacion');
					}
				});
	}

}

function cerrarDiv(id){
    $( "#"+id ).html("");
}
function actualizarRenglon(indice){
    articulos = contenedorDeResultados['registros'];
    articulo = articulos[indice];
    articulo['editado']= true;
    indiceOriginal = indice;
	indice = articulo['id'];

	/* MINIMO DE UTILIDAD*/
    if($('#chkMinimo'+indice).is(':checked')){
        $('#divAplicarMinimo-'+indice).addClass("divAvisoPequeño");
        $('#divAplicarMinimo-'+indice).addClass("tblFilaDestacadaPorDebajoCosto");
	}else{
        $('#divAplicarMinimo-'+indice).removeClass("divAvisoPequeño");
        $('#divAplicarMinimo-'+indice).removeClass("tblFilaDestacadaPorDebajoCosto");
	}


    excepcion = $('#inpPrecioExcepcion'+indice).val();



    arrListas={};
	for(l=0;l < parseFloat($('#totalListas-'+articulo['id']).val()); l++)
	{
	    listaPorcentajeExc = $("#listaExcepcionPorcentaje-"+articulo['id']+"-"+l).val();
	    if(isNaN(listaPorcentajeExc)){
            listaPorcentajeExc = '';
        }
        lista = {'id': $("#listaId-"+articulo['id']+"-"+l).val(),
            	'listaExcepcionPorcentaje':listaPorcentajeExc,
				 'aumentoSobreRubro':$("#aumentoSobreRubro-"+articulo['id']+"-"+l).val()};

        arrListas[l] =  lista;

	}
    $('#divCosto'+indiceOriginal).html('$'+formatearPrecio(articulo['costo']));
    $('#divCostoImpuesto'+indiceOriginal).html('+ $'+formatearPrecio(articulo['impuestos']));
    $('#divCostoImpuestoFinal'+indiceOriginal).html(' = '+formatearPrecio(articulo['costoConImpuesto'] ) );


    $('#reporteCompleto').addClass('divBuscandoInformacion');
    $.ajax({
        url: 'ajaxListaDePreciosReingenieriaCalcular.php?token='+document.getElementById('mToken').value,
        type: 'POST',
        datatype :'json',
        async: true,
        data: {
			'indice': indiceOriginal,
            'articulo': articulo['id'],
            'incluirDependientes': contenedorDeResultados['incluirDependientes'],
            'aplicaMinimoUtilidad':  booleanoANumero(!$('#chkMinimo'+indice).is(':checked')),
            'minimoUtilidad': articulo['porcminimorubro'],
            'costo': articulo['costoConImpuesto'],
            'excepcion': excepcion,
            'porcentajeLista': articulo['porcentajeLista'],
			'listasDependientes':arrListas,
			'totalListasDependientes':l
		},
        success: function(resultado){
            articulos = contenedorDeResultados['registros'];
            resJson = $.parseJSON(resultado);

            articuloX = articulos[resJson['indice']];


            idArticulo = resJson['articulo'];
            $("#divPrecioFinal-"+idArticulo).html('$'+formatearPrecio(resJson['precio']));
			listas = resJson['listasDependientes'];
			/* asigno los nuevos valores */
            articuloX['aplicaminutilidad'] =  booleanoANumero(!$('#chkMinimo'+indice).is(':checked'));
            articuloX['listadetalleprecio'] = resJson['precio'];

            if($('#inpPrecioExcepcion'+articuloX['id'])) {
                articuloX['precioexcepcion'] = $('#inpPrecioExcepcion'+articuloX['id']).val();
            }else{
                articuloX['precioexcepcion'] = '';
			}

            articuloX['edicion'] = resJson;
            articulos[resJson['indice']] = articuloX;
            contenedorDeResultados['registros'] = articulos;


            ingresarExcepcion(articuloX['id'],resJson['indice'],-1);

            for(l=0;l<resJson['totalListasDependientes'];l++){

            	articuloDependiente = articulos[parseFloat(resJson['indice']) + l +1];

            	listax = listas[l];
            	precio = parseFloat(listax['preciofinalNuevo']);
            	min = parseFloat(articuloX['costoConImpuesto']) +
					  parseFloat(articuloX['costoConImpuesto']) *
                    parseFloat(articuloX['porcminimorubro']) / 100;



                articuloDependiente['dependienteListaExcpecionPrecio'] = listax['precioExcepcion'];
                articuloDependiente['dependientePrecioCalculado'] = precio;
                articuloDependiente['listadetalleprecio'] = resJson['precio'];

                formatearDependiente(idArticulo,
									l,
                    articuloX['costoConImpuesto'],
									precio,
									min,
									resJson['precio'],
									listax['precioExcepcion'],
									parseFloat(articuloDependiente['dependientePorcentajeExcepcion']),
                    				parseFloat(resJson['indice'])
									);

			}



			$("#fila1-"+idArticulo).addClass('tblFilaEditada');
            $("#fila2-"+idArticulo).addClass('tblFilaEditada');
            $("#fila3-"+idArticulo).addClass('tblFilaEditada');

            $('#reporteCompleto').removeClass('divBuscandoInformacion');

        },
        error: function(){
            alert('Error al cargar los datos.') ;

            $('#reporteCompleto').removeClass('divBuscandoInformacion');
        }
    });

}
function formatearDependiente(idArticulo,l,costo,precio,min,base,excepcion,proporcional,indice){

    $("#dependienteFila-"+idArticulo+'-'+l).addClass('tblFilaEditada');

    $("#dependienteFila-"+idArticulo+'-'+l).removeClass('tblFilaDestacadaPorDebajoDelMinimo');
    $("#dependienteFila-"+idArticulo+'-'+l).removeClass('tblFilaDestacadaPorDebajoCosto');


    if(parseFloat(costo) > precio ){
        $("#dependienteFila-"+idArticulo+'-'+l).addClass('tblFilaDestacadaPorDebajoCosto');
        $("#dependienteFila-"+idArticulo+'-'+l).removeClass('tblFilaEditada');
    }else {
        if (min > precio) {
            $("#dependienteFila-" + idArticulo + '-' + l).addClass('tblFilaDestacadaPorDebajoDelMinimo');
            $("#dependienteFila-"+idArticulo+'-'+l).removeClass('tblFilaEditada');
        }
    }
    $("#dependienteFila-"+idArticulo+'-'+l+'PrecioCalculado').html('$'+formatearPrecio(precio));
    $("#dependienteFila-"+idArticulo+'-'+l+'Base').html('$'+formatearPrecio(base));
    if (formatearPrecio(proporcional)=='0.00'){
        $("#dependienteFila-"+idArticulo+'-'+l+'Observaciones').html('');
    }else{
        $("#dependienteFila-"+idArticulo+'-'+l+'Observaciones').html(formatearPrecio(proporcional)+'%');
    }

    $("#DependienteExcepcion-"+idArticulo+'-'+l).val(formatearPrecio(excepcion));

    ingresarExcepcion(idArticulo,indice,l);

}
function modificarExcepcionDependiente(indice,indiceLista)
{
    articulos = contenedorDeResultados['registros'];
    articulo = articulos[parseFloat(indice) + parseFloat(indiceLista) + 1];

    costo = articulo['costoConImpuesto'];

    min = parseFloat(articulo['costoConImpuesto']) +
        parseFloat(articulo['costoConImpuesto']) *
        parseFloat(articulo['porcminimorubro']) / 100;

    precioBase =parseFloat(articulo['listadetalleprecio']);

    proporcion = articulo['dependienteAumentoSobreRubro'];
    if($('#DependienteExcepcion-'+articulo['id']+'-'+indiceLista)){
        excepcion = parseFloat($('#DependienteExcepcion-'+articulo['id']+'-'+indiceLista).val());
        proporcion = (excepcion / precioBase -1)* 100;
        if(excepcion==0){
            proporcion = articulo['dependienteAumentoSobreRubro'];
		}
	}


    $('#reporteCompleto').addClass('divBuscandoInformacion');
    $.ajax({
        url: 'ajaxListaDePreciosReingenieriaCalcular.php?token='+document.getElementById('mToken').value,
        type: 'POST',
        datatype :'json',
        async: true,
		extra:{
        	'indiceLista' :  indiceLista,
			'proporcion': proporcion,
			'excepcion':excepcion
		},
        data: {
            'indice': indice,
            'articulo': articulo['id'],
            'incluirDependientes': 0,
            'aplicaMinimoUtilidad':  0,
            'minimoUtilidad': proporcion,
            'costo': precioBase,
            'excepcion': excepcion,
            'porcentajeLista': proporcion,
            'totalListasDependientes':0
        },
        success: function(resultado){

            articulos = contenedorDeResultados['registros'];
            resJson = $.parseJSON(resultado);
            articulo = articulos[parseFloat(resJson['indice']) + parseFloat(this.extra['indiceLista']) + 1];

            articulo['dependienteListaExcpecionPrecio'] = this.extra['excepcion'];
            articulo['dependientePorcentajeExcepcion'] = parseFloat(this.extra['proporcion']);
            articulo['editado']= true;
            if(parseFloat(articulo['dependientePorcentajeExcepcion'])==articulo['dependienteAumentoSobreRubro']){
                articulo['dependienteListaExcpecionPrecio'] = '';
                articulo['dependientePorcentajeExcepcion'] = '';
            }
            $("#listaExcepcionPorcentaje-"+articulo['id']+"-"+this.extra['indiceLista']).val(articulo['dependientePorcentajeExcepcion']);
            articulo['dependientePrecioCalculado'] = resJson['precio'];

            min = parseFloat(articulo['costoConImpuesto']) +
                parseFloat(articulo['costoConImpuesto']) *
                parseFloat(articulo['porcminimorubro']) / 100;

            articulos[parseFloat(resJson['indice']) + parseFloat(this.extra['indiceLista']) + 1] = articulo ;
            contenedorDeResultados['registros'] = articulos;
            formatearDependiente(articulo['id'],
								this.extra['indiceLista'],
                				articulo['costoConImpuesto'],
                				articulo['dependientePrecioCalculado'],
								min,
                				articulo['listadetalleprecio'],
                				articulo['dependienteListaExcpecionPrecio'],
                                articulo['dependientePorcentajeExcepcion'],
                				resJson['indice']
								);
            $('#reporteCompleto').removeClass('divBuscandoInformacion');

        },
        error: function(){
            alert('Error al cargar los datos.') ;

            $('#reporteCompleto').removeClass('divBuscandoInformacion');
        }
    });

}
function ingresarExcepcion(idArticulo,indice,indiceLista){
    articulos = contenedorDeResultados['registros'];
    articulo = articulos[parseFloat(indice) + parseFloat(indiceLista) + 1];
    articulo['indice'] = parseFloat(indice);
    articulo['indiceLista'] = indiceLista;

    if(parseFloat(articulo['esDependiente']) == 0){
        div = "divExcepcion-"+articulo['id'];
    }else{
        div = "dependienteFila-"+articulo['id']+"-"+articulo['indiceLista']+'Excepcion';
    }

    _.templateSettings.variable = "articulo";
    var template = _.template($("#templateListaDePreciosIngresar").html());
    $( "#"+div ).html(template(articulo));
}
function ingresarExcepcionInput(idArticulo,indice,indiceLista){
    articulos = contenedorDeResultados['registros'];
    articulo = articulos[parseFloat(indice) + parseFloat(indiceLista) + 1];
    articulo['indice'] = indice;
    articulo['indiceLista'] = indiceLista;

    if(parseFloat(articulo['esDependiente']) == 0){
        div = "divExcepcion-"+articulo['id'];
    }else{
        div = "dependienteFila-"+articulo['id']+"-"+articulo['indiceLista']+'Excepcion';
    }

    _.templateSettings.variable = "articulo";
    var template = _.template($("#templateListaDePreciosIngresarInput").html());
    $( "#"+div ).html(template(articulo));
}
function mostrarDetalleExistencias(indice)
{
    articulos = contenedorDeResultados['registros'];
    articulo = articulos[parseFloat(indice)];

    url = 'ajaxModificadorDePreciosDetalle.php';
    data = {'articuloId':articulo['id']};
    variable = 'existencias';
    template = 'templateListaDePreciosExistencias';
    divResultado = 'existencias'+indice;
    extra = {'indice':indice};

    cargarAjaxGenericoJson(url, data, variable, template, divResultado,extra);
}
function verModificacionesAvanzar(){
    if(!validarTodosLosPreciosTemporales()){
        $( "#main" ).show();
        return;
    }
    if(!validarTodasLasPromocionesPorArticulo()){
        $( "#main" ).show();
        return;
    }
    $( "#main" ).hide();
    _.templateSettings.variable = "resultado";
    let template = _.template($("#templateListaDePreciosModificaciones").html());
    $( "#mainAux" ).html(template(contenedorDeResultados));
}
function verModificaciones(){
    $( "#main" ).hide();
    let timer = setTimeout(function(){

                console.log("cleartimeout");
                clearTimeout(timer);
                verModificacionesAvanzar();
            }, 1000);

}
function guardarModificaciones() {

    let action = 'principal.php?token='+$('#mToken').val()+'&pagina=lipreresve';

    $('#frmGuardarModificaciones').attr('action',action);
    $("#frmGuardarModificaciones" ).submit();
}
function atrasModificaciones(){

    $( "#mainAux" ).html("");
    $( "#main" ).show();
}
function establecerCosto(idarticulo,idcompradetalle,indice)
{
    if(confirm('ATENCION: Esta apunto de cambiar el costo del articulo, ¿Desea continuar?'))
    {


        $('#reporteCompleto').addClass('divBuscandoInformacion');

        $.ajax({
            url: 'ajaxListaDePreciosCambiarCosto.php?token='+document.getElementById('mToken').value,
            type: 'POST',
            datatype :'json',
            async: true,
            'indice':indice,
            data: {
                'articuloId': idarticulo,
                'compraDetalleId': idcompradetalle},
            success: function(resultado){
                resultadoX = $.parseJSON(resultado);

                if(resultadoX['error']==1){
                    alert(resultadoX['mensajeError']);
                }else {
                    costos = resultadoX['costos'];
                    costo = costos[0];

                    articulos = contenedorDeResultados['registros'];
                    articulo = articulos[this.indice];
                    articulo['costo'] = costo['costoSinImpuestos'];
                    articulo['costoConImpuesto'] = costo['costoConImpuestos'];
                    articulo['impuestos'] = costo['totalImpuestos'];
                    articulo['idcomprareferencia'] = resultadoX['compraDetalleId'];

                    articulo['tieneCompraAsociada'] = 1;


                    articulos[this.indice] = articulo ;
                    contenedorDeResultados['registros'] = articulos;


                    actualizarRenglon(this.indice);

                    dEx = Array();
                    dEx['indice'] = this.indice;
                    resultadoX['datosExtra'] = dEx;

                    mostrarTemplateGeneral(
                        resultadoX,
                        'existencias',
                        'templateListaDePreciosExistencias',
                        'existencias' + this.indice);
                }

                $('#reporteCompleto').removeClass('divBuscandoInformacion');

            },
            error: function(){
                alert('Error al cargar los datos.') ;

                $('#reporteCompleto').removeClass('divBuscandoInformacion');
            }
        });
    }
}

/*   AGREGAR NUEVO  PRECIO TEMPORAL */

function addNuevoPrecioTemporal(articuloId,indicePrincipal){

        preciosTemporales = contenedorDeResultados['preciosTemporales'];
        preciosTemporalesArticulo = preciosTemporales[articuloId];
        if(!preciosTemporalesArticulo){
            preciosTemporalesArticulo = [];
        }
        indiceNuevo = preciosTemporalesArticulo.length;
        preciosTemporalesArticulo[indiceNuevo] =
            {

                'idusuarioaudito': 0,
                'fechahoraaudicion': '',
                'idarticulo': articuloId,
                'fechacaducidad': '',
                'cantidadmaxima': '',
                'idlistaprecio':'',
                'listaNombre':'Todas',
                'idsucursal':'',
                'sucursalNombre':'Todas',
                'precio':'',
                'activo': 1,
                'editado': 1
            };

        preciosTemporales[articuloId] = preciosTemporalesArticulo;
        contenedorDeResultados['preciosTemporales'] = preciosTemporales;

        variablesPreciosTemporal = {
            'resultado':this.contenedorDeResultados,
            'articulo':{'id':articuloId, 'indicePrincipal':indicePrincipal}
        };
        ((contenedorDeResultados['registros'])[indicePrincipal])['editado'] = 1;

        mostrarTemplateGeneral(variablesPreciosTemporal,'variablesPreciosTemporal','templatePreciosTemporalesTemplate','preciosTemporales'+articuloId)
        precioTemporalCancelar(articuloId);
        $('#sel'+articuloId+'PrecioTemporalImporte'+indiceNuevo).val('');
        $('#sel'+articuloId+'PrecioTemporalImporte'+indiceNuevo).focus();

    /*
    json = {'datos':contenedorDeResultados,'articuloId':articuloId,'indicePrincipal':indicePrincipal};
    variable = 'info';
    template = 'addPreciosTemporalesTemplate';
    divResultado = 'addPrecioTemporal'+articuloId;
    mostrarTemplateGeneral(json, variable, template, divResultado)*/
}
function modificoUnPrecioTemporal(articuloId,indicePrincipal,indicePrecioTemporal){
    preciosTemporales = contenedorDeResultados['preciosTemporales'];
    preciosTemporalesArticulo = preciosTemporales[articuloId];
    if(!preciosTemporalesArticulo){
        preciosTemporalesArticulo = [];
    }

    (preciosTemporalesArticulo[indicePrecioTemporal])['idarticulo'] = articuloId;
    (preciosTemporalesArticulo[indicePrecioTemporal])['fechacaducidad'] = $('#sel'+articuloId+'PrecioTemporalFechaHasta'+indicePrecioTemporal).val();
    (preciosTemporalesArticulo[indicePrecioTemporal])['cantidadmaxima'] = formatearCantidad($('#sel'+articuloId+'PrecioTemporalCantidad'+indicePrecioTemporal).val());
    (preciosTemporalesArticulo[indicePrecioTemporal])['idlistaprecio'] = $('#sel'+articuloId+'PrecioTemporalLista'+indicePrecioTemporal).val();
    (preciosTemporalesArticulo[indicePrecioTemporal])['listaNombre'] = $('#sel'+articuloId+'PrecioTemporalLista'+indicePrecioTemporal+' option:selected').text();
    (preciosTemporalesArticulo[indicePrecioTemporal])['sucursalNombre'] = $('#sel'+articuloId+'PrecioTemporalSucursal'+indicePrecioTemporal+' option:selected').text();
    (preciosTemporalesArticulo[indicePrecioTemporal])['idsucursal'] = $('#sel'+articuloId+'PrecioTemporalSucursal'+indicePrecioTemporal).val();
    (preciosTemporalesArticulo[indicePrecioTemporal])['precio'] = formatearPrecio($('#sel'+articuloId+'PrecioTemporalImporte'+indicePrecioTemporal).val());
    (preciosTemporalesArticulo[indicePrecioTemporal])['activo'] = 1;
    (preciosTemporalesArticulo[indicePrecioTemporal])['editado'] = 1;

    preciosTemporales[articuloId] = preciosTemporalesArticulo;
    contenedorDeResultados['preciosTemporales'] = preciosTemporales;

    variablesPreciosTemporal = {
        'resultado':this.contenedorDeResultados,
        'articulo':{'id':articuloId, 'indicePrincipal':indicePrincipal}
    };
    ((contenedorDeResultados['registros'])[indicePrincipal])['editado'] = 1;

    mostrarTemplateGeneral(variablesPreciosTemporal,'variablesPreciosTemporal','templatePreciosTemporalesTemplate','preciosTemporales'+articuloId)
    precioTemporalCancelar(articuloId);
}
function verParametro(parametro,nombre)
{
    return parametro;
}
function precioTemporalCancelar(articuloId){
    $('#addPrecioTemporal'+articuloId).html('');
}
function precioTemporalAceptar(articuloId,indicePrincipal){
/*
    if(precioTemporalDatosValidos(articuloId)){
        preciosTemporales = contenedorDeResultados['preciosTemporales'];
        preciosTemporalesArticulo = preciosTemporales[articuloId];
        if(!preciosTemporalesArticulo){
            preciosTemporalesArticulo = [];
        }
        preciosTemporalesArticulo[preciosTemporalesArticulo.length] =
            {
                'idusuarioaudito': 0,
                'fechahoraaudicion': '00/00/0000',
                'idarticulo': articuloId,
                'fechacaducidad': $('#sel'+articuloId+'PrecioTemporalFechaHasta').val(),
                'cantidadmaxima': $('#sel'+articuloId+'PrecioTemporalCantidad').val(),
                'idlistaprecio':$('#sel'+articuloId+'PrecioTemporalLista').val(),
                'listaNombre':$('#sel'+articuloId+'PrecioTemporalLista  option:selected').text(),
                'idsucursal':$('#sel'+articuloId+'PrecioTemporalSucursal').val(),
                'sucursalNombre':$('#sel'+articuloId+'PrecioTemporalSucursal  option:selected').text(),
                'precio':$('#sel'+articuloId+'PrecioTemporalImporte').val(),
                'activo': ($('#inpActivo'+articuloId).is(':checked') ? 1 : 0 ),
                'editado': 1
            };

        preciosTemporales[articuloId] = preciosTemporalesArticulo;
        contenedorDeResultados['preciosTemporales'] = preciosTemporales;

        variablesPreciosTemporal = {
                                        'resultado':this.contenedorDeResultados,
                                        'articulo':{'id':articuloId, 'indicePrincipal':indicePrincipal}
                                    };
        ((contenedorDeResultados['registros'])[indicePrincipal])['editado'] = 1;

        mostrarTemplateGeneral(variablesPreciosTemporal,'variablesPreciosTemporal','templatePreciosTemporalesTemplate','preciosTemporales'+articuloId)
        precioTemporalCancelar(articuloId);
    }

 */
}
function precioTemporalDatosValidos(articuloId){
    if(!(parseFloat($('#sel'+articuloId+'PrecioTemporalImporte').val()) > 0) ){
        alert('Debe ingrear un precio');
        return false;
    }
    if(parseFloat($('#sel'+articuloId+'PrecioTemporalCantidad').val()) < 1){
        alert('La cantidad no es valida.');
        return false;
    }
    return true;
}
function precioTemporalDeshacerEliminar(articuloId,indice,indicePrincipal){
    (((contenedorDeResultados['preciosTemporales'])[articuloId])[indice])['activo']= 1;
    (((contenedorDeResultados['preciosTemporales'])[articuloId])[indice])['editado']= 1;
    ((contenedorDeResultados['registros'])[indicePrincipal])['editado'] = 1;

    variablesPreciosTemporal = {
        'resultado':this.contenedorDeResultados,
        'articulo':{'id':articuloId,'indicePrincipal':indicePrincipal}
    };

    mostrarTemplateGeneral(variablesPreciosTemporal,'variablesPreciosTemporal','templatePreciosTemporalesTemplate','preciosTemporales'+articuloId)
    precioTemporalCancelar(articuloId);
}
function precioTemporalEliminar(articuloId,indice,indicePrincipal){
    if(confirm("Esta seguro que desea eliminar el precio temporal.")){
        /*preciosTemporales = contenedorDeResultados['preciosTemporales'];
        preciosTemporalesArticulo = preciosTemporales[articuloId];
        variablesPreciosTemporal = preciosTemporalesArticulo[indice];
        variablesPreciosTemporal['activo'] = 0;
        preciosTemporalesArticulo[indice] = variablesPreciosTemporal;
        preciosTemporales[articuloId] = preciosTemporalesArticulo  ;
        contenedorDeResultados['preciosTemporales'] = preciosTemporales;
        */


        (((contenedorDeResultados['preciosTemporales'])[articuloId])[indice])['activo']= 0;
        (((contenedorDeResultados['preciosTemporales'])[articuloId])[indice])['editado']= 1;
        ((contenedorDeResultados['registros'])[indicePrincipal])['editado'] = 1;

        variablesPreciosTemporal = {
            'resultado':this.contenedorDeResultados,
            'articulo':{'id':articuloId,'indicePrincipal':indicePrincipal}
        };

        mostrarTemplateGeneral(variablesPreciosTemporal,'variablesPreciosTemporal','templatePreciosTemporalesTemplate','preciosTemporales'+articuloId)
        precioTemporalCancelar(articuloId);
    }
}
function validarTodosLosPreciosTemporales(){
    preciosTemporales = contenedorDeResultados['preciosTemporales'];
    for(indiceArticulos in preciosTemporales){
        preciosArticulo =  preciosTemporales[indiceArticulos];
        for(indicePrecios in preciosArticulo){
            filaPrecio = preciosArticulo[indicePrecios];
            if(filaPrecio['activo']==1) {
                if (!(filaPrecio['precio'] > 0)) {
                    alert('El PRECIO TEMPORAL debe ser mayor a cero.');
                    $('#sel' + indiceArticulos + 'PrecioTemporalImporte' + indicePrecios).focus();
                    return false;
                }
                /*
                if (filaPrecio['cantidadmaxima'] != "" && filaPrecio['cantidadmaxima'] != null && filaPrecio['cantidadmaxima'] < 1) {
                    alert('La cantidad en PRECIOS TEMPORALES de venta debe ser mayor a cero y no '+filaPrecio['cantidadmaxima']+'.');
                    $('#sel' + indiceArticulos + 'PrecioTemporalCantidad' + indicePrecios).focus();
                    return false;
                }*/
                if (filaPrecio['fechacaducidad'] + '' != '' && filaPrecio['fechacaducidad'] != null &&  !fechaEsMayor(filaPrecio['fechacaducidad'])) {
                    alert('Le fecha de hasta del PRECIO TEMPORAL debe ser mayor al dia de hoy.');
                    $('#sel' + indiceArticulos + 'PrecioTemporalFechaHasta' + indicePrecios).focus();

                    return false;
                }
            }
        }
    }
    return true;
}

/* FUNCIONES PARA PROMOCIONES POR ARTICULO ************************************/
function promocionArticuloEliminar(articuloId,indice,indicePrincipal,estado){
    if(estado !=1){
        if(!confirm("Esta seguro que desea eliminar LA PROMOCION POR CANTIDAD.")) {
            return '';
        }
    }

    ((((contenedorDeResultados['promociones'])['articulosPromociones'])[articuloId])[indice])['activo']= estado;
    ((((contenedorDeResultados['promociones'])['articulosPromociones'])[articuloId])[indice])['editado']= 1;
    ((contenedorDeResultados['registros'])[indicePrincipal])['editado'] = 1;

    variablesPromocionesArticulos = {
        'resultado':this.contenedorDeResultados,
        'articulo':{'id':articuloId,'indicePrincipal':indicePrincipal}
    };

    mostrarTemplateGeneral(variablesPromocionesArticulos,
        'variablesPromocionesArticulos','templatePromocionesArticuloTemplate','promocionesArticulo'+articuloId)


}


function modificoUnaPromocionArticulo(articuloId,indicePrincipal,indicePromocionArticulo){
    promocionesArticulos = (contenedorDeResultados['promociones'])['articulosPromociones'];
    promocionesArticulo = promocionesArticulos[articuloId];
    if(!promocionesArticulo){
        promocionesArticulo = [];
    }

    (promocionesArticulo[indicePromocionArticulo])['idarticulo'] = articuloId;
    (promocionesArticulo[indicePromocionArticulo])['cantidad'] = $('#sel'+articuloId+'PromocionArticuloCantidad'+indicePromocionArticulo).val();
    (promocionesArticulo[indicePromocionArticulo])['idpromocion'] = $('#sel'+articuloId+'PromocionArticulo'+indicePromocionArticulo).val();
    (promocionesArticulo[indicePromocionArticulo])['promocionDescripcion'] = $('#sel'+articuloId+'PromocionArticulo'+indicePromocionArticulo+' option:selected').text();
    (promocionesArticulo[indicePromocionArticulo])['precio'] = $('#sel'+articuloId+'PromocionArticuloImporte'+indicePromocionArticulo).val();
    (promocionesArticulo[indicePromocionArticulo])['activo'] = 1;
    (promocionesArticulo[indicePromocionArticulo])['editado'] = 1;

    promocionesArticulos[articuloId] = promocionesArticulo;
    (contenedorDeResultados['promociones'])['articulosPromociones'] = promocionesArticulos;

    variablesPromocionesArticulos = {
        'resultado':this.contenedorDeResultados,
        'articulo':{'id':articuloId, 'indicePrincipal':indicePrincipal}
    };
    ((contenedorDeResultados['registros'])[indicePrincipal])['editado'] = 1;

    mostrarTemplateGeneral(variablesPromocionesArticulos,'variablesPromocionesArticulos','templatePromocionesArticuloTemplate','promocionesArticulo'+articuloId)

}

function addNuevaPromocionArticulo(articuloId,indicePrincipal){

    promocionesArticulos = (contenedorDeResultados['promociones'])['articulosPromociones'];
    promocionesArticulo = promocionesArticulos[articuloId];
    if(!promocionesArticulo){
        promocionesArticulo = [];
    }
    indiceNuevo = promocionesArticulo.length;
    promocionesArticulo[indiceNuevo] =
        {

            'idpromocion': '',
            'idarticulo': articuloId,
            'cantidad': '',
            'descripcion':'No seleccionada',
            'idsucursal':'',
            'precio':'',
            'activo': 1,
            'editado': 1
        };

    promocionesArticulos[articuloId] = promocionesArticulo;
    (contenedorDeResultados['promociones'])['articulosPromociones']= promocionesArticulos;

    variablesPromocionesArticulos = {
        'resultado':this.contenedorDeResultados,
        'articulo':{'id':articuloId, 'indicePrincipal':indicePrincipal}
    };

    ((contenedorDeResultados['registros'])[indicePrincipal])['editado'] = 1;

    mostrarTemplateGeneral(variablesPromocionesArticulos,'variablesPromocionesArticulos','templatePromocionesArticuloTemplate','promocionesArticulo'+articuloId)

    $('#sel'+articuloId+'PromocionArticuloImporte'+indiceNuevo).val('');
    $('#sel'+articuloId+'PromocionArticuloImporte'+indiceNuevo).focus();

}
function validarTodasLasPromocionesPorArticulo(){
    articulosPromociones = (contenedorDeResultados['promociones'])['articulosPromociones'];
    for(indiceArticulos in articulosPromociones){
        promocionesArticulo =  articulosPromociones[indiceArticulos];
        for(indicePromociones in promocionesArticulo){
            promocionArticulo = promocionesArticulo[indicePromociones];

            if(promocionArticulo['activo']==1) {
                if (!(promocionArticulo['precio'] > 0)) {
                    alert('El PRECIO de la PROMOCION debe ser mayor a cero.');
                    $('#sel' + indiceArticulos + 'PromocionArticuloImporte' + indicePromociones).focus();
                    return false;
                }

                if (promocionArticulo['cantidad'] == "" || promocionArticulo['cantidad'] == null || promocionArticulo['cantidad'] < 1) {
                    alert('La PROMOCION POR CANTIDAD debe ser mayor a cero.');
                    $('#sel' + indiceArticulos + 'PromocionArticuloCantidad' + indicePrecios).focus();
                    return false;
                }
                if (promocionArticulo['idpromocion'] == "") {
                    alert('Debe seleccionaruna PROMOCION.');
                    $('#sel' + indiceArticulos + 'PromocionArticulo' + indicePrecios).focus();
                    return false;
                }
            }
        }
    }
    return true;
}