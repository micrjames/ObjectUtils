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
		describe("removeProperty", () => {
			test("Should remove a property from an object.", () => {
				expectedObj = { a: 1, c: { d: 3 } };
				result = ObjectUtils.removeProperty(testObject, 'b');
				expect(result).toEqual(expectedObj);
			});
		});
		describe("hasPropery", () => {
			test("Should check if an object has a specific property.", () => {
				result = ObjectUtils.hasProperty(testObject, 'a');
				expect(result).toBe(true);
				result = ObjectUtils.hasProperty(testObject, 'z');
				expect(result).toBe(false);
			});
		});
        describe("getProperty", () => {
			test("Should return a property value with a default fallback.", () => {
				const defaultValue = 0;
				result = ObjectUtils.getProperty(testObject, 'a', defaultValue);
				expectedValue = testObject['a'];
				expect(result).toBe(expectedValue);
				result = ObjectUtils.getProperty(testObject, 'z', defaultValue);
				expectedValue = testObject['z'];
				expect(result).toBe(expectedValue ?? defaultValue);
			});
		});
		describe("pick", () => {
			test("Should pick specific properties from an object.", () => {
				result = ObjectUtils.pick(testObject, ['a', 'c']);
				expectedObj = { a: 1, c: { d: 3 } };
				expect(result).toEqual(expectedObj);
			});
		});
		describe("omit", () => {
			test("Should omit specific properties from an object.", () => {
				result = ObjectUtils.omit(testObject, ['a', 'c']);
				expectedObj = { b: 2 };
				expect(result).toEqual(expectedObj);
			});
		});
    });

    describe('Object Merging', () => {
		let result: GenericObject<number>;
		let target: GenericObject<number>;
		let source: GenericObject<number>;
		let mergedObj: GenericObject<number>;
		describe("merge", () => {
			test("Should merge two objects.", () => {
				target = { a: 1 };
				source = { b: 2 };
				mergedObj = { a: 1, b: 2 };
				console.log(mergedObj);
				result = ObjectUtils.merge(target, source);
				expect(result).toEqual(mergedObj);
			});
		});
		describe("mergeDeep", () => {
			test("Should deeply merge two objects.", () => {
				target = { a: { b: 1 } };
				source = { a: { c: 2 }, d: 3 };
				mergedObj = { a: { b: 1, c: 2 }, d: 3 };
				result = ObjectUtils.mergeDeep(target, source);
				expect(result).toEqual(mergedObj);
			});
		});
		describe("mergeWith", () => {
			test("Should merge two objects with a custom merge function.", () => {
				target = { a: 1, b: 2 };
				source = { b: 3, c: 4 };
				mergedObj = { a: 1, b: 5, c: 4 };
				result = ObjectUtils.mergeWith(target, source, (targetValue, sourceValue) => targetValue + sourceValue);
				expect(result).toEqual(mergedObj);
			});
		});
    });

    describe('Object Cloning', () => {
		describe("deepClone", () => {
			type ValueType = string | number | Date | (() => string) | string[] | GenericObject<any>;
			let testObject: GenericObject<ValueType>;
			let clone: Array<ValueType> | GenericObject<ValueType>;
			beforeEach(() => {
				testObject = {
					name: "Alice",
					age: 30,
					date: new Date(),
					greet: function() { return "Hello!"; },
					nested: {
						hobbies: ["reading", "gaming"],
						address: {
							city: "Wonderland",
							zip: 12345
						}
					}
				};
			});
			test("Should create a deep clone of an object.", () => {
				clone = ObjectUtils.deepClone(testObject);
				console.log(clone);
				expect(clone).toEqual(testObject);
				expect(clone).not.toBe(testObject); // Ensure it's a different reference
			});
			test("Should clone nested objects.", () => {
				clone = ObjectUtils.deepClone(testObject);
				expect(clone.nested).toEqual(testObject.nested);
				expect(clone.nested).not.toBe(testObject.nested); // Ensure nested object is a different reference
			});
			test("Should clone arrays.", () => {
				clone = ObjectUtils.deepClone(testObject);
				expect((clone.nested as GenericObject<ValueType>).hobbies).toEqual((testObject.nested as GenericObject<ValueType>).hobbies);
				expect((clone.nested as GenericObject<ValueType>).hobbies).not.toBe((testObject.nested as GenericObject<ValueType>).hobbies); // Ensure array is a different reference
			});
			test("Should clone dates.", () => {
				clone = ObjectUtils.deepClone(testObject);
				expect(clone.date).toEqual(testObject.date);
				expect(clone.date).not.toBe(testObject.date); // Ensure date is a different reference
				expect(clone.date instanceof Date).toBe(true); // Ensure it's still a Date object
			});
			test("Should clone functions.", () => {
				clone = ObjectUtils.deepClone(testObject);
				expect(clone.greet).toEqual(testObject.greet); // Ensure function behavior is the same
			});
			test("Should handle circular references.", () => {
				const circularObject: any = {};
				circularObject.self = circularObject; // Create a circular reference
				const clone = ObjectUtils.deepClone(circularObject);
				expect(clone).toEqual(circularObject);
				expect(clone).not.toBe(circularObject); // Ensure it's a different reference
				expect(clone.self).toBe(clone); // Ensure the circular reference is preserved
			});
			test("Should handle null and undefined.", () => {
				const cloneNull = ObjectUtils.deepClone(null); 
				const cloneUnd = ObjectUtils.deepClone(undefined);
				expect(cloneNull).toBeNull();
				expect(cloneUnd).toBeUndefined();
			});
		});
		describe("deepFreeze", () => {
			test.todo("Should deeply freeze an object to prevent modifications.");
		});
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
