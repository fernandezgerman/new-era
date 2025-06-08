<?php
    abstract class clsGrillaAbstracta{
        var $objColumnas;
        var $origenGrilla;
        var $origenDel;
        var $origenIns;
        var $origenEdit;
        var $titulo;
        var $ancho;
        var $alto;
        var $usaFiltroPorLetra;
        var $elimina;
        var $agrega;
        var $modoBuscador;
        var $accesoADatos;
        function __construct()
        {
            $this->objColumnas = new ContenedorDeObjetos();
            $this->ancho = 880;
            $this->alto = 600;
            $this->usaFiltroPorLetra = true;
            $this->elimina = true;
            $this->agrega = true;
            $this->modoBuscador = false;
        }
        public function setElimina($valor)
        {
            $this->elimina = $valor;
        }
        public function setModoBuscador($valor)
        {
            $this->modoBuscador = $valor;
        }
        public function setAgrega($valor)
        {
            $this->agrega = $valor;
        }
        public function setUsaFiltroPorLetra($valor) //Define si utiliza el filtro por letra o no
        {
            $this->usaFiltroPorLetra = $valor;
        }
        public function setAlto($valor) // define el alto de la grilla
        {
            $this->alto = $valor;
        }
        public function setAncho($valor) //define el ancho de la grilla
        {
            $this->ancho = $valor;
        }
        public function setTitulo($valor) // define el titulo de la grilla
        {
            $this->titulo = $valor;
        }
        public function setOrigenEdit($valor)  //define el php destino para la edicion
        {
            $this->origenEdit = $valor;
        }
        public function setOrigenDel($valor)  //define el ophp para la eliminaci�n
        {
            $this->origenDel = $valor;
        }
        public function setOrigenIns($valor)  //define el ophp para la eliminaci�n
        {
            $this->origenIns = $valor;
        }
        public function setOrigenGrilla($valor)  //define el php que llena la grilla
        {
            $this->origenGrilla = $valor;
        }
        public function agregarColumna($columna) //agrega la configuraci�n de una columna, de tipo "clsColumnasGrilla"
        {
            $this->objColumnas->add($columna);
        }
        public function  toArray(){
            $columnas = [];
            for($c=0; $c < $this->objColumnas->size(); $c++){
                $col = $this->objColumnas->get($c);
                $columnas[$c] = $col->toArray();
            }

            return [
                'modoBuscador'      => $this->modoBuscador,
                'agrega'            => $this->agrega   ,
                'elimina'           => $this->elimina,
                'usaFiltroPorLetra' => $this->usaFiltroPorLetra,
                'alto'              => $this->alto,
                'ancho'             => $this->ancho,
                'titulo'            => $this->titulo,
                'origenEdit'        => $this->origenEdit,
                'origenIns'         => $this->origenIns,
                'origenDel'         => $this->origenDel,
                'origenGrilla'      => $this->origenGrilla,
                'columnas'          => $columnas,
                'accesoADatos'      => $this->accesoADatos,

            ];


        }
        public abstract function definirGrilla();


    }
?>