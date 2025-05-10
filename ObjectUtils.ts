export class ObjectUtils {
    // Method to remove a property from an object
    static removeProperty<T extends object, K extends keyof T>(obj: T, property: K): Omit<T, K> {
        const { [property]: _, ...rest } = obj;
        return rest;
    }
}
