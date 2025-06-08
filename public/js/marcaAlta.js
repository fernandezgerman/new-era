window.onbeforeunload = preguntarAntesDeSalir;

function datosValidos(){
	
	if (document.getElementById('inpNombre').value == ""){
		alert('Debe ingresar un nombre');
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

function mostrarArticulo(id){
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=artm&id='+id;
	
	
	$('#frmVerArticulo').attr('action',action);
	$("#frmVerArticulo" ).submit();	
		
}
function buscarArticulosParaAsociar(){
		if (!validarBusqueda()){
			return;
		}
	  $.ajax({
		  url: 'ajaxMarcasAgregar.php?token='+document.getElementById('mToken').value,
		  type: 'POST',
		  datatype :'json',
		  async: true,
		  data: {			  
			     'filtroNombreArticulo': $('#inpNombreArticulo').val(),
			     'filtroCodigoArticulo': $('#inpCodigoArticulo').val(),
			     'filtroIdProveedor': $('#inpProveedorId').val(),
			     'filtroIdMarcaExcluir': $('#inpId').val(),
			     'filtroCodigoRubro': $('#inpRubroId').val(),
			     'contenedor':'main'
			     },
		  success: function(resultado){
			  		res = $.parseJSON(resultado);			  		
					_.templateSettings.variable = "resultados";
					var template = _.template($( "#templateMarcasResultado").html());
				    $( "#resultadoBusqueda" ).html(template(res));
				    
				},
			  error: function(){
					alert('Error al cargar los datos.') ;
				}
			});
}
function validarBusqueda(){
    filtroNombreArticulo= $('#inpNombreArticulo').val();
    filtroCodigoArticulo= $('#inpCodigoArticulo').val();
    filtroIdProveedor= $('#inpProveedorId').val();
    filtroIdMarcaExcluir= $('inpId').val();
    filtroIdRubro= $('#inpRubroId').val();
    
    if(!filtroNombreArticulo && 
    		!filtroCodigoArticulo &&
    		!filtroIdProveedor  &&
    		!filtroIdRubro ){
    	alert('Debe ingresar algun valor antes de buscar.');
    	return false;
    }
    return true;
}
function seleccionarTodosArticulos(){
	t = parseFloat($('#totalArticulosPropuestos').val());
	
	for(c = 0 ; c < t; c++){
		if( $('#inpSeleccionoTodos').prop('checked') ) {
			$('#inpSeleccionoArticulo'+c).prop('checked',"checked");			
		}else{
			$('#inpSeleccionoArticulo'+c).prop('checked',"")
		}
	}
}