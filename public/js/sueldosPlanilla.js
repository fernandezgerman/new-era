var resultado = Array();
var datosTodasSucursales = Array();
var totalesParciales = Array();
$(document).ready(function() {

   verTotalesPorSucursal();
});
function verTotalesPorSucursal(){
   url = 'ajaxSueldosPlanillaSucursales.php';
   data = {};
   variable  = 'datos';
   template = 'sueldosSucursalesTemplate';
   divResultado = 'divContenedorGeneralSueldos';
   extra = false;
   callback = 'finalizaCargaGeneral(json)';

   cargarAjaxGenericoJson(url, data, variable, template, divResultado, extra, callback);
}
function finalizaCargaGeneral(json){
   datosTodasSucursales = json;
}
/*
function verDetalleSueldosSucursal(idsucursal){

   url = 'ajaxSueldosPlanilla.php';
   data = {'sucursalId':idsucursal};
   variable  = 'datos';
   template = 'sueldosSucursalCargaRapidaTemplate';
   divResultado = 'divContenedorGeneralSueldos';
   extra = false;
   callback = 'cargarDatosSucursal(json)';

   cargarAjaxGenericoJson(url, data, variable, template, divResultado, extra, callback);
}
 */

function verDetalleSueldosSucursal(idsucursal){

   url = 'ajaxSueldosPlanillaCargaRapida.php';
   data = {'sucursalId':idsucursal};
   variable  = 'datos';
   template = 'sueldosSucursalCargaRapidaTemplate';
   divResultado = 'divInformacionSueldos';
   extra = {'proximaSucursal':proximaSucursal(idsucursal)};
   callback = 'cargarDatosSucursal(json)';

   cargarAjaxGenericoJson(url, data, variable, template, divResultado, extra, callback);
}
function proximaSucursal(idsucursal){
   sucs =datosTodasSucursales['sucursales'];
   idAnterior = -1;
   for(indice in sucs){
      suc = sucs[indice];
      if(idAnterior==idsucursal){
         return suc;
      }
      idAnterior=suc['sucursalid'];
   }
   return false;

}
function cargarDatosSucursal(json){
   this.resultado = json;
   if(!(json['err']==1)){
      recalcularTotales();
   }

}
function getIndiceUsuario(usrs,usuarioId){

   for(indiceUsr in usrs){
      usr= usrs[indiceUsr];
      if(usr['usuarioId']==usuarioId){
         return indiceUsr;
      }
   }
   return -1;
}
function mostrarDetalle(usuarioIndice){
   valores = Array();
   valores['datos'] = this.resultado;
   valores['usuarioIndice'] = usuarioIndice;
   mostrarTemplateGeneral(valores, 'valores', 'sueldosResumenSucursalesDetalleTemplate', 'divDetalle'+usuarioIndice );

   $('#filaDetalle'+usuarioIndice).show(500);
}
function cerrarDetalle(usuarioIndice){
   $('#filaDetalle'+usuarioIndice).hide(500);
}
function guardarItemSueldo(usuarioIndice,itemIndice,itemId,usuarioId,sucursalId){
   key = usuarioIndice+'U'+itemIndice+'I-';
   item = Array();
   item['id'] = itemId;
   item['importe'] =parseFloat($('#'+key+'Importe').val() );
   item['observaciones'] = $('#'+key+'Observaciones').val() ;

   usuariosItems = this.resultado['usuariosItems'];
   itemsUsuario = usuariosItems['U'+usuarioId+'-S'+sucursalId+'-I'+itemId]
   if(!itemsUsuario){
      itemsUsuario = Array();
      itemsUsuario[0] = item;
   }else{
      itemsUsuario[itemsUsuario.length] = item;
   }
   usuariosItems['U'+usuarioId+'-S'+sucursalId+'-I'+itemId] = itemsUsuario;
   this.resultado['usuariosItems'] = usuariosItems;

   mostrarTemplateGeneral(this.resultado, 'datos', 'sueldosResumenSucursalesTemplate', 'divContenedorGeneralSueldos' );
}
function eliminarItemUsuario(itemClave, itemIndice,usuarioIndice){
   usuariosItems = this.resultado['usuariosItems'];
   itemsUsuario = usuariosItems[itemClave];
   itemsUsuario.splice( itemIndice, 1 );
   usuariosItems[itemClave] = itemsUsuario;
   this.resultado['usuariosItems'] = usuariosItems;

   mostrarTemplateGeneral(this.resultado, 'datos', 'sueldosResumenSucursalesTemplate', 'divContenedorGeneralSueldos' );

   mostrarDetalle(usuarioIndice);
}
function totalSueldos(data){
   usrs = data['usuarios'];
   usrsItems = data['usuariosItems'];
   total = 0;
   for(iusr in usrs){
      usr = usrs[iusr];
      total = total + parseFloat(formatearPrecio(usr['basicoCalculado']));
   }
   for(iui in usrsItems){
      usrItem = usrsItems[iui];
      for(iitem in usrItem){
         item = usrItem[iitem];
         total = total + parseFloat(formatearPrecio(item['importe']));
      }
   }

   return total;
}
function cancelar(){
   verTotalesPorSucursal();
}

