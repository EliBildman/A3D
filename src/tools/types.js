export const ENTITY_TYPES = {
    EVENT: 1,
    ACTION: 2,
};

export const INPUT_TYPES = {
    RAW: 0,
    VARIABLE: 1,
    EITHER: 2,
};

export const DATA_TYPES = {
    STRING: 0,
    NUMBER: 1,
    BOOL: 2,
    ENUM: 3,
    ANY: 5,
    LOOKUP: 6,
};

export const LOOKUP_FLAG = '!';

export const OUT_FLAG = 'out_';

export const detectType = (value) => {
    if (value === '') {
        //no input
        return [DATA_TYPES.ANY, ''];
    }
    if (!isNaN(parseFloat(value))) {
        // is number
        return [DATA_TYPES.NUMBER, parseFloat(value)];
    }
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
        // is bool
        return [DATA_TYPES.BOOL, value.toLowerCase() === 'true'];
    }
    // is string, take off quotes if used
    value = value.replace(/^["'](.+(?=["']$))["']$/, '$1');
    return [DATA_TYPES.STRING, value];
};

export const typeList = {
    string: DATA_TYPES.STRING,
    number: DATA_TYPES.NUMBER,
    boolean: DATA_TYPES.BOOL,
};
