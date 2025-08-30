var bPreguntar = true;
var bPreguntar = true;
var myMenu;
function imgMouseOver(img, dSrc) {
	document.getElementById(img).src = dSrc;
}
function imgMouseOut(img, dSrc) {
	document.getElementById(img).src = dSrc;
}
function seleccionarOption(nombre, hidden, option) {
	if (parseInt(document.getElementById(hidden).value) == 1) {
		document.getElementById(option).src = "css/images/Botones/btn_radio_out.png";
		document.getElementById(hidden).value = "0";
	} else {
		document.getElementById(option).src = "css/images/Botones/btn_radio_over.png";
		document.getElementById(hidden).value = "1";
	}
}
function seleccionarCheck(nombre, hidden, check) {
	if (parseInt(document.getElementById(hidden).value) == 1) {
		document.getElementById(check).src = "css/images/Botones/btn_check_out.png";
		document.getElementById(hidden).value = "0";
	} else {
		document.getElementById(check).src = "css/images/Botones/btn_check_over.png";
		document.getElementById(hidden).value = "1";
	}
}
function ajaxCerrarVentana() {
	document.getElementById('divAjaxTapon').style.visibility = "hidden";
	document.getElementById('divAjaxVentana').style.visibility = "hidden";

	// document.getElementById('divAjaxCerrarVentana').innerHTML = "";
}
function ajaxAbrirVentana() {

	document.getElementById('divAjaxTapon').style.visibility = "visible";
	document.getElementById('divAjaxVentana').style.visibility = "visible";

	// document.getElementById('divAjaxCerrarVentana').innerHTML ='<img
	// src="css/images/aguarde.gif">';

}
function autoFormatearPrecio(id,decimales) {
	$('#' + id).val(formatearPrecio($('#' + id).val(),false, decimales  ));
}
function autoFormatearPrecioVacio(id,decimales) {
	ff = formatearPrecio($('#' + id).val(),false,decimales);
	if(ff == formatearPrecio(0,false, decimales)){
		$('#' + id).val('');
	}else{
		$('#' + id).val(ff);
	}

}
function autoFormatearPrecioPorName(name,decimales) {
	$('[name="' + name + '"]').val(
			formatearPrecio($('[name="' + name + '"]').val()) );
}
function autoFormatearCantidad(id,simbolo) {
	valor = $('#' + id).val();
	if(simbolo){
		if(valor.length > 0) {
			valor = valor.replace('#', '');
		}
		$('#' + id).val('#'+formatearCantidad(valor));
	}else{
		$('#' + id).val(formatearCantidad(valor));
	}
}
function formatearCantidad(numero,simbolo) {
	if(simbolo) {
		numero = formatNumber(numero, 0, ".", "");
		if(numero!= ''){
			return '#'+formatNumber(numero, 0, ".", "");
		}else{
			return '';
		}
	}else{
		return formatNumber(numero, 0, ".", "");
	}


}
function formatearPrecioVacio(numero, separarmillones,decimales) {
	numeroPrevio = formatearPrecio(numero, separarmillones,decimales);
	if(parseFloat(numeroPrevio)==0){
		return '';
	}else{
		return numeroPrevio;
	}
}

function formatearPrecio(numero, separarmillones,decimales) {
	separarmillones = false;

	if(!decimales ) {
		if(!(decimales ==0)) {
			decimales = 2;
		}
	}

	res = formatNumber(numero, decimales, ".", "");

	if (isNaN(parseFloat(res))) {
		return formatNumber(0, decimales, ".", "");
	} else {
		if (separarmillones) {

			if (Math.abs(numero) >= 1000) {
				res = formatNumber((numero / 1000), 0, ".", "");
				return res + ' m';
			} else {
				return res;
			}

		} else {
/*
			if(parseFloat(numero)> 1000){
				res = formatNumber(numero, 0, ".", "");
			}*/

			return res;
		}
	}

}

