window.onbeforeunload = preguntarAntesDeSalir;
var listasDePrecios = [];
var listasSeleccionadas = [];
$(document).ready(function(){
	cargarJson();
	cargarListas();
	mostrarCancelarAgregar();
	mostraCargaFacturas();
	mostraListasCargadas();
	$("#contenidoListasHorario").hide();
	clickMostrarLista();
	mostrarListasEnGrilla();
	mostrarValorizacion(1);
	clickMostrarListaFeriados();
	seleccionaRestringirArqueo();
});
function mostrarValorizacion(tiempo)
{
	if (!tiempo){
		tiempo = 500;
	}
	if ($('#inpValorizaSucursal').is(':checked')){
		$('#divValorizacionContenido').show(tiempo);
	}else{
		$('#divValorizacionContenido').hide(tiempo);
	}		
}

function clickEnDia(dia)
{
	if ($('#inpDiaRevision'+dia).val()==1){
		$('#inpDiaRevision'+dia).val(0);
		$('#divDiaRevision'+dia).attr('class', 'diaDeLaSemana');
	}else{
		$('#inpDiaRevision'+dia).val(1);
		$('#divDiaRevision'+dia).attr('class', 'diaDeLaSemanaSeleccion');
	}
}
function datosValidos(){
	if ($('#inpNombre').val() == ""){
		alert('Debe ingresar un nombre');
		return false;
	}
	if ($('#inpDescripcion').val() == ""){
		alert('Debe ingresar una descripcion');
		return false;
	}
	if ($('#inpDireccion').val() == ""){
		alert('Debe ingresar una direccion');
		return false;
	}
	if ($('#chkRestringirArqueosCaja').is(':checked')){
		if(!$('#txtRestringirArqueosHora').val() ){
			alert('Debe especificar una hora de restriccion de arqueo');
			$('#txtRestringirArqueosHora').focus();
			return false;
		}
		if(!$('#txtRestringirArqueosDuracion').val() || $('#txtRestringirArqueosDuracion').val() < 1 || $('#txtRestringirArqueosDuracion').val() > 24){
			alert('Debe especificar una duracion de restriccion mayor a 1 y menor a 24');
			$('#txtRestringirArqueosDuracion').focus();
			return false;
		}
		if($('#txtRestringirArqueosDuracion').val() == 0){
			alert('Debe seleccionar un perfil autorizado a realizar el cierre.');
			return false;
		}
		if($('#cmbRestringirArqueosExcepcionPerfilId').val() == 0){
			alert('Debe seleccionar un perfil para realizar el cierre los días que el usuario '+$('#cmbRestringirArqueosPerfilId  option:selected').text()+' no esta.');
			return false;
		}
	}
	return true;
}
function enviar(){
	if (datosValidos()){
		bPreguntar = false;
		document.getElementById('frm').submit();
	}
}

function mostraAgregarLista()
{
	_.templateSettings.variable = "listasDePrecios";
	
    var template = _.template($( "#templateListasAgregar" ).html());
    $( "#agregarListaHorario" ).html(template(listasDePrecios));    
}
function mostraCargaFacturas()
{
	_.templateSettings.variable = "listasSeleccionadas";
	
    var template = _.template(
            $( "#templateListasHoraPlural" ).html()
        );
    $( "#contenidoListasHorario" ).html(
            template( listasSeleccionadas )
        );    
}

function mostrarCancelarAgregar(resultado)
{
	_.templateSettings.variable = "resultado";
	
    var template = _.template(
            $( "#templateListasCancelarAgregar" ).html()
        );
    $( "#agregarListaHorario" ).html(
            template( resultado )
        );    
}

