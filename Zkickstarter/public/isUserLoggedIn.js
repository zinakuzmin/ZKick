$.ajax(
    {
        type:'GET',
        url:'/getUserDetails',
        success: function(response){
            if (response.data === 'undefined' && response != null){
                document.getElementById("current_user_id").innerHTML = response.data.id
                document.getElementById("is_admin").innerHTML = response.data.is_admin
            }
            loginLogoutButton(response);

        }
    }
);


function loginLogoutButton(response){
    if (response.data != 'undefined'){
        //User is logged in - show logout and view profile buttons
        userLoggedIn(response.data.firstName,response.data.lastName)
    }
    else{
        //show login button
        userNotLoggedIn()
    }
}


function userNotLoggedIn(){
    document.getElementById("login_button").style.display = 'block'
    document.getElementById("my_profile_button").style.display = 'none'
    document.getElementById("logout_button").style.display = 'none'
}

function userLoggedIn(userFirstName, userLastName){
    document.getElementById("login_button").style.display = 'none'
    document.getElementById("my_profile_button").style.display = 'block'
    document.getElementById("logout_button").style.display = 'block'
    document.getElementById("userName").innerText = userFirstName + " " + userLastName;
}