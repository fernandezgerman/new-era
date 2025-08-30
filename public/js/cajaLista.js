function editarCaja(idusuario,idsucursal,numerocaja)
{

    $('#usuarioId').val(idusuario);
    $('#sucursalId').val(idsucursal);
    $('#numeroCaja').val(numerocaja);

    form = document.getElementById('formulario');
    form.action ="principal.php?pagina=cjaactual&token="+$('#mToken').val();
    form.target = "_blank";

    form.submit();

}
function buscarCaja()
{

	if( $('#inpFechaAperturaDesde').val()=='' && $('#inpFechaCierreDesde').val()=='' && $('#inpEstadoCaja').val()!=2 ){
		alert('Debe seleccionar una fecha desde.');
		return;
	}
    if($('#inpFechaAperturaHasta').val()=='' && $('#inpFechaCierreHasta').val()==''  && $('#inpEstadoCaja').val()!=2 ){
        alert('Debe seleccionar una fecha hasta.');
        return;
    }

    form = document.getElementById('formulario');
    form.target = "_self";
    form.action ="principal.php?pagina=cajal&token="+$('#mToken').val();
    form.submit();

}
