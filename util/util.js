var ccsd = {
    util: {}
}

// https://gist.github.com/ryanflorence/5817898
ccsd.util.onPage = function(rex, fn, fnfail) {
    'use strict';

    var match = location.pathname.match(rex);

    if (typeof fn !== 'undefined' && match) {
        return fn();
    }
    if (typeof fnfail !== 'undefined' && !match) {
        return fnfail();
    }
    return match ? match : false;
}

ccsd.util.hasAnyRole = function() {
    'use strict';

    var roles = Array.prototype.slice.call(arguments, 0),
        i;
    // so it doesn't generate an error on login page
    if (typeof ENV.current_user_roles === 'undefined' || !ENV.current_user_roles) {
        return false;
    }
    for (i = 0; i < roles.length; i++) {
        if (ENV.current_user_roles.indexOf(roles[i]) !== -1)
            return true;
    }
    return false;
}