var articulosSeleccionados = Array();
function agregarArticuloX()
{

    var codigo = $('#inpArticuloCodigo').val();

    if($('#inpArticuloCodigo').val()==""){
    	alert('Debe seleccionar un articulo.');
    	return;
	}

    for(i=0; i < articulosSeleccionados.length; i++){
    	art = articulosSeleccionados[i];
    	if(art.codigo == codigo){
    		alert("El articulo ya fue seleccionado.");
    		return;
		}
	}

    $.ajax({
        url : 'obtenerArticulosJson.php?token='+document.getElementById('mToken').value,
        type : 'POST',
        datatype : 'json',
        async : true,
        data : {'inpCodigo':codigo,
            'detallePrecios':0
        },
        success : function(resultado) {
            json = $.parseJSON(resultado);

            if (json.error) {
                articuloSeleccionado = false;
                if (json.errorTipo == "no_hay_articulo")
                {
                    alert("El articulo no existe, esta inactivo o no fue configurada la lista de precios.");
                }else{
                    alert(json.errorDescripcion);
                }
            } else {
                articulosSeleccionados[articulosSeleccionados.length] = json;
                $('#inpArticuloCodigo').val('');

                _.templateSettings.variable = "resultado";

                var template = _.template(
                    $( "#templateArticulosSeleccionados" ).html()
                );
                $( "#divResultado").html(
                    template(articulosSeleccionados)
                );
            }

        },
        error : function() {
            alert('Pagina inexistente');
        }
    });
}

function eliminarArticulo(indice){
    articulosAux = Array();
	for(i=0; articulosSeleccionados.length > i;i++ ){
		if(i!=indice){
            articulosAux[articulosAux.length] = articulosSeleccionados[i];
        }
	}

    articulosSeleccionados = articulosAux;

    _.templateSettings.variable = "resultado";

    var template = _.template(
        $( "#templateArticulosSeleccionados" ).html()
    );
    $( "#divResultado").html(
        template(articulosSeleccionados)
    );

}
function actualizarArticulo(){
    action = 'principal.php?token='+$('#mToken').val()+'&pagina=lstmdfprcsrclclract';

    $('#frm').attr('action',action);
    $("#frm").submit();
}

function presionaTeclaEnCodigo(tecla){
    if (tecla.keyCode == 113) {
        abrirBuscador('inpArticuloCodigo','articulos');
    }
    if (tecla.keyCode == 13) {
        agregarArticuloX();
    }

}
function actualizarTodosLosPRecios(){
    mostrarTemplateGeneral({},'nada','templateActualizarTodoAguarde','divRecalcularTodo');

    cargarAjaxGenericoJson(
        'ajaxActualizacionManualDePrecios.php',
        null,
        'resultado',
        'templateActualizarTodoResultado',
        'divRecalcularTodo');
}