<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http - equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title> {{ $title ?? '' }} </title>
    <style type="text/css">
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #282828;;
            color: white;
        }

        #center-wrapper {
            position: absolute;
            left: 0px;
            width: 100%;
            height: 100%;

        }

        #content {
            width: 100%;
            height: 100%;
            text-align: center;
            font-family: Arial, Helvetica, sans -serif;
            margin-top: 20px;
        }

        .botton {
            padding: 6px;
            border-radius: 5px;
            border: 1px solid black;
            cursor: pointer;
            background-color: #EF018B;
            font-weight: bold;
            color: white;
        }
    </style>
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

        </div>
    </div>
</div>

</body>
</html>

