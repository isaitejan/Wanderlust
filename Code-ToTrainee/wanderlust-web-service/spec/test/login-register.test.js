const userService = require('../../src/service/userslogin')

describe('Test Suite: Login', () => {
    it('Test Case 1: Valid Login Case', () => {
        userService.login(9000000045, "Hitman$45").then(user => {
            expect(user).toBeTruthy();
        });
    });

    it('Test Case 2: Invalid ContactNo Case', () => {
        userService.login(9000004005, "Hitman$45").then(user => {
            expect(user).not.toBeTruthy();
        }).catch(error => {
            expect(error.message).toBe("Enter the registered contact number!")
        });
    });

    it('Test Case 3: Invalid Password Case', () => {
        userService.login(9000000045, "Hitman@45").then(user => {
            expect(user).not.toBeTruthy();
        }).catch(error => {
            expect(error.message).toBe("Enter correct password")
        });
    })
});

describe('Test Suite: Register', () => {
    let userObj = {
        "name": "Rohit Sharma",
        "emailId": "hitman45@gmail.com",
        "contactNo": 9000000045,
        "password": "Hitman$45"
    }
    let register = (userObj) => {
        return userService.register(userObj)
    }

    it('Test Case 1: Valid register', () => {
        expect(register(userObj)).toBeTruthy()
    });

    it('Test Case 2: Invalid register', () => {
        expect(register(userObj)).toThrowError(Error,'Already registered')
    })
});