function recalcularRenglon(idItem,idUsuario,indiceUsuario){
   configuracion = resultado['configuracion'];
   usuarios = resultado['usuarios'];
   usuario = usuarios[indiceUsuario];
   items = configuracion['items'];
   valoresItems = resultado['valoresItems'];

   clave = 'I'+idItem+'U'+idUsuario;
   valoresItems[clave] = {importe:$('#'+clave).val()};

   total = parseFloat(formatearPrecio(usuario['basicoCalculado']));

   for(indiceItem in items){
      item = items[indiceItem];
      multiplo = 1;
      if(item['resta']==1){
         multiplo = -1;
      }
      vitem =parseFloat(formatearPrecio(valoresItems['I'+item['id']+'U'+idUsuario]));
      total =total + vitem * multiplo ;
   }
//   $('#divTotalUsuario'+idUsuario).html('$'+formatearPrecio(total),false, 0);

   recalcularTotales()

}
// divTotalPerfil<%=idPerfil%>Item<%=item['id']%>
// divTotalPerfil<%=idPerfil%>
// divTotalUsuario<%=usuario['usuarioId']%>
// divTotalSueldo

function recalcularTotales() {
   usuarios = resultado['usuarios'];
   perfiles = resultado['perfiles'];
   sucursal = resultado['sucursal'];
   configuracion =resultado['configuracion'];
   items = configuracion['items'];
   valoresItem = resultado['valoresItems'];

   totalesParciales = [];
   for(perfilId in perfiles){
      perfil = perfiles[perfilId];
      indices =perfil['indicesUsuarios'];
      for(usuarioIndice in indices){

         usuario = usuarios[indices[usuarioIndice]];
         addTotal('divTotalUsuario'+usuario['usuarioId'], usuario['basicoCalculado'] );
         addTotal('divTotalPerfil'+perfilId, usuario['basicoCalculado'] );
         addTotal('divTotalSueldo', usuario['basicoCalculado'] );
         if(!(usuario['darDeBaja']==1)) {
            for (indiceItem in items) {
               item = items[indiceItem];
               valorItem = valoresItem['I' + item['id'] + 'U' + usuario['usuarioId']];
               multiplo = 1;
               valor = 0;
               if (valorItem) {
                  valor = valorItem['importe'];
                  if (item['resta'] == 1) {
                     multiplo = -1;
                  }
               }
               addTotal('divTotalPerfil' + perfilId + 'Item' + item['id'], valor);
               addTotal('divTotalUsuario' + usuario['usuarioId'], valor * multiplo);
               addTotal('divTotalPerfil' + perfilId, valor * multiplo);
               addTotal('divTotalSueldo', valor * multiplo);
            }
         }
      }
   }
   for(indice in totalesParciales){
      total = totalesParciales[indice];
      $('#'+indice).html('$'+formatearPrecio(total,false,0));
   }
}
function getTotal(clave){
   if(totalesParciales[clave]){
      return totalesParciales[clave];
   }else{
      return 0;
   }
}
 function addTotal(clave,valor){
   if(valor) {
      if (totalesParciales[clave]) {
         totalesParciales[clave] = parseFloat(formatearPrecio(totalesParciales[clave])) + parseFloat(formatearPrecio(valor ));
      } else {
         totalesParciales[clave] = valor;
      }
   }
 }
