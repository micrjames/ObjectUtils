type GenericObject<T> = {
    [key: string]: GenericObject<T> | T | T[] | string;
};

export { GenericObject };
