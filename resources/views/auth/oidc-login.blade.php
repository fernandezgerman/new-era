<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login OIDC</title>
    @vite('resources/css/app.css')
    <style>
        body { background-color: #f7fafc; }
        .login-container { max-width: 400px; margin: 100px auto; padding: 20px; background: white; border-radius: 8px; shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .logo { text-align: center; margin-bottom: 20px; }
        .logo img { max-width: 200px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        button { width: 100%; padding: 10px; background-color: #4a5568; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #2d3748; }
        .error { color: #e53e3e; margin-bottom: 15px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <img src="{{ asset('img/light-logo.png') }}" alt="Logo">
        </div>

        <h2 style="text-align: center; margin-bottom: 20px;">Iniciar Sesión</h2>

        @if ($errors->any())
            <div class="error">
                @foreach ($errors->all() as $error)
                    <p>{{ $error }}</p>
                @endforeach
            </div>
        @endif

        <form action="{{ url('/oidc/login') }}" method="POST">
            @csrf
            <div class="form-group">
                <label for="usuario">Usuario</label>
                <input type="text" name="usuario" id="usuario" value="{{ old('usuario') }}" required autofocus>
            </div>

            <div class="form-group">
                <label for="clave">Clave</label>
                <input type="password" name="clave" id="clave" required>
            </div>

            <button type="submit">Ingresar</button>
        </form>
    </div>
</body>
</html>