function formatNumber(numero, decimales, separador_decimal, separador_miles) { // v2007-08-06
	numero = parseFloat(numero);
	if (isNaN(numero)) {
		return "";
	}

	if (decimales !== undefined) {
		// Redondeamos
		numero = numero.toFixed(decimales);
	}

	// Convertimos el punto en separador_decimal
	numero = numero.toString().replace(".",
			separador_decimal !== undefined ? separador_decimal : ",");

	if (separador_miles) {
		// A�adimos los separadores de miles
		var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
		while (miles.test(numero)) {
			numero = numero.replace(miles, "$1" + separador_miles + "$2");
		}
	}

	return numero;
}
function validaFloat(numero) {
	if (!/^([0-9])*[.]?[0-9]*$/.test(numero)) {
		return false;
	} else {
		return true;
	}
}
function decimales(Numero, Decimales) {
	var pot = Math.pow(10, Decimales);
	var num = parseInt(Numero * pot) / pot;
	var nume = num.toString().split('.');

	var entero = nume[0];
	var decima = nume[1];

	var fin;
	if (decima != undefined) {
		fin = Decimales - decima.length;
	} else {
		decima = '';
		fin = Decimales;
	}

	for (i = 0; i < fin; i++)
		decima += String.fromCharCode(48);

	var buffer = "";
	var marca = entero.length - 1;
	var chars = 1;
	while (marca >= 0) {
		if ((chars % 4) == 0) {
			buffer = "." + buffer;
		}
		buffer = entero.charAt(marca) + buffer;
		marca--;
		chars++;
	}
	if (decima != '')
		num = buffer + ',' + decima;
	else
		num = buffer;
	return num;
}
function presionaEnter(key) {
	var unicode
	if (key.charCode) {
		unicode = key.charCode;
	} else {
		unicode = key.keyCode;
	}
	// alert(unicode); // Para saber que codigo de tecla presiono , descomentar

	if (unicode == 13) {
		return true;
	} else {
		return false;
	}

}

function actualizarSucursalActual() {
	/*
	 * $.post("valoresAjax.php?token="+document.getElementById('mToken').value,
	 * {inpIdSucursalActual:
	 * document.getElementById('inpSucursalActual').value});
	 */
	$
			.ajax({
				url : "valoresAjax.php?token="
						+ document.getElementById('mToken').value,
				type : 'POST',
				datatype : 'json',
				async : true,
				data : {
					inpIdSucursalActual : document
							.getElementById('inpSucursalActual').value
				},
				success : function(resultado) {
					alert('La sucursal fue establecida correctamente')
				},
				error : function() {
					alert('Error al establecer la sucursal.');
				}
			});

}

function cargarLocalidades() {
	var idProvincia = $("#inpProvinciaId").val();
	$.ajax({
		url : 'ajaxLocalidades.php?token='
				+ document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
			'idProvincia' : idProvincia
		},
		success : function(resultado) {
			document.getElementById('divLocalidades').innerHTML = resultado;
		},
		error : function() {
			alert('Error al cargar las localidades.');
		}
	});
}
function clipFloat(num, decimales) {
	// creamos variable local String

	return (Math.round(num * 1000) / 1000);

}
function redondeo(num) {
	// creamos variable local String

	return (parseInt(num * 1000) / 1000);

}
function validateEnter(e) {
	var key = e.keyCode || e.which;
	if (key == 13) {
		return true;
	} else {
		return false;
	}
}
function cargarSucursalPorUsuario(idUsuario) {

	$
			.ajax({
				url : 'ajaxSucursalesUsuarios.php?token='
						+ document.getElementById('mToken').value,
				type : 'POST',
				datatype : 'json',
				async : true,
				data : {
					'usuarioId' : idUsuario
				},
				success : function(resultado) {
					document.getElementById('divSucursalesUsuario').innerHTML = resultado;
				},
				error : function() {
					alert('Error al cargar las sucursales.');
				}
			});
}
function cargarSucursalPorUsuarioCaja(idUsuario) {
	document.getElementById('divSucursalesUsuario').innerHTML = "AGUARDE";
	$
			.ajax({
				url : 'ajaxSucursalesUsuariosCajas.php?token='
						+ document.getElementById('mToken').value,
				type : 'POST',
				datatype : 'json',
				async : true,
				data : {
					'usuarioId' : idUsuario
				},
				success : function(resultado) {
					document.getElementById('divSucursalesUsuario').innerHTML = resultado;
				},
				error : function() {
					alert('Error al cargar las sucursales.');
				}
			});
}

