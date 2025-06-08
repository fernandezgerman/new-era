/*
	Comunicacion a trav�s de ajax 
*/
function getMensaje(mensaje){
	arr = mensaje.split('#');
	return arr[1].trim();
}
function getSuceso(mensaje){
	arr = mensaje.split('#');
	return arr[0].trim();
}