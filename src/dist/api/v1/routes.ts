import { readdirSync, statSync } from 'fs';

const getRoutes = () => {
    let routes = [];
    const items = readdirSync(__dirname);

    try {
        items.forEach(async dir => {
            const stats = statSync(__dirname + '/' + dir);
            if (stats.isDirectory()) {
                readdirSync(__dirname + '/' + dir)
                    .forEach(file => {
                        if (file.match(/^\w+\.controller\.ts$/)) {
                            const fileNoExt = file.split('.').slice(0, -1).join('.');
                            const required = require(`${__dirname}/${dir}/${fileNoExt}`);
                            console.log(`${__dirname}/${dir}/${fileNoExt}`, required);
                            routes = routes.concat(required.default);
                        } else {
                            console.log('###This file is not a controller', `\'${file}\'`);
                        }

                    })
            } else {
                console.log("No directory:", dir)
            }
            // console.log('##stat *if', routes);
        });

        return routes;
    } catch (err) {
        console.log(err);

    }
}

console.log(getRoutes())

export { getRoutes };
