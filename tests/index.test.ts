import { ObjectUtils } from '../ObjectUtils';
import { GenericObject } from './test.defns';

describe("Object Manipulation Tests", () => {
    describe("Property Management", () => {
		let testObject: GenericObject<number>;
		let result: number | boolean | GenericObject<number>;
		let expectedValue: number | GenericObject<number>; 
		let expectedObj: GenericObject<number> = { a: 1, c: { d: 3 } };
		beforeEach(() => {
			testObject = { a: 1, b: 2, c: { d: 3 } };
		});
		test("'removeProperty' should remove a property from an object.", () => {
			expectedObj = { a: 1, c: { d: 3 } };
			result = ObjectUtils.removeProperty(testObject, 'b');
			expect(result).toEqual(expectedObj);
		});
        test("'hasProperty' should check if an object has a specific property.", () => {
			result = ObjectUtils.hasProperty(testObject, 'a');
			expect(result).toBe(true);
			result = ObjectUtils.hasProperty(testObject, 'z');
			expect(result).toBe(false);
		});
        test("'getProperty' should return a property value with a default fallback.", () => {
			const defaultValue = 0;
			result = ObjectUtils.getProperty(testObject, 'a', defaultValue);
			expectedValue = testObject['a'];
			expect(result).toBe(expectedValue);
			result = ObjectUtils.getProperty(testObject, 'z', defaultValue);
			expectedValue = testObject['z'];
			expect(result).toBe(expectedValue ?? defaultValue);
		});
        test("'pick' should pick specific properties from an object.", () => {
			result = ObjectUtils.pick(testObject, ['a', 'c']);
			expectedObj = { a: 1, c: { d: 3 } };
			expect(result).toEqual(expectedObj);
		});
        test("'omit' should omit specific properties from an object.", () => {
			result = ObjectUtils.omit(testObject, ['a', 'c']);
			expectedObj = { b: 2 };
			expect(result).toEqual(expectedObj);
		});
    });

    describe('Object Merging', () => {
		let result: GenericObject<number>;
		let target: GenericObject<number>;
		let source: GenericObject<number>;
		let mergedObj: GenericObject<number>;
        test("'merge' should merge two objects.", () => {
			target = { a: 1 };
			source = { b: 2 };
			mergedObj = { a: 1, b: 2 };
			console.log(mergedObj);
			result = ObjectUtils.merge(target, source);
			expect(result).toEqual(mergedObj);
		});
        test("'mergeDeep' should deeply merge two objects.", () => {
			target = { a: { b: 1 } };
			source = { a: { c: 2 }, d: 3 };
			mergedObj = { a: { b: 1, c: 2 }, d: 3 };
			result = ObjectUtils.mergeDeep(target, source);
			expect(result).toEqual(mergedObj);
		});
        test("'mergeWith' should merge two objects with a custom merge function.", () => {
			target = { a: 1, b: 2 };
			source = { b: 3, c: 4 };
			mergedObj = { a: 1, b: 5, c: 4 };
			result = ObjectUtils.mergeWith(target, source, (targetValue, sourceValue) => targetValue + sourceValue);
			expect(result).toEqual(mergedObj);
		});
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
