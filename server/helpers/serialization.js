module.exports = types = {
    object: JSON.stringify,
    string: s => s,
    number: n => n + '',
    undefined: () => { return { status: '404 not found' } },
    function: (fn, par, client) => fn(client, par),
};
