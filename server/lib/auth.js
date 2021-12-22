'use strict'

class Auth {
    userAuth = true;

    login() {
        return user.fullName;
    }

    logout () {
        console.log("logout");
    }

    activate () {
        console.log("activate");
    }

    register () {
        console.log("register");
    }

    refresh () {
        console.log("refresh");
    }

    token () {
        console.log("token");
    }
};

module.exports = { Auth };

