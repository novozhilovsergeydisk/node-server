const capitalizeFirstLetter = (string) => {
    if (typeof string !== 'string') {
        return '';
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
};

const log = data => console.log(data);

/**
 * Получить список параметром функции.
 * @param fn Функция
 */
const getFunctionParams = fn => {
    const COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm;
    const DEFAULT_PARAMS = /=[^,]+/gm;
    const FAT_ARROW = /=>.*$/gm;
    const ARGUMENT_NAMES = /([^\s,]+)/g;

    const formattedFn = fn
        .toString()
        .replace(COMMENTS, "")
        .replace(FAT_ARROW, "")
        .replace(DEFAULT_PARAMS, "");

    const params = formattedFn
        .slice(formattedFn.indexOf("(") + 1, formattedFn.indexOf(")"))
        .match(ARGUMENT_NAMES);

    return params || [];
};

/**
 * Получить строковое представление тела функции.
 * @param fn Функция
 */
const getFunctionBody = fn => {
    const restoreIndent = body => {
        const lines = body.split("\n");
        const bodyLine = lines.find(line => line.trim() !== "");
        let indent = typeof bodyLine !== "undefined" ? (/[ \t]*/.exec(bodyLine) || [])[0] : "";
        indent = indent || "";

        return lines.map(line => line.replace(indent, "")).join("\n");
    };

    const fnStr = fn.toString();
    const rawBody = fnStr.substring(
        fnStr.indexOf("{") + 1,
        fnStr.lastIndexOf("}")
    );
    const indentedBody = restoreIndent(rawBody);
    const trimmedBody = indentedBody.replace(/^\s+|\s+$/g, "");

    return trimmedBody;
};

module.exports = { capitalizeFirstLetter, log, getFunctionParams, getFunctionParams };