function validarfecha(fecha) {
	// Funcion validarFecha
	// Escrita por Buzu feb 18 2010. (FELIZ CUMPLE BUZU!!!
	// valida fecha en formato aaaa-mm-dd
	/*
	 * var fechaArr = fecha.split('-'); var aho = fechaArr[0]; var mes =
	 * fechaArr[1]; var dia = fechaArr[2];
	 * 
	 * var plantilla = new Date(aho, mes - 1, dia);// mes empieza de cero Enero // =
	 * 0
	 * 
	 * if(!plantilla || plantilla.getFullYear() == aho && plantilla.getMonth() ==
	 * mes -1 && plantilla.getDate() == dia){ return true; }else{ return false; }
	 */
	var fechaArr = fecha.split('/');
	var aho = fechaArr[2];
	var mes = fechaArr[1];
	var dia = fechaArr[0];

	var plantilla = new Date(aho, mes - 1, dia);// mes empieza de cero Enero
	// = 0

	if (!plantilla || plantilla.getFullYear() == aho
			&& plantilla.getMonth() == mes - 1 && plantilla.getDate() == dia) {
		return true;
	} else {
		return false;
	}
}
function validarfechaconbarra(fecha) {
	// Funcion validarFecha
	// Escrita por Buzu feb 18 2010. (FELIZ CUMPLE BUZU!!!
	// valida fecha en formato aaaa-mm-dd
	var fechaArr = fecha.split('/');
	var aho = fechaArr[2];
	var mes = fechaArr[1];
	var dia = fechaArr[0];

	var plantilla = new Date(aho, mes - 1, dia);// mes empieza de cero Enero
	// = 0

	if (!plantilla || plantilla.getFullYear() == aho
			&& plantilla.getMonth() == mes - 1 && plantilla.getDate() == dia) {
		return true;
	} else {
		return false;
	}
}
function formatearFecha(id) {
	var fecha = $('#' + id).val();
	var hoy = new Date();
	var datos = fecha.split('/');

	if (fecha == "") {
		return "";
	}
	if (datos.length == 3) {
		fecha = fecha;
	}else {

			if (datos.length == 2) {
				if(hoy.getMonth() < 5 && datos[1] > 8 ){
					fecha = datos[0] + '/' + datos[1] + '/' + (hoy.getFullYear()-1);
				}else{
					fecha = datos[0] + '/' + datos[1] + '/' + hoy.getFullYear();
				}

			}
			if (datos.length == 1) {
				fecha = datos[0] + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
			}
	}
	if (validarfechaconbarra(fecha)) {
		return fecha;
	} else {
		return hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/'
				+ hoy.getFullYear();
	}
}
function Hoy() {

	var hoy = new Date();

	return hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/'
		+ hoy.getFullYear();
}

function Ayer() {

	var hoy = new Date();
	var ayer=new Date(hoy.getTime() - 24*60*60*1000);

	return ayer.getDate() + '/' + (ayer.getMonth() + 1) + '/'
		+ ayer.getFullYear();
}

function formatearFechaYYYYMMDDaDDMMYYYY(fecha) {

	var hoy = new Date();
	var datos = fecha.split('-');
	//validarfechaconbarra
	if (fecha == "") {
		return "";
	}
	return datos[2] + '/' + datos[1] + '/' + datos[0];
}

function formatearFechaPorParametro(fecha) {
	var hoy = new Date();
	var datos = fecha.split('/');
	validarfechaconbarra
	if (fecha == "") {
		return "";
	}
	if (datos.length == 3) {
		fecha = fecha;
	}
	if (datos.length == 2) {
		fecha = datos[0] + '/' + datos[1] + '/' + hoy.getFullYear();
	}
	if (datos.length == 1) {
		fecha = datos[0] + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear();
	}
	if (validarfechaconbarra(fecha)) {
		return fecha;
	} else {
		return hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/'
				+ hoy.getFullYear();
	}
}

