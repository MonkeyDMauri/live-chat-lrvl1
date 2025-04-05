<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Live Chat</title>
    <meta name='csrf-token' content="{{csrf_token()}}">
    @vite('resources/css/app.css')
    @vite('resources/js/app.js')
</head>
<body class="main_page" user-name="{{auth()->user()->name}}">
    
    <div class="container-wrapper">

        {{-- Messages to be shown at the top --}}
        @if(session('update-success'))
            <p style="text-align:center; font-weight: 600; font-size: 1.5rem;">{{session('update-success')}}</p>
        @endif
        @if (session('update-password-error'))
            <p style="text-align:center; font-weight: 600; font-size: 1.5rem; color:red; margin-top:2rem;">{{session('update-password-error')}}</p>
        @endif

        {{-- main container --}}
        <div class="container-wrap">
            <div class="left-panel">
                <div class="left-panel-user-info-container">
                    <img src="{{asset('storage/profile_pics/male.jpeg')}}" class="left-panel-profile-pic" alt="profile pic"> 
                    <p style="font-size: 2rem;">
                        {{auth()->user()->name}}
                    </p>
                    <p style="font-size: 1.5rem;">
                        {{auth()->user()->email}}
                    </p>
                    
                </div>

                <div class="left-panel-btns-wrapper">
                    <ul class="left-panel-btns">
                        <label for="show-inner-right-panel"class="chat-btn">Chat</label>
                        <label for="hide-inner-right-panel"class="contacts-btn">Contacts</label>
                        <label for="hide-inner-right-panel" class="settings-btn">Settings</label>
                        <label class="logout-btn">Logout</label>
                    </ul>
                </div>
                
            </div>
            <div class="right-panel">
                <div class="right-panel-header">
                    <h1>Maubook Live Chat</h1>
                </div>
                <div class="inner-panels-wrapper">
                    <input type="radio" id="show-inner-right-panel" name="lll" class="radio-flex">
                    <input type="radio" id="hide-inner-right-panel" name="lll" class="radio-flex" checked>
                    <div class="inner-left-panel">
                        <div class="inner-left-panel-content">
                            {{-- contacts or settings will be displayed here depending on what the option the user clicks --}}
                        </div>
                    </div>
                    <div class="inner-right-panel">
                        <div class="inner-right-panel-content">
                            {{-- chats go here --}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="logout-popup-wrapper">
        <div class="logout-popup-wrap">
            <h1>Dou you wanna logout?</h1>
            <div class="logout-btn-wrapper">
                <form action="/logout" method='POST'>
                    @csrf
                    <button class="logout-yes logout-btn">Yes</button>
                </form>
                
                <button class="logout-no logout-btn">No</button>
            </div>
        </div>
    </div>

    <?php
        $user = ['name' => auth()->user()->name,
            'email' => auth()->user()->email,
            'created_at' => auth()->user()->formatDate(),
            'updated_at' => auth()->user()->formatLastUpdate()
        ];
    ?>

    <script>
        const user = @json($user);
    </script>
</body>
</html>