import {instanceOfType, Type} from "../../src/model/type";
import {expect} from "chai";

const assert = require('chai').assert


describe('check the functions of the priority', () => {
    it('should be false - not a number', function () {
        let type = "5"
        let actual = instanceOfType(type)
        assert.deepEqual(actual[0], false)
        expect(actual[1]).to.match(/(Type: value is not a number)/)
    });

    it('should be false - out of space', () => {
        let type = -1
        let actual = instanceOfType(type)
        assert.deepEqual(actual[0], false)
        expect(actual[1]).to.match(/(out of valid space)/)
    })

    it('should be false - out of space', () => {
        let type = 4
        let actual = instanceOfType(type)
        assert.deepEqual(actual[0], false)
        expect(actual[1]).to.match(/(out of valid space)/)
    })

    it('should be true - number ok',  () => {
        let priority = Type.Feature
        let actual = instanceOfType(priority)
        assert.deepEqual(actual[0], true)
    })
})

