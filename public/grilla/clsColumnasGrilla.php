<?php
class clsColumnasGrilla
{
	var $nombre;
	var $titulo;
	var $ancho;
	var $ordenable;
	var $alineacion;
	var $seBusca;
    var $templateInput;
    var $tipoDato;  #sino,moneda,cantidad

    public function __construct()
    {
        $this->alineacion = 'left';
        $this->seBusca = 'false';
        $this->ordenable = 'false';
    }

    public function setTipoDato($valor)
    {
        $this->tipoDato = $valor;
    }
    public function getTipoDato()
    {
        return $this->tipoDato;
    }

    public function setTemplateInput($valor)
    {
        $this->templateInput = $valor;
    }
    public function getTemplateInput()
    {
        return $this->templateInput;
    }
	public function getAlineacion()
	{

       return $this->alineacion;

	}
	public function getOrdenable()
	{
		return $this->ordenable;
	}	
	public function getAncho()
	{
		return $this->ancho;
	}	
	public function getTitulo()
	{
		return $this->titulo;
	}	
	public function getNombre()
	{
		return $this->nombre;
	}
	public function getSeBusca()
	{
		return $this->seBusca;
	}	
	public function setAlineacion($valor)
	{
		$this->alineacion = $valor;
	}			
	public function setOrdenable($valor)
	{
		$this->ordenable = $valor;
	}			
	public function setAncho($valor)
	{
		$this->ancho = $valor;
	}		
	public function setTitulo($valor)
	{
		$this->titulo = $valor;
	}	
	public function setNombre($valor)
	{
		$this->nombre = $valor;
	}
	public function toArray(){
	    return [
	        'nombre'                => $this->nombre,
            'titulo'                => $this->titulo,
            'ancho'                 => $this->ancho,
            'ordenable'             => $this->ordenable,
            'alineacion'            => $this->alineacion,
            'seBusca'               => $this->seBusca,
            'templateInput'         => $this->templateInput,
            'tipoDato'              => $this->tipoDato,

        ];
    }
	public function setSeBusca($valor)
	{
		$this->seBusca = $valor;
	}	
}

?>