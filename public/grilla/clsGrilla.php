<?php


error_reporting(config('legacy.get_report_error'));	
include_once(config('legacy.get_directorio_utiles').'vector.php');
include_once(config('legacy.get_directorio_grilla').'clsGrillaAbstracta.php');
class clsGrilla extends clsGrillaAbstracta
{
    public $storedProcedure = ([
                    'name'  => '',
                    'parametros' => []
    ]);
	public function definirGrilla() //Imprime la grilla
	{
		?>
		<link rel="stylesheet" type="text/css" href="grilla/css/flexigrid.css" />
        <script type="text/javascript" src="grilla/jquery-1.2.3.pack.js"></script>
        <!-- <script type="text/javascript" src="grilla/jquery.browser.min.js"></script> -->
		<script type="text/javascript" src="grilla/flexigrid.js"></script>
		<script type="text/javascript">
		
		$(document).ready(function(){
			
			$("#flex1").flexigrid
					(
					{
					url: '<?php echo $this->origenGrilla; ?>',
					dataType: 'json',
					colModel : [
						<?php
							$separador='';
							$separadorBusqueda = '';
							$htmlBusqueda ="";
							$htmlOrden = "";
							for($i=0;$i < $this->objColumnas->size();$i++)
							{
								$fila = $this->objColumnas->get($i);
								echo $separador."{display: '".$fila->getTitulo()."', name : '".$fila->getNombre()."', width : ".$fila->getAncho().", sortable : ".$fila->getOrdenable().", align: '".$fila->getAlineacion()."'}\n";
								$separador=',';
								
								if ($fila->getSeBusca()=='true')
								{	
									$htmlBusqueda .= $separadorBusqueda."{display: '".$fila->getTitulo()."', name : '".$fila->getNombre()."'}\n";
									$separadorBusqueda = ',';
								}
							}
						/*
						{display: 'ID', name : 'id', width : 40, sortable : true, align: 'center'},
						{display: 'ISO', name : 'iso', width : 40, sortable : true, align: 'center'},
						{display: 'Name', name : 'name', width : 180, sortable : true, align: 'left'},
						{display: 'Printable Name', name : 'printable_name', width : 120, sortable : true, align: 'left'},
						{display: 'ISO3', name : 'iso3', width : 130, sortable : true, align: 'left', hide: true},
						{display: 'Number Code', name : 'numcode', width : 80, sortable : true, align: 'right'}*/ ?>
						],
					buttons : [
						<?php 
						if ($this->origenIns){
								echo "{name: 'Add', bclass: 'add', onpress : test},";
						 } 
						 if ($this->modoBuscador==true){
						 	//echo "{name: 'Select', bclass: 'add', onpress : test},";
						 }else{
						 	if ($this->origenDel){
								echo "{name: 'Delete', bclass: 'delete', onpress : test},";
						 	}
							echo "{name: 'Edit', bclass: 'edit', onpress : test},";
						}
						?>
						{separator: true},
						<?php if ($this->usaFiltroPorLetra==true){ ?>
							{name: 'A', onpress: sortAlpha},
							{name: 'B', onpress: sortAlpha},
							{name: 'C', onpress: sortAlpha},
							{name: 'D', onpress: sortAlpha},
							{name: 'E', onpress: sortAlpha},
							{name: 'F', onpress: sortAlpha},
							{name: 'G', onpress: sortAlpha},
							{name: 'H', onpress: sortAlpha},
							{name: 'I', onpress: sortAlpha},
							{name: 'J', onpress: sortAlpha},
							{name: 'K', onpress: sortAlpha},
							{name: 'L', onpress: sortAlpha},
							{name: 'M', onpress: sortAlpha},
							{name: 'N', onpress: sortAlpha},
							{name: 'O', onpress: sortAlpha},
							{name: 'P', onpress: sortAlpha},
							{name: 'Q', onpress: sortAlpha},
							{name: 'R', onpress: sortAlpha},
							{name: 'S', onpress: sortAlpha},
							{name: 'T', onpress: sortAlpha},
							{name: 'U', onpress: sortAlpha},
							{name: 'V', onpress: sortAlpha},
							{name: 'W', onpress: sortAlpha},
							{name: 'X', onpress: sortAlpha},
							{name: 'Y', onpress: sortAlpha},
							{name: 'Z', onpress: sortAlpha},
							{name: '#', onpress: sortAlpha}
						<?php } ?>
						],
					searchitems : [
						<?php echo $htmlBusqueda; ?>
						],
					sortname: "id",
					sortorder: "asc",
					usepager: true,
					title: '<?php echo $this->titulo; ?>',
					useRp: true,
					rp: 20,
					showTableToggleBtn: true,
					width: <?php echo (int)$this->ancho; ?>,
					height: <?php echo (int)$this->alto; ?>
					}
					);   
			
		});

		function sortAlpha(com)
					{ 
					jQuery('#flex1').flexOptions({newp:1, params:[{name:'letter_pressed', value: com},{name:'qtype',value:$(														'select[name=qtype]').val()}]});
					jQuery("#flex1").flexReload(); 
					}
		
		function test(com,grid)
		{
			if (com=='Delete')
				{
				   if($('.trSelected',grid).length>0){
					   if(confirm('Esta seguro que desea eliminar ' + $('.trSelected',grid).length + ' elementos?')){
						var items = $('.trSelected',grid);
						var itemlist ='';
						for(i=0;i<items.length;i++){
							itemlist+= items[i].id.substr(3)+",";
						}
						$.ajax({
						   type: "POST",
						   dataType: "json",
						   url: "<?php echo $this->origenDel; ?>",
						   data: "items="+itemlist,
						   success: function(data){

							alert(data.query+" - Filas afectadas: "+data.total);
						   $("#flex1").flexReload();
						   }
						 });
					}
					} else {
						return false;
					} 
				}
			else if (com=='Add')
				{
					location.href="<?php echo $this->origenIns; ?>";
				}
			else if (com=='Select')
				{
					if($('.trSelected',grid).length==1){

					}else{
						if($('.trSelected',grid).length==0){
							alert('No selecciono; ningun registro');
						}else{
							alert('Debe seleccionar un solo registro.');
						}
					}
				}				
			else if (com=='Edit')
				{
					if($('.trSelected',grid).length==1){
						var items = $('.trSelected',grid);
						var idItem = items[0].id.substr(3);												
						location.href="<?php echo $this->origenEdit; ?>&id="+idItem;
					}else{
						if($('.trSelected',grid).length==0){
							alert('No selecciono ningun registro');
						}else{
							alert('Para editar un item, debe seleccionar un solo registro');
						}
					}
				}
		} 
		</script>		
		<?php
	}
}

?>