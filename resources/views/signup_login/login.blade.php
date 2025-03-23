<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Login</title>
    @vite('resources/css/app.css')
</head>
<body>
    <div class="main-wrapper">
        <h1 class="app-title">Maubook Chat</h1>
        <div class="main-wrap">
            <form action="/login" method="POST">
                @csrf
                <div class="input-fields">
                    <h1 style="text-align:center; font-size:1.5rem; font-weight:500;">Log In!</h1>
                    <div>
                        <input type="text" name="name" placeholder="Username" required>
                        @error('name')
                            <p class="error">{{$message}}</p>
                        @enderror
                    </div>
                    
                    <div>
                        <input type="password" name="password" placeholder="Password" required>
                        @error('password')
                            <p class="error">{{$message}}</p>
                        @enderror
                    </div>
                    

                    <button class="signup-login-btn">Log In</button>
                    <a href="/" style="text-align: center;" title="Login page">Don't have an account?</a>
                </div>
            </form>
        </div>
        @if(session('success'))
            <span style="border-radius:.5rem; padding:1rem; background-color:aliceblue; margin-top:1rem;">
                <p style="color: green; font-size:1.5rem;">{{session('success')}}</p>
            </span>
            
        @endif
        @if(session('error'))
            <span style="border-radius:.5rem; padding:1rem; background-color:aliceblue; margin-top:1rem;">
                <p style="color: rgb(184, 2, 2); font-size:1.5rem;">{{session('error')}}</p>
            </span>
            
        @endif
    </div>
</body>
</html>