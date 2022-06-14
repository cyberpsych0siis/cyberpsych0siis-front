export function generateLines(dots) {
    const connections = [];
    for (let i = 0; i < dots.length; i++) {
        //const cdot = event.data.dots[i];

        for (let j = i + 1; j < dots.length; j++) {
            /* console.log("connecting " + i + " to " + j); */
            connections.push({
                from: i,
                to: j
            });
        }
    }

    return connections;
}