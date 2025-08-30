function agregarPromocion(){
	$("#inpId").val("");
	$("#frmPromociones").submit();
}
function editarPromocion(idPromocion){
	$("#inpId").val(idPromocion);
	$("#frmPromociones").submit();
}

function guardarPromocionSucursales(){
	if(confirm('Esta seguro que desea habilitar/deshabilitar promociones en sucursales??')){
		$("#frmPromocionesSucursal").submit();
	}
		
}
