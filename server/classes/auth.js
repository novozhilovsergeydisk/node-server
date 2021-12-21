'use strict'

function Car(brand, color) {
    this.brand = brand;
    this.color = color;
    this.foo = () => console.log('bar');
}

const Machine = ((brand, color) => {
    this.brand = brand;
    this.color = color;
});

Machine.prototype = {};

console.log({ Car });
console.log({ Machine });

console.log( typeof Car );
console.log( typeof Machine );

console.log( Car.__proto__ );
console.log( Machine.__proto__ );

console.log( Car.prototype );
console.log( Machine.prototype );

new Car('Tesla', 'silver');

// new Machine('Tesla', 'silver');
Car.engine = 'Motor';
console.log( Car.engine );

const user = {
    name: "John",
    surname: "",

    set fullName(value) {
        [this.name, this.surname] = value.split(" ");
    },

    get fullName() {
        return `${this.name} ${this.surname}`;
    }
};

const admin = {
    __proto__: user,
    isAdmin: true,
    roles: [{ role: 'user' }, { role: 'admin' }],
    getRole(name) {
        this.roles.forEach(role => {
            if (name === role) {
                return role
            } else {
                return false;
            }
        });
    }
};

const auth = {
    userAuth: true,
    login() {
        return user.fullName;
    },
    logout () {
        console.log("logout");
    },
    register () {
        console.log("register");
    },
    refresh () {
        console.log("refresh");
    },
    token () {
        console.log("token");
    }
};

module.exports = { auth, user, admin, Car };

