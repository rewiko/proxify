module.exports = async function() {
    global.__SERVER__.gracefulShutdown(0);
};
