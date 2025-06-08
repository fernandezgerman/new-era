	window.onbeforeunload = preguntarAntesDeSalir;
	function datosValidos(){
		if ($('#inpNombre').val() == ""){
			alert('Debe ingresar un nombre.');
			return false;
		}
		if ($('#inpTipoDescuentoId').val() == "0"){
			alert('Debe seleccionar un tipo de descuento.');
			return false;
		}
		if ($('#inpTipoDescuentoId').val() != "3"){
			if ($('#inpValorAsociado').val()=="")
			{			
				alert('Debe ingresar un valor asociado.');
				return false;
			}
			if (validaFloat($('#inpValorAsociado').val())==false)
			{			
				alert('El valor asociado no es valido.');
				return false;
			}			
		}		
		if ($('#inpLimiteDiario').is(':checked')){
			if($('#inpImporteLimite').val()==""){
				alert('Debe ingresar un importe limite.');
				return false;				
			}
		}
		if ($('#inpAutorizarPorPerfiles').is(':checked')){
			tPerfil = parseFloat($('#inpTotalPerfiles').val());
			selPerfil = false;
			for(p = 0; p < tPerfil ; p++){
				
				if ($('#inpPerfilId'+p).is(':checked')){
					selPerfil = true;
				}
			}
			if (!selPerfil){
				alert('Debe seleccionar un perfil autorizado para usar el descuento.');
				return false;			
			}
		}
		return true;
	}
	function mostrarValorAsociado()
	{
		
		if ($('#inpTipoDescuentoId').val() == "1" || $('#inpTipoDescuentoId').val() == "2")
		{
			
			$('#divValorAsociado').show(1);
			$('#divValorAsociado2').show(1);
		}else{
			$('#divValorAsociado').hide(1);
			$('#divValorAsociado2').hide(1);
			$('#inpValorAsociado').val("0");			
		}		
	}
	function enviar(){
		if (datosValidos()){
			bPreguntar = false;
			document.getElementById('frm').submit();
		}
	}

	$(document).ready(function() {
		mostrarValorAsociado();
		mostrarTextoLimiteDiario();
		mostrarPerfilesAutorizados();
	});
	
	function mostrarTextoLimiteDiario()
	{
		
		if ($('#inpLimiteDiario').is(':checked'))
		{
			$('#divLimiteDiario').show(1);
		}else{
			$('#divLimiteDiario').hide(1);			
		}		
	}	
	function mostrarPerfilesAutorizados()
	{
		
		if ($('#inpAutorizarPorPerfiles').is(':checked'))
		{
			$('#divListadoDePerfiles').show(1);
		}else{
			$('#divListadoDePerfiles').hide(1);			
		}		
	}		