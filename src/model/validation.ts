export interface IValidatable {
    validate(): void
}

export interface INestedValidatable {
    validate(prefix: string): void
}

function isSet<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

function required<TValue>(name: string, value: TValue | null | undefined): value is TValue {
    if (!isSet(value)) throw new Error(`Field ${name} must be set`);
    return true;
}

function valid(name: string, value: INestedValidatable | null | undefined, nullable = true) {
    if (!nullable) required(name, value);
    if (isSet(value)) {
        value.validate(name);
    }
}

function positiveInteger(name: string, value: number | null | undefined, nullable = true) {
    if (!nullable) required(name, value);
    if (isSet(value)) {
        if (value <= 0) throw new Error(`Field ${name} must be greater than 0`);
    }
}

function positiveNumber(name: string, value: number | null | undefined, nullable = true) {
    if (!nullable) required(name, value);
    if (isSet(value)) {
        if (value <= 0) throw new Error(`Field ${name} must be greater than 0`);
    }
}

function nonEmptyStr(name: string, value: string | null | undefined, nullable = true) {
    if (!nullable) required(name, value);
    if (isSet(value)) {
        if (value.length <= 0) throw new Error(`Field ${name} may not be an empty string`);
    }
}

function nonEmptyStrMap(name: string, value: { [key: string]: string } | null | undefined, nullable = true) {
    if (!nullable) required(name, value);
    if (isSet(value)) {
        Object.entries(value).forEach(([k, v]) => nonEmptyStr(`${name}.${k}`, v, false));
    }
}

function nonEmptyList(name: string, value: string[] | null | undefined, nullable = true) {
    if (!nullable) required(name, value);
    if (isSet(value)) {
        if(value.length <= 0) throw new Error(`Field ${name} may not be an empty list`);
        value.forEach((x, i) => nonEmptyStr(`${name}.${i}`, x, false));
    }
}

function nonEmptyListMap(name: string, value: { [key: string]: string[] } | null | undefined, nullable = true) {
    if (!nullable) required(name, value);
    if (isSet(value)) {
        Object.entries(value).forEach(([k, v]) => nonEmptyList(`${name}.${k}`, v, false));
    }
}

export const validators = {
    required,
    valid,
    positiveInteger,
    positiveNumber,
    nonEmptyStr,
    nonEmptyStrMap,
    nonEmptyList,
    nonEmptyListMap,
};

/**
 * Use this function on backwards compatible constructors that used to be
 * called without arguments.  `value` should be the value of the last mandatory
 * parameter.
 */
export function maybeShowDeprecationWarning<TValue>(
    typeName: string,
    value: TValue | null | undefined
) {
    if (!isSet(value))
        console.log(new Date(), '[amberflo-metering]', 'WARN', `Using empty constructor of ${typeName} is deprecated`);
}
