
	window.onbeforeunload = preguntarAntesDeSalir;	
	
	function datosValidos(){
		if ($('#inpMotivoMovimientoCajaId').val() == 0){
			alert('Debe seleccionar un motivo del movimiento');
			return false;
		}
		$idMotivo = $('#inpMotivoMovimientoCajaId').val();
		if ($esRetiro[$idMotivo] != 1){
			idSuc= parseInt($('#inpSucursalId').val());
			if (idSuc < 1){
				alert('Debe seleccionar una sucursal');
				return false;
			}
			if ($('#inpUsuarioDestinoId').val() == 0){
				alert('Debe seleccionar un destinatario del dinero');
				return false;
			}			
		}
		
		if ($('#inpImporte').val()==""){
			alert('Debe ingresar un importe');
			return false;			
		}
				
		if (!validaFloat($('#inpImporte').val())){
			alert('El importe no es valido');
			return false;			
		}
		return true;
	}
	function enviar(){
		if (datosValidos()){
			bPreguntar = false;
			document.getElementById('frm').submit();
		}
	}
	function verSiEsRetiro(){
		$idMotivo = $('#inpMotivoMovimientoCajaId').val();
		if ($idMotivo != 0){
			if ($esRetiro[$idMotivo] == 1){
				$('#filaUsrDestino').hide();
				$('#filaSucDestino').hide();
				$('#esRetiroDeCapital').val("1");
			}else{
				$('#filaUsrDestino').show();
				$('#filaSucDestino').show();
				$('#esRetiroDeCapital').val("0");
			}
				
		}
		
		 
	}