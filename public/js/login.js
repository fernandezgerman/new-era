function aceptarSucursal()
{
    if (parseInt($('#inpLoginSucursalActual').val())==0)
    {
        alert("Debe seleccionar una sucursal");
        return;
    }

    document.getElementById('frm').submit();
}
function verificarLogin()
{
    $.post("loginVerifica.php", {inpUsuario: document.getElementById('inpUsuario').value,
            inpClave: md5(document.getElementById('inpClave').value)},
        function(data){
            switch (getSuceso(data))
            {
                case "false":
                    document.getElementById('mensajeLogin').innerHTML =  getMensaje(data);
                    alert(getMensaje(data));
                    break;
                case "true":
                    pagina = $('#pagina').val();

                    document.getElementById('mensajeLogin').innerHTML = "Login correcto, aguarde.";
                    if (!pagina){
                        pagina = 'inicio';
                    }

                    document.getElementById('frm').action = "principal.php?token="+getMensaje(data)+'&pagina='+pagina;
                    $('#mToken').val(getMensaje(data));
                    $('#divNombreUsuario').html("Seleccione una sucursal");
                    $('#divSucursalesUsuario').html("");

                    cargarSucursalPorUsuarioLogin("");
                    //document.getElementById('frm').submit();

                    break;
                case "reingresarPassword":
                    document.getElementById('frm').action = "edicionPassword.php?token="+getMensaje(data);
                    document.getElementById('frm').submit();
                    break;
                case  "err":
                    document.getElementById('mensajeLogin').innerHTML =  getMensaje(data);
                    alert(getMensaje(data));
                    break;
                default:
                    document.getElementById('mensajeLogin').innerHTML = "Ah ocurrido un error con la comunicaci�n, intentelo m�s tarde";
                    alert("Ah ocurrido un error con la comunicaci�n, intentelo m�s tarde");
                    break;
            }
        });
}
function imgMouseOver(img,dSrc){
    document.getElementById(img).src = dSrc;
}
function imgMouseOut(img,dSrc){
    document.getElementById(img).src = dSrc;
}
function checkear(nombre){
    if (parseInt(document.getElementById('inpRecordar').value) ==1){
        document.getElementById('checkRecordar').src = "css/images/Botones/btn_radio_out.png";
        document.getElementById('inpRecordar').value = "0";
    }else{
        document.getElementById('checkRecordar').src = "css/images/Botones/btn_radio_over.png";
        document.getElementById('inpRecordar').value = "1";
    }
}
function presionaTecla(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==13){
        verificarLogin();
    }
}