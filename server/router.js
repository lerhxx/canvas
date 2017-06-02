function route(pathname, handle, res) {
    if(pathname === '/') {
        handle['index'](pathname, res);
    }else {
        handle['else'](pathname, res);
    }
    // if(typeof handle[pathname] === 'function') {
    //     handle[pathname](res);
    // }else {
    //     handle.notFound(res);
    // }
}

exports.route = route;