function guardarDatosSucursal(continuarConSucursalId){
   usuarios = resultado['usuarios'];
   sucursal = resultado['sucursal'];
   configuracion =resultado['configuracion'];
   items = configuracion['items'];
   usrs = [];
   its =[];
   basicos = [];
   bajas = [];
   data = {'sucursalId': sucursal['id']};

   for(uindice in usuarios){

      usuario = usuarios[uindice];
      basicos[uindice] = usuario['basicoCalculado'];
      usrs[uindice] = usuario['usuarioId'];
      if(usuario['darDeBaja']) {
         bajas[uindice] = 1;
      }else{
         bajas[uindice] = 0;
      }


      /* ITEMS*/

      for(iitem in items){
         item = items[iitem];
         if(item){
            clave = 'I'+item['id']+'U'+usuario['usuarioId'];
            data[clave] =  $('#'+clave).val();
         }
      }


   }
   url = 'ajaxSueldosPlanillaCargaRapidaGuardar.php';
   data['sucursalId'] = sucursal['id'];
   data['usuarios'] = JSON.stringify(usrs);
   data['basicos'] = JSON.stringify(basicos);
   data['bajas'] = JSON.stringify(bajas);


   extra = false;
   if(continuarConSucursalId){
      callback ='finalizaSolicitudGuardar(json,'+continuarConSucursalId+')';
   }else{
      callback ='finalizaSolicitudGuardar(json,false)';
   }
   ajaxGenericoJson(url, data, extra,callback)
}
function finalizaSolicitudGuardar(json,continuarConSucursalId){
   if(json['err']==1){
      $('#mensajeError').html('ERROR AL GUARDAR LOS DATOS: '+json['mensaje']);
      $('#mensajeError').show(1000);
   }else{
      alert('Los datos se almacenaron correctamente');
      if(continuarConSucursalId){
         verDetalleSueldosSucursal(continuarConSucursalId);
      }else{
         verTotalesPorSucursal();
      }

   }
}
function guardarYContinuar(sucursalId){
   guardarDatosSucursal(sucursalId);
}
function verDetalleUsuario(usuarioId){
   action = 'principal.php?token='+$('#mToken').val()+'&pagina=usrm&id='+usuarioId;

   $('#frmLinkAuxiliarSueldos').attr('action',action);
   $('#frmLinkAuxiliarSueldos').submit();
}

function inactivarUsuario(usuarioId){
   if(confirm("Si inactiva el usuario, no podra: \n      - Iniciar sesion \n      - Cobrar sueldos \n Desea continuar??")) {
      url = 'ajaxUsuarioModificaciones.php';

      data = {'usuarioId': usuarioId};
      extra = false;
      callback = 'finalizaInactivarUsuario(json)';

      ajaxGenericoJson(url, data, extra, callback)
   }
}
function finalizaInactivarUsuario(json){

   if(json['err']==1){
      $('#mensajeError').html('ERROR: '+json['mensaje']);
      $('#mensajeError').show(1000);
   }else{

      alert(json['mensaje']);

      /*ACTUALIZO LOS USUARIOS Y PERFILES */
      sucursal = resultado['sucursal'];
      url = 'ajaxSueldosPlanillaCargaRapida.php';

      data = {'sucursalId':sucursal['id'] };
      extra = false;
      callback ='finalizaInactivarUsuarioRecarga(json)';


      ajaxGenericoJson(url, data, extra,callback)

   }
}
function finalizaInactivarUsuarioRecarga(json){
   resultado['perfiles'] = json['perfiles'];
   resultado['usuarios'] = json['usuarios'];

   variable  = 'datos';
   template = 'sueldosSucursalCargaRapidaTemplate';
   divResultado = 'divInformacionSueldos';

   mostrarTemplateGeneral(resultado, variable, template, divResultado)
}
function darDeBajaUsuario(usuarioId){
   $('#divBajaUsuario'+usuarioId).show(1000);
}
function darDeBajaUsuarioAceptar(usuarioId){
   usuarios = resultado['usuarios'];
   sucursal = resultado['sucursal'];
   configuracion =resultado['configuracion'];

   indiceUsuario = false;
   for(cu in usuarios){
      usr = usuarios[cu];
      if(usr['usuarioId']==usuarioId){
         indiceUsuario = cu;
      }
   }
   if (!indiceUsuario){
      alert('Error al liquidar');
      return;
   }
   usuario = usuarios[indiceUsuario];
   usuario['darDeBaja'] = 1;
   usuario['fechahasta'] = 'HOY';
   usuario['diaHasta'] = 'HOY';
   usuario['fechabaja'] = 'HOY';

   usuario['basicoCalculado'] = $('#inpLiquidacionUsuario'+usuarioId).val();
   usuarios[indiceUsuario] = usuario;
   resultado['usuarios'] = usuarios;


   /* MUESTRO EL TEMPLATE DE NUEVO */

   $('#divBajaUsuario'+usuarioId).hide(1000);
   variable  = 'datos';
   template = 'sueldosSucursalCargaRapidaTemplate';
   divResultado = 'divInformacionSueldos';

   mostrarTemplateGeneral(resultado, variable, template, divResultado);
   recalcularTotales();
}
function asignarBasico(indiceUsuario){
   usuarios = resultado['usuarios'];
   usuario = usuarios[indiceUsuario];
   usuario['basicoCalculado'] = $('#bajaUsuarioImporte'+usuario['usuarioId']).val();
   usuarios[indiceUsuario] = usuario;
   resultado['usuarios'] = usuarios;
   recalcularTotales();
}

function cerrarBajaUsuario(usuarioId){
   $('#divBajaUsuario'+usuarioId).hide(1000);

}
