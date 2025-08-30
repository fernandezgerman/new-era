var total = 0;
function seleccionarSucursal(indice){
	dif = $('#inpDiferencia'+indice).val();
	if($('#chkSeleccionar'+indice).is(':checked')){
		$('#filaLiquidacion'+indice).addClass("liqCerrarSeleccionarFila");
		$('#idCeldaDiferencia'+indice).addClass("liqCerrarSeleccionarFilaDiferencia");
		total = total + parseFloat(dif);
	}else{
		$('#filaLiquidacion'+indice).removeClass("liqCerrarSeleccionarFila");
		$('#idCeldaDiferencia'+indice).removeClass("liqCerrarSeleccionarFilaDiferencia");
		total = total - parseFloat(dif);
	}
	$('#lblTotalSeleccion').html(formatearPrecio(total));
}
function seleccionarTodos(){
	tot = $('#totalSucursales').val();
	total = 0;
	for(i =0; i < tot; i++){
		if($('#chkTodos').is(':checked')){
			$("#chkSeleccionar"+i).prop("checked", "checked");
			seleccionarSucursal(i);
		}else{
			$("#chkSeleccionar"+i).prop("checked", "")
			seleccionarSucursal(i);
			total = 0;
		}
	}
	$('#lblTotalSeleccion').html(formatearPrecio(total));
}
function inicioAbrirLiquidacion(){
	if (total == 0){
		alert("Debe seleccionar al menos una sucursal a liquidar.");
		return;
	}
	if (confirm("Esta seguro que desea generar una liquidacion?")){
		$("#frmLiquidacion").submit();
	}
}
$(document).ready(function() {
	seleccionarTodos();
});