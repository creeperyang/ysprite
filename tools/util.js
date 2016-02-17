const format = (time) => time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');

const task = (fn) => async () => {
    const start = new Date();
    console.log(`[${format(start)}] Starting '${fn.name}'...`);
    await fn();
    const end = new Date();
    const time = end.getTime() - start.getTime();
    console.log(`[${format(end)}] Finished '${fn.name}' after ${time}ms`);
};

export { format, task };
