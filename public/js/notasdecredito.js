window.onbeforeunload = preguntarAntesDeSalir;
var articulos = [] ;
$(document).ready(function() {
	mostrarTemplateGeneral(articulos, 'compras', 'templateCompraPlural', 'target');
});
function agregarArticulo(){
	mostrarTemplateGeneral(articulos, 'compras', 'templateCompraAdd', 'addArt');
}
function agregarArticuloCancelar(){

}
function agregarArticuloAceptar(){

}

