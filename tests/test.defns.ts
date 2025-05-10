type GenericObject<T> = {
    [key: string]: T | GenericObject<T>;
};

export { GenericObject };
