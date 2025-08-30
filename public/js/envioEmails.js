function validarDatos(){
	if ($("#inpFecha").val()==""){
		alert('Debe ingresar una fecha.');
		return false;
	}
	return true
}
function validarDatos899Y2101(){
    if ($("#inpFecha899Y2101").val()==""){
        alert('Debe ingresar una fecha.');
        return false;
    }
    return true
}
function enviarEmails(){
	if(!validarDatos()){
		return false;
	}
    $('#classBotonAceptar').hide();
    $.ajax({
        url : 'ajaxEnvioEmailsReporteGanaciasCantidades.php?token='+$('#mToken').val(),
        type : 'POST',
        datatype : 'json',
        async : true,
        data : {
        	'fecha':$('#inpFecha').val()
		},

        success : function(resultado) {
            json = $.parseJSON(resultado);
			alert(json.mensaje);
            $('#classBotonAceptar').show();
        },
        error : function() {
            alert('Error en el pedido AJAX.');
        }
    });
}
function enviarEmailEvolutivo899Y2101(){
    if(!validarDatos899Y2101()){
        return false;
    }
    $('#classBotonAceptar899Y2101').hide();
    $.ajax({
        url : 'ajaxEnvioEmailsReporteEvolucion899Y2101.php?token='+$('#mToken').val(),
        type : 'POST',
        datatype : 'json',
        async : true,
        data : {
            'fecha':$('#inpFecha899Y2101').val()
        },

        success : function(resultado) {
            json = $.parseJSON(resultado);
            alert(json.mensaje);
            $('#classBotonAceptar899Y2101').show();
        },
        error : function() {
            alert('Error en el pedido AJAX.');
        }
    });
}