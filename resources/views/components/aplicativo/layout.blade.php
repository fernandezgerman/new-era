<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http - equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title> {{ $titulo ?? '' }} </title>
    <link rel="stylesheet" type="text/css" href="{{url('assets/css/aplicativo/layout.css')}}" />
    @foreach(($css ?? []) as $style)
        <link rel="stylesheet" type="text/css" href="{{url($style)}}" />
    @endforeach
</head>
<body>
<div id="center-wrapper">
    <div id="content">
        <img id="header-logo" src="/img/dark-logo.png" alt="logo"/>
        <div style="height: 2px;"></div>
        <div>
            <br/>
            <p>
            <h2> {{$tituloEspecifico ?? ''}} </h2>
            </p >
            <br/>
            {{ $slot }}
        </div>
    </div>
</div>
@foreach(($js ?? []) as $script)
    <script type="text/javascript" src="{{url($script)}}"></script>
@endforeach

</body>
</html>

