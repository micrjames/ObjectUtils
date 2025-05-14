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
}
