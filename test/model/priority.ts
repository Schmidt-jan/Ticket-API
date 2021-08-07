import {instanceOfPriority} from "../../src/model/priority";
import {expect} from "chai";

const assert = require('chai').assert


describe('check the functions of the priority', () => {
    it('should be false - not a number', function () {
        let priority = "5"
        let actual = instanceOfPriority(priority)
        assert.deepEqual(actual[0], false)
        expect(actual[1]).to.match(/(Priority: value is not a number)/)
    });

    it('should be false - out of space', () => {
        let priority = -1
        let actual = instanceOfPriority(priority)
        assert.deepEqual(actual[0], false)
        expect(actual[1]).to.match(/(out of valid space)/)
    })

    it('should be false - out of space', () => {
        let priority = 4
        let actual = instanceOfPriority(priority)
        assert.deepEqual(actual[0], false)
        expect(actual[1]).to.match(/(out of valid space)/)
    })

    it('should be true - number ok',  () => {
        let priority = 2
        let actual = instanceOfPriority(priority)
        assert.deepEqual(actual[0], true)
    })
})

