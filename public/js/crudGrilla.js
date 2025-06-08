var grillaConfiguracion = false;
var cambiosCss= [];
var resultadoBusquedaCRUD = [];
function armarGrilla(){
	json = grillaConfiguracion;
	variable = 'configuracionCRUD';
	template = 'marcoCRUDTemplate';
	divResultado = 'flex1';
	mostrarTemplateGeneral(json, variable, template, divResultado);

	// CARGO LOS INPUTS PARA LOS FILTROS
	cargarInputsFiltros(json['columnas']);

	$('#flex1').show();

	for(let columnaIndice in grillaConfiguracion['columnas'])
	{
		let columna = (grillaConfiguracion['columnas'])[columnaIndice]
		if(columna['templateInput']){
			if((columna['templateInput'])['main']) {
				$('#inpFiltro' + (columna['templateInput'])['nombre']).focus();
			}
		}
	}
	if(grillaConfiguracion['cargaAutomatica']== true ){
		buscarListaCRUD();
	}

}
function cargarInputsFiltros(columnas){

	for(let c in columnas){
		let col = columnas[c];
		let temp = col['templateInput'];
		if (temp) {
			mostrarTemplateGeneral(temp, 'contenedorFiltros', temp['template'], temp['template'] + c);
		}

	}
}
$(document).ready(function(){
	armarGrilla();
});
function buscarListaCRUD(){
	let cols =[];
	datosCF = grillaConfiguracion['accesoADatos'];
	if(datosCF){
		if(datosCF['parametros']){
			for(let par in datosCF['parametros']){
				let parametro = (datosCF['parametros'])[par];
				if(parametro['tipo']=='POST'){
					if(parametro['check']){
						if($('#inpFiltro'+parametro['input']).is(':checked')){
							cols[par] = 1;
						}else{
							cols[par] = 0;
						}
					}else{
						if(parametro['multiselect']) {
							cols[par] = concatenarValoresMultiSelect($('#inpFiltro' + parametro['input']).val());
						}else{
							cols[par] = $('#inpFiltro' + parametro['input']).val();
						}
					}
				}else{
					cols[par] = parametro['input'];
				}
			}
			let data = {
				'permiso'	: datosCF['permiso'],
				'stored'	: datosCF['name'],
				'parametros': cols,
			};
			$('#CRUDBotonera').css('visibility','hidden');
			cargarAjaxGenericoJson(
				'ajaxCrudDatos.php',
				data,
				'configuracionCRUD',
				'contenidoCRUDTemplate',
				'divResultadoBusquedaCRUD',
				false,
				'finalizoBusqueda(json)'

				) ;

		}
	}
}
function finalizoBusqueda(json){
	resultadoBusquedaCRUD = json;
	realizarCambiosCss(cambiosCss);
	$('#CRUDBotonera').css('visibility','visible');
}
function realizarCambiosCss(cambiosCss){
	for(let indiceCambios in cambiosCss){
		let cambioCss = cambiosCss[indiceCambios];
		for(let indiceCambio in cambioCss){
			let valores = cambioCss[indiceCambio];

			$(indiceCambios).css(valores['name'],valores['value']);

		}
	}
}
function eliminar(indice){
	if(resultadoBusquedaCRUD['datos']){
		let fila_delete = (resultadoBusquedaCRUD['datos'])[indice];
	}
	if(fila_delete) {
		let url = grillaConfiguracion['origenDel'];
		/*let data = {'items': fila['id']}
		let extra = false;
		let callback = "resultadoEliminar(json)";
		ajaxGenericoJson(url, data, extra, callback);*/

		$.ajax({
			type: "POST",
			dataType: "json",
			url: url,
			data: "items="+fila_delete['id'],
			success: function(data){

				alert(data.query +" - Filas afectadas: "+data.total);
				if(data.total >0 )
				buscarListaCRUD();
			}
		});

	}
}
function resultadoEliminar(json){
	if(json['total']==0){
		alert(json['query']);
	}
}
function editar(indice){
	let fila = false;
	if(resultadoBusquedaCRUD['datos']){
		fila = (resultadoBusquedaCRUD['datos'])[indice];
	}
	if(fila) {
		let action = grillaConfiguracion['origenEdit']+'&id='+fila['id'];
		location.href=action;

	}

}
function agregar(){
	let action = grillaConfiguracion['origenIns'];
	location.href=action;
}
function crudPresionaTeclaFiltro(tecla)
{
	if(tecla.keyCode==13){
		buscarListaCRUD();
	}
}