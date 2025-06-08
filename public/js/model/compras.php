	<script type="text/html" id="templateCompraPlural" >
	<table class="tabla_datos"  border="0" cellspacing="0" cellspacing="0">
		<tr class="tblTitulo">
			<td style="width:100px; ">C&oacute;digo</td>
			<td style="width:200px; ">Descripci&oacute;n</td>			
			<td style="width:80px; ">Costo unitario</td>
			<td style="width:80px; ">Cantidad</td>
			<td style="width:80px; ">Total</td>
			<td style="width:80px; ">PDV actual(calc)</td>
			<td></td>		
		  
		</tr>
				<%
				var i = 0; 
				_.each(compras, function(compra) { 
			
				i++;
				 if (i % 2 == 0){				
					 print('<tr class="tblFilaPar">'); 		
				 }else{
					 print('<tr class="tblFilaImpar">'); 
				 }%>
					<td><% print(compra.codigo); %></td>
					<td><% print(compra.descripcion); %></td>
					<td class="columnaImporte"><% print(compra.costo); %></td>
					<td class="columnaImporte"><% print(compra.cantidad); %></td>
					<td class="columnaImporte"><% print(compra.cantidad*compra.costo); %></td>
					<td class="columnaImporte"><% print(compra.precioVenta); %></td>
					<td><input type="radio" name="inpSeleccionarCompra" id="inpSeleccionarCompra" value="<% print(compra.id); %>">
					<input type="hidden" name="inpCompraId<% print(i); %>" id="inpCompraId<% print(i); %>" value="<% print(compra.id); %>">
					<input type="hidden" name="inpCompraCantidad<% print(i); %>" id="inpCompraCantidad<% print(i); %>" value="<% print(compra.cantidad); %>">
					</td>	
				  </tr>
			  <% }); %>		
				<input type="hidden" name="inpCompraTotal" id="inpCompraTotal" value="<% print(i); %>">			  

			<tr><td colspan="3"><input type="button" value="Eliminar" id="btnEliminar" name="btnEliminar">
				<input type="button" value="Agregar" id="btnAgregar" name="btnAgregar">
				<input type="button" value="Editar" id="btnEditar" name="btnEditar"></td>
			</tr>
		</table>
	</script>	
	<script type="text/html" id="templateCompraEdit" >
		<div class="divAgregarExcepcion">
		<table>
			<tr>
				<td style="width:100px; "><span class="campoExcepcionPrecio"> C&oacute;digo</span></td><td><span class="agregarExcepcion"><% print(articulo.codigo); %></span></td>	
			</tr>				
			<tr>
				<td><span class="campoExcepcionPrecio">Descripci&oacute;n</span></td><td><span class="agregarExcepcion"><% print(articulo.descripcion); %></span></td>	
			</tr>			
			<tr>
				<td><span class="campoExcepcionPrecio">Costo</span></td><td><span class="agregarExcepcion"><% print(articulo.costo); %></span></td>	
			</tr>
			<tr>
				<td><span class="campoExcepcionPrecio">Cantidad</span></td><td><input class="codigArticuloExcepcion" type="text" id="inpCantidadCompuesto" name="inpCantidadCompuesto" value="<% print(articulo.cantidad); %>" size="5"></td>	
			</tr>			
			<tr>
				<td><input type="button" value="aceptar" id="btnAceptarArticuloEdit" name="btnAceptarArticuloEdit"></td>
				<td><input type="button" value="cancelar" id="btnCancelarArticuloEdit" name="btnCancelarArticuloEdit"></td>
			</tr>					
			</table>
			<input type="hidden" id="inpIdentificador" name="inpIdentificador" value="<% print(articulo.cid); %>">

		</table>
		</div>
	</script>
	<script type="text/html" id="templateCompraAdd" >
		<div class="divAgregarExcepcion">
			<table align="center">
				<tr>
					<td coslpan="2"><span class="campoExcepcionPrecio">Ingrese el c&oacute;digo del art&iacute;culo</span></td>	
				</tr>							
				<tr>
					<td colspan="2"><input class="codigArticuloExcepcion"  type="text" name="inpSeleccionarCompraCodigo" id="inpSeleccionarCompraCodigo" value=""></td>	
					<td><img src="css/images/icons/buscar.png"></td><td style="width:50px;"><img id="imgAguardeCompra" style="height: 20px; display:none;" src="css/images/aguarde.gif" /></td>
				</tr>
				<tr>
					<td><input type="button" value="aceptar" id="btnAceptarCompraBuscar" name="btnAceptarCompraBuscar"></td>
					<td><input type="button" value="cancelar" id="btnCancelarCompraBuscar" name="btnCancelarCompraBuscar"></td>
				</tr>	
				
			</table>
		</div>
	</script>
	<script type="text/html" id="templateCompraAddDescripcion" >
		<div class="divAgregarExcepcion">

			<table>
				<tr>
					<td coslpan="4"><span class="campoExcepcionPrecio">Ingrese los datos del art&iacute;culo</span></td>	
				</tr>							
				<tr>
					<td colspan="7">
					<table border="0"  cellspacing="1" >		
						<tr class="tblTitulo" >
							<td style="width:160px;">C&oacute;digo</td>
							<td style="width:250px;">Descripci&oacute;n</td>			
							<td  style="width:100px;">Costo unitario</td>
							<td style="width:100px;">Cantidad</td>
							<td style="width:100px;">Total</td>
						</tr>	
					
						<tr class="tblFilaImpar">
							<td><% print(compra.codigo); %></td>
							<td><% print(compra.descripcion); %></td>			
							<td><input type="text" id="inpCosto" name="inpCosto" style="width:100px;" value="<% print(compra.costo); %>"></td>
							<td><input  id="inpCantidad" name="inpCantidad"  type="text" style="width:100px;"></td>
							<td></td>
						</tr>		
					</table>
					</td>
				</tr>	
				<tr>
				<td>
					<input type="button" value="aceptar" id="btnAceptarCompraAddSeleccion"></td>
				<td>
					<input type="button" value="cancelar" id="btnCancelarCompraAddSeleccion"></td>
					
				</tr>
				<input type="hidden" id="inpCodigoCompra" name="inpCodigoCompra" value="<% print(compra.codigo); %>">
				<input type="hidden" id="inpCostoCompra" name="inpCostoCompra" value="<% print(compra.costo); %>">
				<input type="hidden" id="inpDescripcionCompra" name="inpDescripcionCompra" value="<% print(compra.descripcion); %>">
				<input type="hidden" id="inpIdCompra" name="inpIdCompra" value="<% print(compra.id); %>">
				<input type="hidden" id="inpIdentificador" name="inpIdentificador" value="<% print(compra.cid); %>">
				<input type="hidden" id="inpIdCompraSeleccionado" name="inpIdCompraSeleccionado" value="">
			</table>
		</div>

	</script>	