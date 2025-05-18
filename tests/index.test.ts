import { ObjectUtils } from '../ObjectUtils';
import { Entry } from "../defns";
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
			test("Should return the original object when the property does not exist.", () => {
			    expectedObj = { a: 1, b: 2, c: { d: 3 } };
                result = ObjectUtils.removeProperty(testObject, 'nonExistentProperty' as keyof typeof testObject);
                expect(result).toEqual(expectedObj);
			});
			test("Should not affect nested properties when removing a top-level property.", () => {
			    expectedObj = { a: 1, c: { d: 3 } };
                result = ObjectUtils.removeProperty(testObject, 'b');
                expect(result).toEqual(expectedObj);
			});
			test("Should return an empty object when called on an empty object.", () => {
			    const emptyObject = {};
                const result = ObjectUtils.removeProperty(emptyObject, 'anyProperty' as keyof typeof emptyObject);
                expect(result).toEqual({});
			});
			test("Should only remove the specified property and leave others intact.", () => {
				expectedObj = { a: 1, c: { d: 3 } };
                result = ObjectUtils.removeProperty(testObject, 'b');
                expect(result).toEqual(expectedObj);
                expect(result).not.toHaveProperty('b');
			});
			test("Should perform efficiently with large objects.", () => {
			    const largeObject = { a: 1, b: 2, ...Array.from({ length: 1000 }, (_, i) => ({ [`key${i}`]: i })) };
                const result = ObjectUtils.removeProperty(largeObject, 'b');
                expect(result).toHaveProperty('a');
                expect(result).not.toHaveProperty('b');
			});
			test("Should not mutate the original object.", () => {
				const originalObject = { ...testObject };
                ObjectUtils.removeProperty(testObject, 'b');
                expect(testObject).toEqual(originalObject);
			});
		});
		describe("hasProperty", () => {
			test("Should check if an object has a specific property.", () => {
				result = ObjectUtils.hasProperty(testObject, 'a');
				expect(result).toBe(true);
				result = ObjectUtils.hasProperty(testObject, 'z');
				expect(result).toBe(false);
			});
			test("Should return false for an empty object.", () => {
				const emptyObject: Record<string, unknown> = {};
				result = ObjectUtils.hasProperty(emptyObject, 'a');
                expect(result).toBe(false);
			});
		});
        describe("getProperty", () => {
			test("Should return a property value with a default fallback.", () => {
				const defaultValue = 0;
				result = ObjectUtils.getProperty(testObject, 'a', defaultValue) as number | boolean | GenericObject<number>;
				expectedValue = testObject['a'] as number | GenericObject<number>;
				expect(result).toBe(expectedValue);
				result = ObjectUtils.getProperty(testObject, 'z', defaultValue) as number | boolean | GenericObject<number>;
				expectedValue = testObject['z'] as number | GenericObject<number>;
				expect(result).toBe(expectedValue ?? defaultValue);
			});
			test("Should return the default value when the property is undefined.", () => {
			    const defaultValue = 10;
                result = ObjectUtils.getProperty(testObject, 'z', defaultValue) as number | boolean | GenericObject<number>;
                expect(result).toBe(defaultValue);
			});
            test("Should return the correct value for nested properties.", () => {
				const defaultValue = { d: 0 };
                result = ObjectUtils.getProperty(testObject, 'c', defaultValue) as number | boolean | GenericObject<number>;
                expect(result).toEqual(testObject.c);
			});
		});
		describe("pick", () => {
			test("Should pick specific properties from an object.", () => {
				result = ObjectUtils.pick(testObject, ['a', 'c']);
				expectedObj = { a: 1, c: { d: 3 } };
				expect(result).toEqual(expectedObj);
			});
			test("Should return an empty object when no properties are picked.", () => {
				result = ObjectUtils.pick(testObject, []);
                expect(result).toEqual({});
			});
            test("Should ignore non-existent properties when picking.", () => {
				result = ObjectUtils.pick(testObject, ['a', 'nonExistentProperty']);
                expectedObj = { a: 1 };
                expect(result).toEqual(expectedObj);
			});
            test("Should return only the properties that exist in the object.", () => {
				result = ObjectUtils.pick(testObject, ['b', 'c']);
                expectedObj = { b: 2, c: { d: 3 } };
                expect(result).toEqual(expectedObj);
			});
		});
		describe("omit", () => {
			test("Should omit specific properties from an object.", () => {
				result = ObjectUtils.omit(testObject, ['a', 'c']);
				expectedObj = { b: 2 };
				expect(result).toEqual(expectedObj);
			});
			test("Should return the original object when no properties are omitted.", () => {
				result = ObjectUtils.omit(testObject, []);
                expect(result).toEqual(testObject);
			});
            test("Should ignore non-existent properties when omitting.", () => {
			    result = ObjectUtils.omit(testObject, ['nonExistentProperty']);
                expect(result).toEqual(testObject);
			});
            test("Should omit multiple properties correctly.", () => {
			    result = ObjectUtils.omit(testObject, ['a', 'b']);
                expectedObj = { c: { d: 3 } };
                expect(result).toEqual(expectedObj);
			});
            test("Should return an empty object when all properties are omitted.", () => {
				result = ObjectUtils.omit(testObject, ['a', 'b', 'c']);
                expect(result).toEqual({});
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
				result = ObjectUtils.merge(target, source);
				expect(result).toEqual(mergedObj);
			});
			test("Should overwrite properties in the target object with properties from the source object.", () => {
				target = { a: 1, b: 2 };
				source = { b: 3, c: 4 };
				mergedObj = { a: 1, b: 3, c: 4 };
				result = ObjectUtils.merge(target, source);
				expect(result).toEqual(mergedObj);
			});
			test("Should handle merging with empty objects.", () => {
				target = {};
				source = { a: 1 };
				mergedObj = { a: 1 };
				result = ObjectUtils.merge(target, source);
				expect(result).toEqual(mergedObj);
			});
			test("Should return a new object without mutating the original objects.", () => {
				target = { a: 1 };
				source = { b: 2 };
				result = ObjectUtils.merge(target, source);
				expect(target).toEqual({ a: 1 });
				expect(source).toEqual({ b: 2 });
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
			test("Should handle merging with nested objects and arrays.", () => {
				target = { a: { b: 1, c: [1, 2] } };
				source = { a: { c: [3, 4], d: 5 }, e: 6 };
				mergedObj = { a: { b: 1, c: [3, 4], d: 5 }, e: 6 };
				result = ObjectUtils.mergeDeep(target, source);
				expect(result).toEqual(mergedObj);
			});
			test("Should not mutate the original objects during deep merge.", () => {
				target = { a: { b: 1 } };
				source = { a: { c: 2 }, d: 3 };
				result = ObjectUtils.mergeDeep(target, source);
				expect(target).toEqual({ a: { b: 1 } });
				expect(source).toEqual({ a: { c: 2 }, d: 3 });
			});
			test("Should handle merging with empty objects.", () => {
				target = { a: { b: 1 } };
				source = {};
				mergedObj = { a: { b: 1 } };
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
			test("Should apply custom merge function only to existing properties in the target.", () => {
				target = { a: 1, b: 2 };
				source = { b: 3, c: 4 };
				mergedObj = { a: 1, b: 5, c: 4 };
				result = ObjectUtils.mergeWith(target, source, (targetValue, sourceValue) => targetValue + sourceValue);
				expect(result).toEqual(mergedObj);
			});
			test("Should handle merging with a custom function that returns a different type.", () => {
				target = { a: 1, b: 2 };
				source = { b: 3, c: 4 };
				mergedObj = { a: 1, b: "2-3", c: 4 }; // Custom merge function concatenates numbers as strings
				result = ObjectUtils.mergeWith(target, source, (targetValue, sourceValue) => `${targetValue}-${sourceValue}`);
				expect(result).toEqual(mergedObj);
			});
			test("Should return a new object without mutating the original objects.", () => {
				target = { a: 1, b: 2 };
				source = { b: 3, c: 4 };
				result = ObjectUtils.mergeWith(target, source, (targetValue, sourceValue) => targetValue + sourceValue);
				expect(target).toEqual({ a: 1, b: 2 });
				expect(source).toEqual({ b: 3, c: 4 });
			});
			test("Should handle merging with empty objects.", () => {
				target = { a: 1 };
				source = {};
				mergedObj = { a: 1 };
				result = ObjectUtils.mergeWith(target, source, (targetValue, sourceValue) => targetValue + sourceValue);
				expect(result).toEqual(mergedObj);
			});
			test("Should handle merging when the target has properties not in the source.", () => {
				target = { a: 1, b: 2 };
				source = { b: 3 };
				mergedObj = { a: 1, b: 5 }; // Custom merge function adds values
				result = ObjectUtils.mergeWith(target, source, (targetValue, sourceValue) => targetValue + sourceValue);
				expect(result).toEqual(mergedObj);
			});
			test("Should handle merging when the source has properties not in the target.", () => {
				target = { a: 1 };
				source = { b: 2, c: 3 };
				mergedObj = { a: 1, b: 2, c: 3 }; // Direct assignment for new properties
				result = ObjectUtils.mergeWith(target, source, (targetValue, sourceValue) => targetValue + sourceValue);
				expect(result).toEqual(mergedObj);
			});
		});
    });

    describe('Object Cloning and Freezing', () => {
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
			test("Should deeply freeze an object to prevent modifications.", () => {
				const obj = { a: 1, b: { c: 2 } };
				const frozenObj = ObjectUtils.deepFreeze(obj);
				expect(() => {
					frozenObj.a = 2; // Attempt to modify
				}).toThrow();
				expect(() => {
					frozenObj.b.c = 3; // Use type assertion to access 'c'
				}).toThrow();
			});
			test("Should not throw when accessing properties of a frozen object.", () => {
				const obj = { a: 1, b: { c: 2 } };
				const frozenObj = ObjectUtils.deepFreeze(obj);
				expect(frozenObj.a).toBe(1);
				expect(frozenObj.b.c).toBe(2);
			});
			test("Should freeze an object with nested arrays.", () => {
				const obj = { a: 1, b: { c: [1, 2, 3] } };
				const frozenObj = ObjectUtils.deepFreeze(obj);
				expect(() => {
					frozenObj.b.c[0] = 4; // Attempt to modify array element
				}).toThrow();
			});
			test("Should freeze an object with nested objects and arrays.", () => {
				const obj = { a: 1, b: { c: { d: 2 }, e: [1, 2] } };
				const frozenObj = ObjectUtils.deepFreeze(obj);
				expect(() => {
					frozenObj.b.c.d = 3; // Attempt to modify nested object property
				}).toThrow();
				expect(() => {
					frozenObj.b.e[1] = 3; // Attempt to modify array element
				}).toThrow();
			});
			test("Should return the same object reference after freezing.", () => {
				const obj = { a: 1 };
				const frozenObj = ObjectUtils.deepFreeze(obj);
				expect(frozenObj).toBe(obj); // Ensure the reference is the same
			});
			test("Should handle freezing an empty object.", () => {
				const obj = {};
				const frozenObj = ObjectUtils.deepFreeze(obj);
				expect(() => {
					(frozenObj as { newProp?: number }).newProp = 1; // Attempt to modify
				}).toThrow();
			});
			test("Should handle freezing an object with non-enumerable properties.", () => {
				const obj = Object.create({}, {
					a: { value: 1, enumerable: true },
					b: { value: 2, enumerable: false }
				});
				const frozenObj = ObjectUtils.deepFreeze(obj);
				expect(() => {
					frozenObj.a = 3; // Attempt to modify enumerable property
				}).toThrow();
				expect(() => {
					frozenObj.b = 4; // Attempt to modify non-enumerable property
				}).toThrow();
			});
		});
    });
	describe("Object Inspection", () => {
		describe("isEmpty", () => {
			let isObjEmpty: boolean;

			test.each([
				[{}, true, "an empty object"],
				[{ a: 1 }, false, "a non-empty object"],
				[{ a: {}, b: 2 }, false, "an object with nested empty objects"],
				[{ a: [], b: [] }, false, "an object with only empty arrays"],
			])("'%j' should return %s for %s.", (obj, expected, _) => {
				isObjEmpty = ObjectUtils.isEmpty(obj);
				expect(isObjEmpty).toBe(expected);
			});
		});
		describe("keys", () => {
			let testObject: GenericObject<number>;
			let keys: string[];
			let result: (number | string)[];
			test("Should return the keys of an object.", () => {
				testObject = { a: 1, b: 2, c: { d: 3 } };
				keys = ['a', 'b', 'c'];
				result = ObjectUtils.keys(testObject);
				expect(result).toEqual(keys);
			});
			test("Should return an empty array for an empty object.", () => {
				testObject = {};
				keys = [];
				result = ObjectUtils.keys(testObject);
				expect(result).toEqual(keys);
			});
			test("Should return keys of an object with nested properties.", () => {
				testObject = { a: 1, b: { c: 2 } };
				keys = ['a', 'b'];
				result = ObjectUtils.keys(testObject);
				expect(result).toEqual(keys);
			});
		});
		describe("values", () => {
			let testObject: GenericObject<number>;
			let values: (number | GenericObject<number>)[];
			let result: (string | number | GenericObject<number> | number[])[]; 
			test("Should return the values of an object.", () => {
				testObject = { a: 1, b: 2, c: { d: 3 } };
				values = [1, 2, { d: 3 }]; 
				result = ObjectUtils.values(testObject);
				expect(result).toEqual(values);
			});
			test("Should return an empty array for an empty object.", () => {
				testObject = {};
				values = [];
				result = ObjectUtils.values(testObject);
				expect(result).toEqual(values);
			});
			test("Should return values of an object with nested properties.", () => {
				testObject = { a: 1, b: { c: 2 } };
				values = [1, { c: 2 }];
				result = ObjectUtils.values(testObject);
				expect(result).toEqual(values);
			});
		});
		describe("entries", () => {
			let testObject: GenericObject<number>;
			let entries: Entry<typeof testObject>[];
			let result: typeof entries;
			test("Should return the entries of an object.", () => {
				testObject = { a: 1, b: 2, c: { d: 3 } };
				entries = [['a', 1], ['b', 2], ['c', { d: 3 }]];
				result = ObjectUtils.entries(testObject);
				expect(result).toEqual(entries);
			});
			test("Should return an empty array for an empty object.", () => {
				testObject = {};
				entries = [];
				result = ObjectUtils.entries(testObject);
				expect(result).toEqual(entries);
			});
			test("Should return entries of an object with nested properties.", () => {
				testObject = { a: 1, b: { c: 2 } };
				entries = [['a', 1], ['b', { c: 2 }]];
				result = ObjectUtils.entries(testObject);
				expect(result).toEqual(entries);
			});
		});
		describe("deepEqual", () => {
			let result: boolean;
			let obj1: GenericObject<number>;
			let obj2: GenericObject<number>;
			test("Should check deep equality of two objects.", () => {
				obj1 = { a: 1, b: { c: 2 } };
				obj2 = { a: 1, b: { c: 2 } };
				result = ObjectUtils.deepEqual(obj1, obj2);
				expect(result).toBeTruthy();
			});
			test("Should return false for objects that are not deeply equal.", () => {
				obj1 = { a: 1, b: { c: 2 } };
				obj2 = { a: 1, b: { c: 3 } };
				result = ObjectUtils.deepEqual(obj1, obj2);
				expect(result).toBeFalsy();
			});
			test("Should return true for deeply equal nested objects.", () => {
				obj1 = { a: { b: 1 }, c: 2 };
				obj2 = { a: { b: 1 }, c: 2 };
				result = ObjectUtils.deepEqual(obj1, obj2);
				expect(result).toBeTruthy();
			});
			test("Should return false for objects with different structures.", () => {
				obj1 = { a: 1, b: 2 };
				obj2 = { a: 1, b: { c: 2 } };
				result = ObjectUtils.deepEqual(obj1, obj2);
				expect(result).toBeFalsy();
			});
		});
		describe("isEqual", () => {
			let result: boolean;
			let obj1: GenericObject<number>;
			let obj2: GenericObject<number>;
			test("Should check deep equality of two objects.", () => {
				obj1 = { a: 1, b: { c: 2 } };
				obj2 = { a: 1, b: { c: 2 } };
				result = ObjectUtils.deepEqual(obj1, obj2);
				expect(result).toBeTruthy();
			});
			test("Should return false for objects that are not deeply equal.", () => {
				obj1 = { a: 1, b: { c: 2 } };
				obj2 = { a: 1, b: { c: 3 } };
				result = ObjectUtils.deepEqual(obj1, obj2);
				expect(result).toBeFalsy();
			});
			test("Should return true for deeply equal nested objects.", () => {
				obj1 = { a: { b: 1 }, c: 2 };
				obj2 = { a: { b: 1 }, c: 2 };
				result = ObjectUtils.deepEqual(obj1, obj2);
				expect(result).toBeTruthy();
			});
			test("Should return false for objects with different structures.", () => {
				obj1 = { a: 1, b: 2 };
				obj2 = { a: 1, b: { c: 2 } };
				result = ObjectUtils.deepEqual(obj1, obj2);
				expect(result).toBeFalsy();
			});
		});
	});
	describe("Object Transformation", () => {
		describe("mapProperties", () => {
			let testObject: GenericObject<number>;
			let mappedObject: GenericObject<number>;
			let result: GenericObject<number>;
			test("Should map over an object's properties.", () => {
				testObject = { a: 1, b: 2, c: { d: 3 } };
				mappedObject = { a: 2, b: 4, c: { d: 6 } }
				result = ObjectUtils.mapProperties(testObject, value => {
					if(typeof value === 'number')
					   value *= 2;
				    return value;
				});
				expect(result).toEqual(mappedObject);
			});
			test("Should handle an empty object.", () => {
				testObject = {};
				mappedObject = {};
				result = ObjectUtils.mapProperties(testObject, value => {
					if(typeof value === 'number')
					   value *= 2;
				    return value;
				});
				expect(result).toEqual(mappedObject);
			});
		});
		describe("filterProperties", () => {
			let testObject: GenericObject<number>;
			let filteredObject: GenericObject<number>;
			let result: GenericObject<number>;
			test("Should filter properties of an object based on a predicate.", () => {
				testObject = { a: 1, b: 2, c: { d: 3 } };
				filteredObject = { b: 2 };
				result = ObjectUtils.filterProperties(testObject, value => value > 1);
				expect(result).toEqual(filteredObject);
			});
			/*
			 * TODO: should this behavior exist?
			test("Should filter properties of an object based on a predicate.", () => {
				testObject = { a: 1, b: 2, c: { d: 3 } };
				filteredObject = { d: 3 };
				result = ObjectUtils.filterProperties(testObject, value => value > 2);
				expect(result).toEqual(filteredObject);
			});
		    */
			test("Should return an empty object if no properties match the predicate.", () => {
				testObject = { a: 1, b: 1 };
				filteredObject = {};
				result = ObjectUtils.filterProperties(testObject, value => value > 2);
				expect(result).toEqual(filteredObject);
			});
			test("Should handle an empty object.", () => {
				testObject = {};
				filteredObject = {};
				result = ObjectUtils.filterProperties(testObject, value => value > 1);
				expect(result).toEqual(filteredObject);
			});
		});
		describe("transform", () => {
			let testObject: GenericObject<number>;
			let transformedObject: GenericObject<number>;
			let result: GenericObject<number>;
			test("Should transform an object based on a callback function.", () => {
				testObject = { a: 1, b: 2, c: { d: 3 } };
				transformedObject = { a: 2, b: 3, c: { d: 4 } };
				result = ObjectUtils.transform(testObject, value => value as number + 1);
				expect(result).toEqual(transformedObject);
			});
			test("Should handle an empty object.", () => {
				testObject = {};
				transformedObject = {};
				result = ObjectUtils.transform(testObject, value => value as number + 1);
				expect(result).toEqual(transformedObject);
			});
		});
		describe("flatten", () => {
			let nestedObject: GenericObject<number>;
			let flattenedObject: GenericObject<number>;
			let result: GenericObject<number>;
			test("Should flatten a nested object into a single-level object.", () => {
				nestedObject = { a: 1, b: { c: 2, d: { e: 3 } } };
				flattenedObject = { a: 1, 'b.c': 2, 'b.d.e': 3 };
				result = ObjectUtils.flatten(nestedObject);
				expect(result).toEqual(flattenedObject);
			});
			test("Should handle an empty object.", () => {
				nestedObject = {};
				flattenedObject = {};
				result = ObjectUtils.flatten(nestedObject);
				expect(result).toEqual(flattenedObject);
			});
			test("Should flatten an object with multiple nested levels.", () => {
				nestedObject = { a: { b: { c: 1 } }, d: 2 };
				flattenedObject = { 'a.b.c': 1, d: 2 };
				result = ObjectUtils.flatten(nestedObject);
				expect(result).toEqual(flattenedObject);
			});
			test("Should flatten an object with arrays.", () => {
				nestedObject = { a: [1, 2], b: { c: 3 } };
				flattenedObject = { 'a': [1, 2], 'b.c': 3 };
				result = ObjectUtils.flatten(nestedObject);
				expect(result).toEqual(flattenedObject);
			});
		});
		describe("unflatten", () => {
			let flattenedObject: GenericObject<number>;
			let nestedObject: GenericObject<number>;
			let result: GenericObject<number>;
			test("Should convert a flattened object back into a nested object.", () => {
				flattenedObject = { 'a': 1, 'b.c': 2, 'b.d.e': 3 };
				nestedObject = { a: 1, b: { c: 2, d: { e: 3 } } };
				result = ObjectUtils.unflatten(flattenedObject);
				expect(result).toEqual(nestedObject);
			});
			test("Should handle an empty object.", () => {
				flattenedObject = {};
				nestedObject = {};
				result = ObjectUtils.unflatten(flattenedObject);
				expect(result).toEqual(nestedObject);
			});
			test("Should convert a flattened object with multiple levels back to nested structure.", () => {
				flattenedObject = { 'a.b.c': 1, 'd': 2 };
				nestedObject = { a: { b: { c: 1 } }, d: 2 };
				result = ObjectUtils.unflatten(flattenedObject);
				expect(result).toEqual(nestedObject);
			});
			test("Should handle flattened objects with arrays.", () => {
				flattenedObject = { 'a': [ 1, 2] };
				nestedObject = { a: [1, 2] };
				result = ObjectUtils.unflatten(flattenedObject);
				expect(result).toEqual(nestedObject);
			});
		});
		describe("mapKeys", () => {
			let testObject: GenericObject<number>;
			let mappedKeysObject: GenericObject<number>;
			let result: GenericObject<number>;
			test("Should map the keys of an object to new keys based on a callback function.", () => {
				testObject = { a: 1, b: 2, c: { d: 3 } };
				mappedKeysObject = { A: 1, B: 2, C: { d: 3 } };
				result = ObjectUtils.mapKeys(testObject, key => (key as string).toUpperCase());
				expect(result).toEqual(mappedKeysObject);
			});
			test("Should handle an empty object.", () => {
				testObject = {};
				mappedKeysObject = {};
				result = ObjectUtils.mapKeys({}, key => (key as string).toUpperCase());
				expect(result).toEqual(mappedKeysObject);
			});
			test("Should map keys of an object with nested properties.", () => {
				testObject = { a: 1, b: { c: 2 } };
				mappedKeysObject = { a_new: 1, b_new: { c: 2 } }
				result = ObjectUtils.mapKeys(testObject, (key) => key + '_new');
				expect(result).toEqual(mappedKeysObject);
			});
			test("Should handle keys that are not strings.", () => {
				testObject = { 1: 'one', 2: 'two' };
				mappedKeysObject = { key_1: 'one', key_2: 'two' };
				result = ObjectUtils.mapKeys(testObject, (key) => `key_${key}`);
				expect(result).toEqual(mappedKeysObject);
			});
		});
	});
});
