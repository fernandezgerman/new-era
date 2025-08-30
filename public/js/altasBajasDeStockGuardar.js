function agregarNuevoMovimiento()
{
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=mvmsl';
	
	$('#formulario').attr('action',action);
	$("#formulario" ).submit();		
}
function irAlListadoDeMovimientos()
{
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rptstckbjs';
	
	$('#formulario').attr('action',action);
	$("#formulario" ).submit();		
}