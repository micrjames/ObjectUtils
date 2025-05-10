import { ObjectUtils } from '../ObjectUtils';
import { GenericObject } from './test.defns';

describe('ObjectUtils', () => {
	let testObject: GenericObject<number>;
	beforeEach(() => {
		testObject = { a: 1, b: 2, c: { d: 3 } };
	});
	test('removeProperty should remove a property from an object', () => {
        const result = ObjectUtils.removeProperty(testObject, 'b');
        expect(result).toEqual({ a: 1, c: { d: 3 } });
    });
});