function formatearFechaMysqlANormal(fecha) {

	var datos = fecha.split('-');

	if (fecha == "") {
		return "";
	}
	return datos[2] + '/' + datos[1] + '/' + datos[0];

}

function formatearHora(id) {
	var hora = $('#' + id).val();
	var hoy = new Date();
	var datos = hora.split(':');

	if (hora == "") {
		return "";
	}
	if (datos.length < 2) {
		datos[1] = 0;
	}
	/* Valido llos numeros */

	if (datos[0].length > 2) {
		if (datos[0].length == 3)
			datos[0] = datos[0] + "0";
		datos[1] = datos[0].substr(2, datos[0].length - 2);
		datos[0] = datos[0].substr(0, 2);
	}
	datos[0] = parseInt(datos[0]);
	datos[1] = parseInt(datos[1]);
	if (datos[0] > 23) {
		datos[0] = 23;
	}
	if (parseInt(datos[1]) > 59) {
		datos[1] = 59;
	}
	if (datos[0] < 10) {
		datos[0] = "0" + datos[0];
	}
	if (datos[1] < 10) {
		datos[1] = "0" + datos[1];
	}
	if(isNaN(datos[0])){
		datos[0] = '00';
	}

	if(isNaN(datos[1])){
		datos[1] = '00';
	}
	return datos[0] + ":" + datos[1];
}
function autoCompletarFecha(id) {
	$('#' + id).val(formatearFecha(id));
}
function autoCompletarHora(id) {
	$('#' + id).val(formatearHora(id));
}
function cargarSucursalPorUsuarioLogin(idUsuario) {

	$
			.ajax({
				url : 'ajaxSucursalesUsuarioLogin.php?token='
						+ document.getElementById('mToken').value,
				type : 'POST',
				datatype : 'json',
				async : true,
				data : {
					'usuarioId' : idUsuario
				},
				success : function(resultado) {
					document.getElementById('divSucursalesUsuario').innerHTML = resultado;
					document.getElementById('mensajeLogin').innerHTML = "";
				},
				error : function() {
					alert('Error al cargar las sucursales.');
				}
			});
}

function valorAbsouluto(numero) {
	if (numero < 0) {
		return (numero * -1);
	} else {
		return numero;
	}
}
function deseeaRealmenteCancelar() {
	var r = confirm("Esta seguro que desea cancelar?");
	return r;
}
/*
 * function paginaAtrasConConfirmacion() { if (deseeaRealmenteCancelar()) {
 * history.go(-1); } }
 */

function preguntarAntesDeSalir() {

	if (bPreguntar) {
		return "Si abandona la pagina, no se guardaran los cambios.";

	}
}

function presionaEscape(key) {
	var unicode
	if (key.charCode) {
		unicode = key.charCode;
	} else {
		unicode = key.keyCode;
	}
	// alert(unicode); // Para saber que codigo de tecla presiono , descomentar

	if (unicode == 27) {
		return true;
	} else {
		return false;
	}

}

