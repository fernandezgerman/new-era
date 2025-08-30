function generarOrdenesDePagoConfirmacion(){	
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=gnrordnpgoprsave';
	
	$('#frmGenerarOP').attr('action',action);
	$('#frmGenerarOP').submit();
}
