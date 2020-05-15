const packageService = require('../../src/service/packageDestinations');

describe('Test Suite: Package', () => {
    let hotDeals = () => {
        return packageService.hotdeals();
    }

    let destinations = (place) => {
        return packageService.destination(place);
    }

    it('Test Case 1: Search for Australia- valid case', () => {
        expect(destinations('Australia')).toBeTruthy();
    });

    it('Test Case 2: Search for Austria- Invalid case', () => {
        expect(destinations("Austria")).toThrowError(Error,"Sorry we don't operate in this Destination")
    });

    it('Test')
});