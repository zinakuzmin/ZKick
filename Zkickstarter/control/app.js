

var users = [
    {
        username: "user",
        password: "pass"
    },
    {
        username: "user1@email.com",
        password: "password"
    }
]

function login() {
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    console.log("Your username is " + username)
    console.log("Your password is " + password)

    var userFromDB = getUserDetails(username)

    for (i = 0; i < users.length; i++){
        if (username == users[i].username && password == users[i].password){
            console.log("You are logged in")
        }
        else{
            console.log("Incorrect username or password")
        }
    }
}