function mostraListasCargadas()
{
	_.templateSettings.variable = "listasSeleccionadas";
	
    var template = _.template(
            $( "#templateListasAgregadas" ).html()
        );
    $( "#listasAgregadas" ).html(
            template(listasSeleccionadas)
        );    
}
function agregarNuevaLista(){
	mostraAgregarLista();
}
function addListaSeleccion(idlista)
{
	listas = listasDePrecios.listas;
	for (i=0; i < listas.length; i++){
		aux = listas[i];
		if (aux.id ==idlista){
			lista = aux;
		}
	}
	nuevaLista = [];
	nuevaLista['lista'] = lista;
	nuevaLista['lu'] = $("#inpDiaRevisionLu").val();
	nuevaLista[1] = $("#inpDiaRevisionLu").val();
	nuevaLista['ma'] = $("#inpDiaRevisionMa").val();
	nuevaLista[2] = $("#inpDiaRevisionLu").val();
	nuevaLista['mi'] = $("#inpDiaRevisionMi").val();
	nuevaLista[3] = $("#inpDiaRevisionLu").val();
	nuevaLista['ju'] = $("#inpDiaRevisionJu").val();
	nuevaLista[4] = $("#inpDiaRevisionLu").val();
	nuevaLista['vi'] = $("#inpDiaRevisionVi").val();
	nuevaLista[5] = $("#inpDiaRevisionLu").val();
	nuevaLista['sa'] = $("#inpDiaRevisionSa").val();
	nuevaLista[6] = $("#inpDiaRevisionLu").val();
	nuevaLista['do'] = $("#inpDiaRevisionDo").val();
	nuevaLista[7] = $("#inpDiaRevisionLu").val();
	nuevaLista['inicio'] = $("#inpListaHoraInicio").val();
	nuevaLista['duracion'] = $("#inpListaHoraCantidad").val();
	listasSeleccionadas[listasSeleccionadas.length] = nuevaLista;
	
	
}
function listaHoraAgregarValida()
{
	var suma = $("#inpDiaRevisionLu").val() + 
			   $("#inpDiaRevisionMa").val() +
			   $("#inpDiaRevisionMi").val() +
			   $("#inpDiaRevisionJu").val() +
			   $("#inpDiaRevisionVi").val() +
			   $("#inpDiaRevisionSa").val() +
			   $("#inpDiaRevisionDo").val();
	if (suma == 0)
	{
		alert('Debe seleccionar un dia de la semana.');
		return false;
	}
	if ($("#inpIdListaHoraLista").val()== 0){
		alert("Debe seleccionar una lista de precios");
		return false;
	}
	/*for (i = 0; i < listasSeleccionadas.length; i ++){
		conjunto = listasSeleccionadas[i];
		lista = conjunto['lista'];
		if (lista.id == $("#inpIdListaHoraLista").val())
		{
			alert('No puede asignar dos veces la misma lista.');
			return false;
		}
	}*/
	if ($("#inpListaHoraInicio").val()== -1){
		alert("Debe seleccionar una hora de inicio");
		return false;
	}
	if ($("#inpListaHoraCantidad").val()< 1){
		alert("La duracion de la lista de precios no puede ser menor a 1");
		return false;
	}	
	if ($("#inpListaHoraCantidad").val()> 24){
		alert("La duracion de la lista de precios no puede ser mayor a 24");
		return false;
	}	
	if ($("#inpIdListaHoraLista").val() == $("#inpListaId").val())
	{
		alert('La lista de precios no puede ser la misma que la asignada como base en la sucursal');
		return false;
	}
	return true;
}
function mostrarListasEnGrilla(){
	i = 0;
	for(i=0;i<listasSeleccionadas.length;i++){
		objeto = listasSeleccionadas[i];
		lista = objeto['lista'];
		inicio = parseFloat(objeto['inicio']);
		duracion = parseFloat(objeto['duracion']);
		
		for(h=inicio; h < (inicio + duracion); h++){
			txtLu = "";
			txtMa = "";
			txtMi = "";
			txtJu = "";
			txtVi = "";
			txtSa = "";
			txtDo = "";
			if (objeto['lu']==1){
				dia = 1;
				txtLu = lista.nombre;
			} 
			if (objeto['ma']==1) {
				dia = 2;
				txtMa = lista.nombre;
			}
			if (objeto['mi']==1) {
				dia = 3;
				txtMi = lista.nombre;
			}
			if (objeto['ju']==1) {
				dia = 4;
				txtJu = lista.nombre;
			}
			if (objeto['vi']==1) {
				dia = 5;
				txtVi = lista.nombre;
			}
			if (objeto['sa']==1) {
				dia = 6;
				txtSa = lista.nombre;
			}
			if (objeto['do']==1) {
				dia = 7;
				txtDo = lista.nombre;
			}
			hora = h;
			suma = 0;
			if (h > 23){
				hora = h - 24;
				suma = 1
			}
			if (txtLu!= "") $("#D"+obtenerDia(1,suma)+"H"+hora).html(txtLu);
			if (txtMa!= "") $("#D"+obtenerDia(2,suma)+"H"+hora).html(txtMa);
			if (txtMi!= "") $("#D"+obtenerDia(3,suma)+"H"+hora).html(txtMi);
			if (txtJu!= "") $("#D"+obtenerDia(4,suma)+"H"+hora).html(txtJu);
			if (txtVi!= "") $("#D"+obtenerDia(5,suma)+"H"+hora).html(txtVi);
			if (txtSa!= "") $("#D"+obtenerDia(6,suma)+"H"+hora).html(txtSa);
			if (txtDo!= "") $("#D"+obtenerDia(7,suma)+"H"+hora).html(txtDo);
		}
	}
}
function obtenerDia(dia,suma)
{
	if ((dia + suma) > 7){
		return 1;
	}	
	else
	{
		return (dia + suma);
	}
}
function eliminarListaSeleccionada(idLista)
{
	arrAux = [];
	for(i=0;i<listasSeleccionadas.length;i++){
		objeto = listasSeleccionadas[i];
		lista = objeto.lista;
		if (lista.id != idLista) arrAux[arrAux.length] = objeto;
	}
	listasSeleccionadas = arrAux;
	mostraCargaFacturas();
	mostraListasCargadas();
	mostrarListasEnGrilla();	
}
function aceptarListaHoraAgregar(){
	if (!listaHoraAgregarValida())
	{
		return;
	
	}
	addListaSeleccion($("#inpIdListaHoraLista").val());
	mostraCargaFacturas();
	mostrarCancelarAgregar('');
	mostraListasCargadas();
	mostrarListasEnGrilla();
}
function mostrarDisposicion(){
	if ($("#inpMostrarDisposicion").val()==0){
		$("#inpMostrarDisposicion").val(1);
		$("#contenidoListasHorario").show();
	}else{
		$("#inpMostrarDisposicion").val(0);
		$("#contenidoListasHorario").hide();
	}
		
}
function clickMostrarLista(){
	if (!$('#inpModificarListaPorHora').is(':checked')){
		$('#divListasPorHora').hide();
	}else{
		$('#divListasPorHora').show();
	}
}
function clickMostrarListaFeriados(){
	if (!$('#inpAumentaEnFeriados').is(':checked')){
		$('#divListasFeriados').hide();
	}else{
		$('#divListasFeriados').show();
	}
}
function verPromocion(idPromocion){	
	$("#frmPromocion input[name=id]").val(idPromocion);	
	
	document.getElementById('frmPromocion').submit();
}
function seleccionaRestringirArqueo(){
	if ($('#chkRestringirArqueosCaja').is(':checked')){
		$('#divRestringirArqueoConfiguracion').show(500);
	}else{
		$('#divRestringirArqueoConfiguracion').hide(500);
	}
}