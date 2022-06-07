addEventListener('message', event => {
    // switch (event.data.action) {
        // case "processConnections":
            const connections = [];
            for (let i = 0; i < event.data.dots.length; i++) {
                const cdot = event.data.dots[i];
            
                for (let j = i + 1; j < event.data.dots.length; j++) {
                    /* console.log("connecting " + i + " to " + j); */
                    connections.push({
                        from: i,
                        to: j
                    });
                }
            }

            postMessage(
                {
                    dots: event.data.dots,
                    conn: connections
                });
            // break;
    // }
});