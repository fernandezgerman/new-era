resultadoLista = Array();
function mostrarResultados()
{ 
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateRentabilidadPorSucursalConImpuestos" ).html()
        );
    $( "#divResultado" ).html(
            template( resultadoLista )
        );    
} 
function datosValidos()
{
	return true;
}
function sucursales(){
	total = parseInt($("#inpTotalSucursales").val());
	sucs = ",";
	
	for (i =0; i < total; i++)
	{
		if ($("#suc"+i).is(':checked'))
		{
			sucs = sucs+$("#suc"+i).val()+",";
		}
	}
	if (sucs == ","){
		sucs = "";
	}
	return sucs;
}
function cargarGrilla(){
	
	inpRubroId = $('#inpRubroId').val();
	inpMarcaId = $('#inpMarcaId').val();
	inpCodigo = $('#inpCodigo').val();
	inpFechaDesde = $('#inpFechaDesde').val();
	inpFechaHasta = $('#inpFechaHasta').val();
	inpFechaHastaHora = $('#inpFechaHastaHora').val();
	inpFechaDesdeHora = $('#inpFechaDesdeHora').val();
	if (!inpFechaDesdeHora){
		inpFechaDesdeHora = '00:00:01';
	}	
	if (!inpFechaHastaHora){
		inpFechaHastaHora = '23:59:59';
	}
	if(inpFechaDesde==""){
		alert('Debe ingresar fecha desde.');
		return;
	}
	if(inpFechaHasta==""){
		alert('Debe ingresar fecha hasta.');
		return;
	}	
	inpHoraDesde = $('#inpHoraDesde').val();
	inpHoraHasta = $('#inpHoraHasta').val();
	inpOrden = $('#inpOrden').val();
	$('#divReporte').addClass('divBuscandoInformacion'); 
	sucs = sucursales();
	
	$.ajax({
		url : 'ajaxReporteRentabilidadSucursal.php?token='+$('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
				'inpRubroId':inpRubroId,
				'inpMarcaId':inpMarcaId,
				'inpCodigo':inpCodigo,
				'inpFechaDesde':inpFechaDesde,
				'inpFechaHasta':inpFechaHasta,
				'inpHoraDesde':inpHoraDesde,
				'inpHoraHasta':inpHoraHasta,
				'inpOrden':inpOrden,
				'inpFechaHastaHora': inpFechaHastaHora,
				'inpFechaDesdeHora':inpFechaDesdeHora,
				'sucs':sucs	}
		,	
		success : function(resultado) {
			json = $.parseJSON(resultado);			
			if (json.err == 1) {
				$('#divResultado').html(json.mensaje);
				alert(json.mensaje);
			} else {
				resultadoLista = json;
				mostrarResultados();
				
			}
			$('#divReporte').removeClass('divBuscandoInformacion');
		},
		error : function() {
			
			$('#divResultado').html("Error al obtener los datos. Pagina inexistente");
			$('#divReporte').removeClass('divBuscandoInformacion');
		}	
	});	
}

function verDetalleArreglosStock(idsucursal,fechaDesde,fechaHasta,fechaDesdeHora,fechaHastaHora){
	$("#formRentControlesDeStock input[name=inpSucursalBalance]").val(idsucursal);
	$("#formRentControlesDeStock input[name=inpFechaAperturaDesde]").val(fechaDesde);
	$("#formRentControlesDeStock input[name=inpFechaAperturaHasta]").val(fechaHasta);
	$("#formRentControlesDeStock input[name=inpFechaAperturaHastaHora]").val(fechaHastaHora);
	$("#formRentControlesDeStock input[name=inpFechaAperturaDesdeHora]").val(fechaDesdeHora);	
	$("#formRentControlesDeStock input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());
	

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptbalsuc';
	
	$('#formRentControlesDeStock').attr('action',action);
	$("#formRentControlesDeStock" ).submit();	
}

function verDetalleVentas(idsucursal,fechaDesde,fechaHasta,horaDesde,horaHasta,idRubro,codigoArticulo,fechaDesdeHora,fechaHastaHora,idMarca){
	$("#formRentabilidadVentas input[name=inpSucursalBalance]").val(idsucursal);
	$("#formRentabilidadVentas input[name=inpFechaDesde]").val(fechaDesde);
	$("#formRentabilidadVentas input[name=inpFechaHasta]").val(fechaHasta);
	$("#formRentabilidadVentas input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());
	
	
	$("#formRentabilidadVentas input[name=inpFechaDesdeHora]").val(fechaDesdeHora);
	$("#formRentabilidadVentas input[name=inpFechaHastaHora]").val(fechaHastaHora);
	
	$("#formRentabilidadVentas input[name=inpHoraDesde]").val(horaDesde);
	$("#formRentabilidadVentas input[name=inpHoraHasta]").val(horaHasta);
	$("#formRentabilidadVentas input[name=inpRubroId]").val(idRubro);
	$("#formRentabilidadVentas input[name=inpMarcaId]").val(idMarca);
	$("#formRentabilidadVentas input[name=inpCodigo]").val(codigoArticulo);
	
	

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptvspr';
	
	$('#formRentabilidadVentas').attr('action',action);
	$("#formRentabilidadVentas" ).submit();	
}

function verMovimientosDeStock(codigoArticulo,idSucursal,fechaDesde,fechaHasta,fechaDesdeHora,fechaHastaHora,idRubro,idMarca){
	
	$("#formMovimientosStock input[name=inpArticuloCodigo]").val(codigoArticulo);
	$("#formMovimientosStock input[name=inpSucursalIdUnico]").val(idSucursal);
	$("#formMovimientosStock input[name=inpFechaDesde]").val(fechaDesde);
	$("#formMovimientosStock input[name=inpFechaHasta]").val(fechaHasta);
	$("#formMovimientosStock input[name=inpFechaDesdeHora]").val(fechaDesdeHora);
	$("#formMovimientosStock input[name=inpFechaHastaHora]").val(fechaHastaHora);	
	$("#formMovimientosStock input[name=inpRubroId]").val(idRubro);
	$("#formMovimientosStock input[name=inpMarcaId]").val(idMarca);
	$("#formMovimientosStock input[name=inpTotalSucursales]").val($("#frm input[name=inpTotalSucursales]").val());	
	

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptstckbjs';
	
	$('#formMovimientosStock').attr('action',action);
	$("#formMovimientosStock" ).submit();	
}
