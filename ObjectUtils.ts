import { Entry } from "./defns";

export class ObjectUtils {
	// Object Manipulation
    // Method to remove a property from an object
    static removeProperty<T extends object, K extends keyof T>(obj: T, property: K): Omit<T, K> {
        const { [property]: _, ...rest } = obj;
        return rest;
    }
    // Method to check if an object has a specific property
    static hasProperty<T extends object, K extends keyof T>(obj: T, property: K): boolean {
        return property in obj;
    }
    // Method to get a property value with a default fallback
    static getProperty<T extends object, K extends keyof T>(obj: T, property: K, defaultValue: T[K]): T[K] {
        return obj[property] !== undefined ? obj[property] : defaultValue;
    }
    // Method to pick specific properties from an object
    static pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
        return keys.reduce((acc, key) => {
            if (key in obj) {
                acc[key] = obj[key];
            }
            return acc;
        }, {} as Pick<T, K>);
    }
    // Method to omit specific properties from an object
    static omit<T extends object, K extends keyof T>(obj: T, properties: K[]): Omit<T, K> {
        const result = { ...obj };
        for (const property of properties) {
            delete result[property];
        }
        return result;
    }

	// Object Merging
    // Method to merge two objects
    static merge<T extends object, U extends object>(target: T, source: U): T & U {
        return { ...target, ...source };
    }
    // Method to deep merge two objects
    static mergeDeep<T extends object, U extends object>(target: T, source: U): T & U {
		// Create a new object that starts as a shallow copy of the target
		// const output = { ...target } as { [K in keyof T | keyof U]: K extends keyof U ? U[K] : K extends keyof T ? T[K] : never };
		const output = { ...target } as T & U;

		// Create a new object that starts as a shallow copy of the target
		for(const key in source) {
			if(source.hasOwnProperty(key)) {
			// Check if the current property in source is an object
				if (source[key] instanceof Object && !Array.isArray(source[key])) {
					// Check if the corresponding property in target is also an object
					if (key in target && target[key as unknown as keyof T] instanceof Object && !Array.isArray(target[key as unknown as keyof T])) {
						output[key] = this.mergeDeep(target[key as unknown as keyof T] as Record<string, any>, source[key] as Record<string, any>) as any;
					} else {
						// If target[key] is not an object, just assign source[key]
						output[key] = source[key] as any;
					}
				} else {
					// Directly assign the value from source to output
					output[key] = source[key] as any;
				}
			}
		}

		// Return the merged object
		return output;
    }
    // Method to merge two objects with a custom merge function
    static mergeWith<T extends object, U extends object>(
	    target: T,
        source: U,
        customMerge: (targetValue: any, sourceValue: any) => any
    ): T & U {
		const output = { ...target } as T & U;
		for (const key in source) {
            if (key in target) {
				output[key] = customMerge(target[key as unknown as keyof T] as Record<string, any>, source[key] as Record<string, any>) as any;
            } else {
                output[key] = source[key] as any;
            }
        }
		return output;
	}

	// Object Cloning
	static deepClone<T>(obj: T, hash = new WeakMap()): T {
		// Check for null or undefined
		if (obj === null || obj === undefined) {
			return obj;
		}
		// Handle primitive types (string, number, boolean, etc.)
		if (typeof obj !== 'object') {
			return obj;
		}

		// Handle circular references
		if (hash.has(obj as unknown as object)) {
			return hash.get(obj as unknown as object);
		}

		// Handle Date objects
		if (obj instanceof Date) {
			return new Date(obj.getTime()) as unknown as T;
		}

		// Handle Array
		if (Array.isArray(obj)) {
			const clone: any[] = [];
			hash.set(obj, clone);
			for (let item of obj) {
				clone.push(this.deepClone(item, hash));
			}
			return clone as unknown as T;
		}

		// Handle functions
		if (typeof obj === 'function') {
			const clonedFunction = function (...args: any[]) {
				return obj.apply(this, args);
			};
			// Copy properties from the original function to the cloned function
			Object.setPrototypeOf(clonedFunction, Object.getPrototypeOf(obj));
			Object.assign(clonedFunction, obj); // Copy properties of the original function
			return clonedFunction as unknown as T;
		}
		
		const clone = Object.create(Object.getPrototypeOf(obj));
		hash.set(obj as unknown as object, clone);

		// Recursively clone properties
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				clone[key] = this.deepClone(obj[key], hash);
			}
		}

		return clone;
	}

    // Object Freezing
    // Method to deeply freeze an object to prevent modifications
    static deepFreeze<T>(obj: T): T {
		Object.freeze(obj);
        for (const key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
                this.deepFreeze(obj[key]);
            }
        }
		return obj;
	}

	// Object Inspection
	// Method to check if an object is empty
    static isEmpty<T extends object>(obj: T): boolean {
        return Object.keys(obj).length === 0;
    }
	// Method to get the keys of an object
    static keys<T extends object>(obj: T): (keyof T)[] {
        return Object.keys(obj) as (keyof T)[];
    }

    // Method to get the values of an object
    static values<T extends object>(obj: T): T[keyof T][] {
        return Object.values(obj);
    }
	// Method to get the entries of an object
    static entries<T extends object>(obj: T): Entry<T>[] {
        return Object.entries(obj) as [keyof T, T[keyof T]][];
    }
	// Method to check deep equality of two objects
    static deepEqual<T>(obj1: T, obj2: T): boolean {
		return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
    // Method to check deep equality of two objects
    static isEqual<T>(obj1: T, obj2: T): boolean {
		if (obj1 === obj2) return true;
		if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) return false;

		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);
		if (keys1.length !== keys2.length) return false;

		for (const key of keys1) {
			if (!keys2.includes(key) || !this.isEqual(obj1[key], obj2[key])) {
				return false;
			}
		}
		return true;
	}

	// Object Transformation
    // Method to map over an object's properties
    static mapProperties<T extends object, U>(obj: T, callback: (value: T[keyof T], key: keyof T) => U): { [K in keyof T]: U } {
        const result: Partial<{ [K in keyof T]: U }> = {};

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // result[key] = callback(obj[key], key);
				const value = obj[key];
				if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
					// Recursively map properties of the nested object
					result[key] = ObjectUtils.mapProperties(value as unknown as T, callback) as unknown as U;
				} else {
					result[key] = callback(value, key);
				}
            }
        }

        return result as { [K in keyof T]: U };
    }
    // Method to filter properties of an object based on a predicate
    static filterProperties<T extends object>(obj: T, predicate: (value: T[keyof T], key: keyof T) => boolean): Partial<T> {
        const result: Partial<T> = {};
		// Method to filter properties of an object based on a predicate
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && predicate(obj[key], key)) {
                result[key] = obj[key];
            }
        }
        return result;
    }
    // Method to transform an object based on a callback function
    static transform<T extends object, U>(obj: T, callback: (value: T[keyof T], key: keyof T) => U): { [K in keyof T]: U } {
        const result: Partial<{ [K in keyof T]: U }> = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
				const value = obj[key];
				if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
					// Recursively map properties of the nested object
					result[key] = ObjectUtils.mapProperties(value as unknown as T, callback) as unknown as U;
				} else {
					result[key] = callback(value, key);
				}
            }
        }
        return result as { [K in keyof T]: U };
    }
    // Method to flatten a nested object into a single-level object with dot-separated keys
    static flatten<T extends object>(obj: T, prefix = '', result: Partial<Record<string, any>> = {}): Record<string, any> {
		for (const key in obj) {
            const propName = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                this.flatten(obj[key] as unknown as T, propName, result);
            } else {
                result[propName] = obj[key];
            }
        }
        return result;
    }
    // Method to convert a flattened object back into a nested object
    static unflatten<T extends object>(obj: Record<string, any>): T {
        const result: any = {};
		for (const key in obj) {
            const keys = key.split('.');
            keys.reduce((acc, part, index) => {
                if (index === keys.length - 1) {
                    acc[part] = obj[key];
                } else {
                    acc[part] = acc[part] || {};
                }
                return acc[part];
            }, result);
        }
        return result;
    }
    // Method to map the keys of an object to new keys based on a callback function
    static mapKeys<T extends object, K extends string>(
        obj: T,
        callback: (key: keyof T) => K
    ): { [key in K]: T[keyof T] } {
		const result: Partial<{ [key in K]: T[keyof T] }> = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = callback(key as keyof T);
                result[newKey] = obj[key];
            }
        }
        return result as { [key in K]: T[keyof T] };
    }
}
