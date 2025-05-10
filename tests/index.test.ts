import { ObjectUtils } from '../ObjectUtils';
import { GenericObject } from './test.defns';

describe('Object Manipulation Tests', () => {
	let testObject: GenericObject<number>;
	beforeEach(() => {
		testObject = { a: 1, b: 2, c: { d: 3 } };
	});
    describe('Property Management', () => {
		test.todo('removeProperty should remove a property from an object');
        test.todo('hasProperty should check if an object has a specific property');
        test.todo('getProperty should return a property value with a default fallback');
        test.todo('pick should pick specific properties from an object');
        test.todo('omit should omit specific properties from an object');
    });

    describe('Object Merging', () => {
        test.todo('merge should merge two objects');
        test.todo('mergeDeep should deeply merge two objects');
        test.todo('mergeWith should merge two objects with a custom merge function');
    });

    describe('Object Cloning', () => {
        test.todo('deepClone should create a deep clone of an object');
        test.todo('deepFreeze should deeply freeze an object to prevent modifications');
    });

    describe('Object Inspection', () => {
        test.todo('isEmpty should check if an object is empty');
        test.todo('keys should return the keys of an object');
        test.todo('values should return the values of an object');
        test.todo('entries should return the entries of an object');
        test.todo('deepEqual should check deep equality of two objects');
        test.todo('isEqual should check deep equality of two objects');
    });

    describe('Object Transformation', () => {
        test.todo('mapProperties should map over an object\'s properties');
        test.todo('filterProperties should filter properties of an object based on a predicate');
        test.todo('transform should transform an object based on a callback function');
        test.todo('flatten should flatten a nested object into a single-level object');
        test.todo('unflatten should convert a flattened object back into a nested object');
        test.todo('mapKeys should map the keys of an object to new keys based on a callback function');
    });
});
