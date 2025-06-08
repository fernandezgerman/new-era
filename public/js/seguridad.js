 /*
Tiene letras y números: +30% 
Tiene mayúsculas y minúsculas: +30% 
Tiene entre 4 y 5 caracteres: +10% 
Tiene entre 6 y 8 caracteres: +30% 
Tiene más de 8 caracteres: +40%  */ 
function valEmail(valor){
	re=/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$/
	if(!re.exec(valor))    {
		return false;
	}else{
		return true;
	}
}
function tiene_letras(texto){
	var letras="abcdefghyjklmnñopqrstuvwxyz";
   texto = texto.toLowerCase();
   for(i=0; i<texto.length; i++){
      if (letras.indexOf(texto.charAt(i),0)!=-1){
         return 1;
      }
   }
   return 0;
}
function tiene_minusculas(texto){
	var letras="abcdefghyjklmnñopqrstuvwxyz";
   for(i=0; i<texto.length; i++){
      if (letras.indexOf(texto.charAt(i),0)!=-1){
         return 1;
      }
   }
   return 0;
}
function tiene_mayusculas(texto){
	var letras_mayusculas="ABCDEFGHYJKLMNÑOPQRSTUVWXYZ";
   for(i=0; i<texto.length; i++){
      if (letras_mayusculas.indexOf(texto.charAt(i),0)!=-1){
         return 1;
      }
   }
   return 0;
}
function tiene_caracteres_especiales(texto){
	var caracteres="ºª\!|\"@·~%&/()=?\\¡'¿¡çÇ+`++`-.,;:_´{}[]*/-+";
   for(i=0; i<texto.length; i++){
      if (caracteres.indexOf(texto.charAt(i),0)!=-1){
         return 1;
      }
   }
   return 0;
}
function tiene_numeros(texto){
	var numeros="0123456789";
   for(i=0; i<texto.length; i++){
      if (numeros.indexOf(texto.charAt(i),0)!=-1){
         return 1;
      }
   }
   return 0;
} 

function seguridadClave(clave){
   var seguridad = 0;
   if (clave.length!=0){
      if (tiene_numeros(clave) && tiene_letras(clave)){
         seguridad += 27;
      }
      if (tiene_minusculas(clave) && tiene_mayusculas(clave)){
         seguridad += 28;
      }
      if (tiene_caracteres_especiales(clave) ){
         seguridad += 15;
      }	  
      if (clave.length >= 4 && clave.length <= 5){
         seguridad += 10;
      }else{
         if (clave.length >= 6 && clave.length <= 8){
            seguridad += 20;
         }else{
            if (clave.length > 8){
               seguridad += 30;
            }
         }
      }
   }
   return seguridad            
}