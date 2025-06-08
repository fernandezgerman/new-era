
var datosReporte = Array();
var idRubrosSueldoOficina = ['66','44'];
var idUsuariosLocalUtilizados = Array();
function mostrarResultados(resultado) {
	_.templateSettings.variable = "resultado";
	cargarUsuariosSueldosUsados();

	var template = _.template($("#templateMostrarLista").html());
	$("#resultado").html(
			template(resultado));
}

$(document).ready(function() {
	mostrarResultados(datosReporte);		
});

function  cargarUsuariosSueldosUsados(){
	idUsuariosLocalUtilizados = Array();
	filas = datosReporte['articulos'];
	for(i=0;i < datosReporte.totalarticulos; i++) {
		fila = filas[i];
		if(fila['nuevoIdUsuarioSueldoLocal'] >0){
			idUsuariosLocalUtilizados.push(parseInt(fila['nuevoIdUsuarioSueldoLocal']));
		}

	}
}
function filaModificada(indice){
	
	filas = datosReporte['articulos'];
	fila = filas[indice];
	fila['nuevoRubroId'] = $('#gastosAdminSelectRubroId'+indice).val();
	fila['nuevoTipoGastoId'] = $('#gastosAdminSelectTipoGastoId'+indice).val();
	fila['nuevoActivo'] = $('#gastosAdminSelectActivoId'+indice).val();
	fila['nuevoActivo'] = $('#gastosAdminSelectActivoId'+indice).val();
	fila['nuevoIdUsuarioSueldoLocal'] = $('#gastosAdminSelectUsuarioId'+indice).val();

	
	editado = 0;
	if(fila['nuevoRubroId']!=fila['rubroId']){
		editado = 1;
	}
	if(parseInt(fila['nuevoActivo'])!= parseInt(fila['activo'])){
		editado = 1;
	}	
	if(parseInt(fila['nuevoTipoGastoId'])!=parseInt(fila['tipoGastoId'])){
		editado = 1;
	}
	if(parseInt(fila['idUsuarioSueldoLocal'])!=parseInt(fila['nuevoIdUsuarioSueldoLocal'])){
		editado = 1;
	}

	fila['editado'] =editado;
	filas[indice] = fila;
	datosReporte['articulos'] = filas;


	mostrarResultados(datosReporte);
}


function calcelarEdicionFila(indice){
	filas = datosReporte['articulos'];
	fila = filas[indice];
	fila['nuevoRubroId'] = fila['rubroId'];
	fila['nuevoActivo'] = fila['activo'];
	fila['nuevoTipoGastoId']=fila['tipoGastoId'];
	fila['nuevoIdUsuarioSueldoLocal']=fila['idUsuarioSueldoLocal'];
	fila['editado'] =0;
	filas[indice] = fila;
	datosReporte['articulos'] = filas;


	mostrarResultados(datosReporte);	
}
function calcelarTodo(){
	filas = datosReporte['articulos'];
	
	for(i=0;i < datosReporte.totalarticulos; i++){
		fila = filas[i];
		fila['nuevoRubroId'] = fila['rubroId'];
		fila['nuevoActivo'] = fila['activo'];
		fila['nuevoTipoGastoId']=fila['tipoGastoId'];
		fila['nuevoIdUsuarioSueldoLocal']=fila['idUsuarioSueldoLocal'];
		fila['editado'] =0;
		filas[i] = fila;		
	}
	datosReporte['articulos'] = filas;
	mostrarResultados(datosReporte);	
}
function verArticulo(id){

	action = 'principal.php?token='+$('#mToken').val()+'&pagina=artm&id='+id;
	
	$('#editarArticulo').attr('action',action);
	$("#editarArticulo" ).submit();	
}
function verRubro(id){
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=rbrm&id='+id;
	
	$('#editarRubro').attr('action',action);
	$("#editarRubro" ).submit();	
}
function guardarArticulos(){
	if(tieneUsuariosSueldosSinseleccionar()){
		if(!confirm('Aun le quedan usuarios que asociar a sueldos, desea guardar de todos modos?')){
			return false;
		}
	}
	action = 'principal.php?token='+$('#mToken').val()+'&pagina=admngstsgrdr';
	
	$('#frmArticulos').attr('action',action);
	$("#frmArticulos" ).submit();

}
function tieneUsuariosSueldosSinseleccionar(){
	filas = datosReporte['articulos'];

	for(i=0;i < datosReporte.totalarticulos; i++){
		fila = filas[i];

		if(idRubrosSueldoOficina.includes(fila['nuevoRubroId']) ){
			if(!(parseInt(fila['nuevoIdUsuarioSueldoLocal']) > 0 ) && parseInt(fila['nuevoActivo'])==1){
				return true;
			}
		}
	}
	return false;
}