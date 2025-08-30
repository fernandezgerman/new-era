function verPlanillaLiquidacion(idSucursal,origen,oEvent){

/*
	$('#frmPlanillaLiquidacion').attr('target', '');

	if(oEvent) {
		if (oEvent.ctrlKey) {
			$('#frmPlanillaLiquidacion').attr('target', '_blank');
		}
	}
*/
	$('#frmPlanillaLiquidacion').attr('target', '_blank');

	$("#frmPlanillaLiquidacion input[name=sucursalId]").val(idSucursal);
	$("#inpPaginaRetorno").val(origen);


	action = 'principal.php?token='+$('#mToken').val()+'&pagina=lqdscplnll';
	$('#frmPlanillaLiquidacion').attr('action',action);
	$("#frmPlanillaLiquidacion" ).submit();

}

function mostrarDetalleConceptoLiq(planillaLiquidacionId,sucursalId){
	url = 'ajaxLiquidacionPlanillaDatos.php';
	data = {'inpPlanillaLiquidacionId':planillaLiquidacionId};
	variable  = 'datos';
	template = 'templateLiquidacionesPlanillaVisor';
	divResultado = 'CONliqId'+sucursalId;
	extra = {'indice':'liqId'+sucursalId };
	callback = "showDetalle('"+ divResultado+"')";

	cargarAjaxGenericoJson(url, data, variable, template, divResultado, extra, callback);

}
function showDetalle(div){
	$('#'+div).show(1000);
}
function cerrarDetalleLiquidacion(div){
	$('#'+div).hide(1000);
}