<?php


error_reporting(config('legacy.get_report_error'));	
include_once(config('legacy.get_directorio_utiles').'vector.php');
include_once(config('legacy.get_directorio_grilla').'clsGrillaAbstracta.php');
include_once(config('legacy.get_directorio_utiles').'clsNumeraciones.php');
class clsGrilla extends clsGrillaAbstracta
{
    private function ValoresPorDefecto(){
        if (!$_SESSION['ultimosParametrosCRUD'] || !$this->accesoADatos ){
            return false;
        }
        $parametrosDefecto  =($_SESSION['ultimosParametrosCRUD'])[$this->accesoADatos['permiso']];
        if(!$parametrosDefecto) {
            return false;
        }
        $definidos = $this->accesoADatos['parametros'];
        foreach ($definidos as $clave=>$valor) {
            $par = $parametrosDefecto['parametros'];
            $valor['default'] = $par[$clave];
            $this->setDefectoEnColumna($valor['input'],$valor['default']);
            $definidos[$clave] = $valor;
        }
        $this->accesoADatos['parametros'] = $definidos;

        return true;
    }
    private function setDefectoEnColumna($claveInput,$default){
        for($c =0; $this->objColumnas->size() > $c; $c++){
            $col = $this->objColumnas->get($c);
            if($col->templateInput && $col->templateInput['nombre'] == $claveInput){
                $col->templateInput['default'] = $default;
                $this->objColumnas->directSet($c,$col);

            }
        }
    }
    public function definirGrilla() //Imprime la grilla
	{
        $num = new clsNumeracion();

        $defecto = $this->ValoresPorDefecto();
        $configuracion = $this->toArray();
        $configuracion['cargaAutomatica'] = $defecto;
        $configuracion['filtros'] =$this->contenedorDeFiltros;


        ?>
        <script type="text/javascript" src="js/crudGrilla.js?3"></script>
        <script type="text/javascript" >
            grillaConfiguracion = <?php echo $num->fn_json_encode($configuracion); ?>;
        </script>
        <?php
        include_once('../template/grillaCrudTemplate.php');
        include_once('../template/filtrosGeneralesTemplate.php');
	}
}
?>