function verificarSesionActiva() {
	return;
	$.ajax({
		url : 'sesionActiva.php?token='
				+ document.getElementById('mToken').value,
		type : 'POST',
		datatype : 'json',
		async : true,
		data : {
			'usuarioId' : 1
		},
		success : function(resultado) {
			json = $.parseJSON(resultado);

			if (json.sesionActiva != 1) {

				$("#divSessionExpired").css("visibility", "visible");
			} else {
				setTimeout(verificarSesionActiva, 5000);
			}
		},
		error : function() {

		}
	});
}
function seleccionarMultiSelect(id, value) {
	$('#' + id + ' option[value="' + value + '"]').attr('selected', 'selected');
}
function seleccionarMultiSelectArreglo(id, arreglo) {
	$.each(arreglo, function(index, value) {
		seleccionarMultiSelect(id, value);
	});
}
function obtenerParametroDesdeRequest(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL
			.split('&'), sParameterName, i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
}
function arregloACadena(arreglo, delimitador) {
	resultado = '';
	separador = '';
	for (x = 0; x < arreglo.length; x++) {
		resultado = arreglo[x] + separador + resultado;
		separador = delimitador;
	}
	return resultado;
}
function divEnPantallaCompleta(div) {
	if ($('#' + div).hasClass('divPantallaCompleta')) {
		$('#' + div).removeClass('divPantallaCompleta');
	} else {
		$('#' + div).addClass('divPantallaCompleta');
	}

}
function cargarAjaxGenericoJson(url, data, variable, template, divResultado,
		extra,callback) {
	$('#' + divResultado).addClass('divBuscandoInformacion');
	pm = Array();
	pm['url'] = url;
	pm['variable'] = variable;
	pm['template'] = template;
	pm['divResultado'] = divResultado;
	$.ajax({
		url : url + '?token=' + $('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		parametrosFuncion : pm,
		parametrosPost : data,
		data : data,
		datosExtra : extra,
		success : function(resultado) {

			json = $.parseJSON(resultado);
			json['parametrosPost'] = this.parametrosPost;
			json['datosExtra'] = this.datosExtra;

			mostrarTemplateGeneral(json, this.parametrosFuncion['variable'],
					this.parametrosFuncion['template'],
					this.parametrosFuncion['divResultado']);

			if(callback){
                eval(callback);
			}
			$('#' + divResultado).removeClass('divBuscandoInformacion');

		},
		error : function() {

		}
	});
}

function mostrarTemplateGeneral(json, variable, template, divResultado) {
	_.templateSettings.variable = variable;

	var templatex = _.template($("#" + template).html());
	$("#" + divResultado).html(templatex(json));
}

function printTemplate(template, data) {


	var temp = _.template($("#" + template).html());
	return temp(data);
}

function serialize(arr) {
	 res = 'a:' + arr.length + ':{';
	for (i = 0; i < arr.length; i++) {
		if( $.isArray(arr[i])){
			res += 'i:' + i + ';s:' + arr[i].length + ':"' + serialize2(arr[i]) + '";';
		}else{
			res += 'i:' + i + ';s:' + arr[i].length + ':"' + arr[i] + '";';
		}
		
	}
	res += '}';

	return res;
}
function serialize2(arr2) {
	 res2 = 'a:' + arr2.length + ':{';
	for (i2 = 0; i2 < arr2.length; i2++) {
		res2 += 'i:' + i2 + ';s:' + arr2[i2].length + ':"' + arr2[i2] + '";';
		
	}
	res2 += '}';

	return res2;
}
function ordenarArregloGenerico(arreglo,campo,alfabetico,esFecha){
    arreglo['orden']= campo;
    arreglo['ordenaFecha']= esFecha;
    if (alfabetico==true) {
        arreglo['ordenTipo'+campo]= 'A';
    }else{
        if (arreglo['ordenTipo' + campo] == 1) {
            arreglo['ordenTipo' + campo] = -1;
        } else {
            arreglo['ordenTipo' + campo] = 1;
        }
    }
    arreglox = _.sortBy(arreglo, function(fila){
        campoOrden = arreglo['orden'];

        if(arreglo['ordenTipo'+campoOrden]=='A'){
            return fila[campoOrden];
        }else {
        	valor = fila[campoOrden];

        	if(arreglo['ordenaFecha']){
        		f = fila[campoOrden].substr(0,10);
                h = fila[campoOrden].substr(11,5);
                fa = f.split('-');
                ha = h.split(':');
                valor=fa[0].toString()+fa[1].toString()+fa[2].toString()+ha[0].toString()+ha[1].toString();

            }
            return parseFloat(valor) * parseFloat(arreglo['ordenTipo' + campoOrden]);
        }
    });
    arreglox['orden'] = campo;
    arreglox['ordenTipo'+campo] = arreglo['ordenTipo'+campo];
    return arreglox;

}
function booleanoANumero(valor){
	if(valor){
		return 1;
	}else{
		return 0;
	}
}

function enterAtab(e,elemento) {
	if (e.keyCode == 13) {
		cb = parseInt($(elemento).attr('tabindex'));

		if ($(':input[tabindex=' + (cb + 1) + ']') != null) {
			$(':input[tabindex=' + (cb + 1) + ']').focus();
			$(':input[tabindex=' + (cb + 1) + ']').select();
			e.preventDefault();

			return false;
		}
	}
}

/*
function formatearFechas(texto){
    return texto.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3/$2/$1');
}*/

function ajaxGenericoJson(url, data, extra,callback) {
	$('#' + divResultado).addClass('divBuscandoInformacion');
	pm = Array();
	pm['url'] = url;
	$.ajax({
		url : url + '?token=' + $('#mToken').val(),
		type : 'POST',
		datatype : 'json',
		async : true,
		parametrosFuncion : pm,
		parametrosPost : data,
		data : data,
		datosExtra : extra,
		success : function(resultado) {
			$('#' + divResultado).removeClass('divBuscandoInformacion');
			json = $.parseJSON(resultado);
			json['parametrosPost'] = this.parametrosPost;
			json['datosExtra'] = this.datosExtra;
			if(callback){
				eval(callback);
			}
		},
		error : function() {

		}
	});
}
function colorearBusqueda(finder,target ){

		if(finder) {
			var arrFinder = finder.split('%');
			resultado = target;
			for (indiceFinder in arrFinder) {
				if(arrFinder[indiceFinder]) {
					searchMask = arrFinder[indiceFinder];
					regEx = new RegExp(searchMask, "ig");
					replaceMask = '<span style="background-color:green;color:gold;">' + arrFinder[indiceFinder] + '</span>';

					if(indiceFinder==0 ||'<span style="background-color:green;color:gold;"></span>'.replace(regEx,'121212') =='<span style="background-color:green;color:gold;"></span>') {
						resultado = resultado.replace(regEx, replaceMask);
					}
				}
				//resultado = target.replace(/arrFinder[indiceFinder]/ig, '<span style="background-color:green;color:gold;">'+arrFinder[indiceFinder]+'</span>' );
			}

			return resultado;
		}else{
			return target;
		}
	//articulo['articuloNombre'].toUpperCase().replace(parametros['nombreArticulo'].toUpperCase(),'<span style="background-color:green;color:gold;">'+parametros['nombreArticulo']+'</span>')%>

}
function fechaEsMayor(fecha1,fecha2){
	var fechaMayor=new Date();
	var fechaMenor=new Date();

	var arrFechaMayor = fecha1.split("/");

	fechaMayor.setFullYear(arrFechaMayor[2],arrFechaMayor[1]-1,arrFechaMayor[0]);
	if(fecha2){
		var arrFechaMenor = fecha2.split("/");
		fechaMenor.setFullYear(arrFechaMenor[2],arrFechaMenor[1]-1,arrFechaMenor[0]);
	}else{
		fechaMenor = new Date();
	}


	if (fechaMayor > fechaMenor)
		return true;
	else
		return false;
}
function mayuscula(cadena){
	if(cadena){
		return cadena.toUpperCase();
	}
}
function checkEventos(variable){
	let cadenaEventos = '';
	if(variable['eventos']){
		for(let evento in variable['eventos']){
			let funcion = (variable['eventos'])[evento];
			cadenaEventos = cadenaEventos+' '+evento+'="'+funcion+'"';
		}
	}
	return cadenaEventos;
}
function concatenarValoresMultiSelect(valores){
	let concat = '';
	let separador = ',';
	for(let indice in valores){
		let valor = valores[indice];
		concat = separador+concat+valor+',';
		separador = '';
	}
	return concat;
}
function cadenaAArray(cadena,separador){
	let arrDefault = [];
	if(cadena){
		let arr = cadena.split(separador);
		for(let indiceArr in arr ){
			arrDefault[arr[indiceArr]] = 1;
		}
	}
	return arrDefault;
}
function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}