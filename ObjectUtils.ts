export class ObjectUtils {
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
}
