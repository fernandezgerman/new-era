function irInicio(){
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=inicio';
	$('#frmVolver').attr('action',action);
	$("#frmVolver" ).submit();
}
function irMovimientosCajaLista(){
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=mvmcjal';
	$('#frmVolver').attr('action',action);
	$("#frmVolver" ).submit();
}
function irCajaActual(){
	action = 'principal.php?token='+$('#mToken').val()+'&withFrame=1&pagina=cjaactual';
	$('#frmVolver').attr('action',action);
	$("#frmVolver" ).submit();
}
