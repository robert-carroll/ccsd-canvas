// ==UserScript==
// @name         Admin Tray - Sub Account Navigation for Canvas, User Script
// @namespace    https://github.com/robert-carroll/ccsd-canvas
// @description  adds searchable/recursive directory tree of canvas sub accounts to the global nav admin tray
// @version      1.1
// @include      https://*.instructure.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const subacctray = {
        cfg: {
            recursive: true, // https://canvas.instructure.com/doc/api/accounts.html#method.accounts.sub_accounts
            //active: true, // collect only active sub accounts, useless...
            // api doesn't seem to be pulling deleted sub accounts... in case that changes, we can skip them
        },
        /* !!!! should be no need to edit below here, unless you're adventurous */
        // the DOM element we are going to look for, see subacctray.append()
        where: '.tray-with-space-for-global-nav',
        root: null, // the root account id of your canvas instance, shouldn't need to set this anymore
        instance: location.host+'_subacc_tray', // instance specific localStorage key
        depth: 0, // to track depth during recursion
        stack: [], // the response data from the api, all collected
        tree: [], // the complete recursive tree of the sub account structure
        html: '', // the final parsed HTML menu string that is held in LocalStorage to save API calls
        skipd: {}, // skip depth for search, { result:parent }, ex. { 3:2, 5:3 }
        // by default, if the user navigates away from the page, interrupting progress via pagination
        // we'll cache the stack and continue where we left off when the page loads, saving api calls
        stash : function(page = null, stack = null) {
            if(page != null && stack != null) {
                localStorage.setItem(`${subacctray.instance}.page`, page);
                localStorage.setItem(`${subacctray.instance}.stack`, JSON.stringify(stack));
            }
            page = parseInt(localStorage.getItem(`${subacctray.instance}.page`));
            stack = JSON.parse(localStorage.getItem(`${subacctray.instance}.stack`));
            if($('li#adm-tray-subacctray .rc-progress')) {
                $('li#adm-tray-subacctray .rc-progress').text(page);
            }
            return {
                'page' : page != null ? page : 1,
                'stack' : stack != null ? stack : []
            };
        }
    };
    // converts flat array to recursive tree
    subacctray.list_to_tree = (data, options) => {
        /* got this from https://stackoverflow.com/a/42643996 */
        options = options || {};
        var ID_KEY = options.idKey || 'id',
            PARENT_KEY = options.parentKey || 'parent',
            CHILDREN_KEY = options.childrenKey || 'children',
            map = {};
        for (let i = 0; i < data.length; i++) { // make cache
            if (data[i][ID_KEY]) {
                map[data[i][ID_KEY]] = data[i];
                data[i][CHILDREN_KEY] = [];
            }
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i][PARENT_KEY]) { // is a child
                if (map[data[i][PARENT_KEY]]) { // for dirty data
                    map[data[i][PARENT_KEY]][CHILDREN_KEY].push(data[i]); // add child to parent
                    data.splice(i, 1); // remove from root
                    i--; // iterator correction
                } else {
                    data[i][PARENT_KEY] = 0; // clean dirty data
                }
            }
        }
        return data;
    };
    // recursively format nested ul menu
    subacctray.tree_to_html = function(arr) {
        var html = '<ul' + (subacctray.depth == 0 ? ' id="admin-tray-sam"' : '') + '>';
        subacctray.depth++;
        for (let i in arr) {
            html += '<li data-depth="' + subacctray.depth + '">';
            html += (arr[i].children.length ? '<a href="#" class="toggle"></a>' : '');
            html += '<a href="/accounts/' + arr[i].id + '" class="sub-acc">' + arr[i].name + '</a>';
            // if this node has any branches, append a nested sub list of it's sub accounts
            if (arr[i].children.length) {
                html += this.tree_to_html(arr[i].children, arr[i].parentid);
            }
            html += '</li>';
        }
        html += '</ul>';
        subacctray.depth--;
        return html;
    };
    subacctray.append = (html) => {
        if(!document.querySelector(`${subacctray.where} a[href="/accounts"]`)) return;
        // start fresh
        let already = document.getElementById('adm-tray-subacctray');
        if(already) { already.remove(); }
        let tray_last_li = document.querySelector(`${subacctray.where} ul li:last-child`);
        // create a new element
        let subacctray_li = document.createElement('li');
        subacctray_li.id = 'adm-tray-subacctray';
        // dynamically grab the class set from the closest LI
        // for continuity and maybe future proof some Canvas updates
        subacctray_li.className = tray_last_li.getAttribute('class');
        // append html to tray
        tray_last_li.parentNode
            .insertBefore(subacctray_li, tray_last_li.nextSibling)
            .insertAdjacentHTML('beforeend', html);
    };
    subacctray.menu = () => {
        // get menu html from local storage
        subacctray.html = localStorage.getItem(subacctray.instance);
        if(subacctray.html == null) return;
        // tray menu
        let menu = `<hr><input type="text" id="admin-tray-sam-search" placeholder="Search..." />
            <ol id="admin-tray-sam-results"></ol>${subacctray.html}<a href="#" class="reload"></span>`;
        subacctray.append(menu);

        $('ul#admin-tray-sam').delegate('a.toggle', 'click', function() {
            $(this).parent().children('ul').slideToggle(250);
        });
        // collapse the sub lists
        $('ul#admin-tray-sam').find('ul').hide();
        // search
        $('#admin-tray-sam-search').on('input', function() {
            // clear the search results
            $('#admin-tray-sam-results').html('');
            /* got this from https://stackoverflow.com/a/30581042 */
            let query = $.trim($(this).val()),
                filter = '^(?=.*\\b' + query.split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
                reg = RegExp(filter, 'i');
            if (query.length >= 3) {
                $('a.sub-acc').each(function() {
                    if (reg.test($(this).text())) {
                        let distance, skip_to = '',
                            res_depth = $(this).parent('li').attr('data-depth'),
                            add_parent = '';
                        if (subacctray.skipd[res_depth]) {
                            distance = res_depth - subacctray.skipd[res_depth];
                            skip_to = 'li:eq(' + distance + ')';
                            add_parent = $(this).parents(skip_to).children('a.sub-acc').prop('outerHTML') + ' > ';
                        }
                        $('#admin-tray-sam-results').append('<li />');
                        $('#admin-tray-sam-results li:last').append(add_parent + $(this).prop('outerHTML'));
                    }
                });
            }
        });
        // reload
        $('#adm-tray-subacctray a.reload').on('click', function() {
            let prompt = "This will clear and reload the menu...\n...updating with any recent changes.\nDo you want to continue?";
            if (confirm(prompt)) {
                localStorage.removeItem(subacctray.instance);
                subacctray.depth = 0;
                subacctray.stack = [];
                subacctray.tree = [];
                subacctray.html = '';
                $('li#adm-tray-subacctray').fadeOut('slow', subacctray.init);
                subacctray.append('<span class="rc-progress">0</span><div class="loader"></div>');
            }
        });
    };
    subacctray.jj_checkPortal = function(mtx, observer)  {
        let portal = document.getElementById('nav-tray-portal');
        if (!portal) {
            if (typeof observer === 'undefined') {
                var obs = new MutationObserver(subacctray.jj_checkPortal);
                obs.observe(document.body, { 'childList': true });
            }
            return;
        }
        if (typeof observer !== 'undefined') {
            observer.disconnect();
        }
        let tray = new MutationObserver(subacctray.jj_watchTray);
        tray.observe(portal, { 'childList': true, 'subtree': true });
    };
    subacctray.jj_watchTray = function() {
        let tray_is_open = document.querySelector('#nav-tray-portal a[href="/accounts"]');
        let is_tapped = document.getElementById('adm-tray-subacctray');
        if (tray_is_open && subacctray.html != null && !is_tapped) {
            subacctray.menu();
        }
        if(tray_is_open && subacctray.html == null && !is_tapped) {
            let page = parseInt(localStorage.getItem(`${subacctray.instance}.page`));
            subacctray.append(`<span class="rc-progress">${page}</span><div class="loader"></div>`);
        }
    };
    subacctray.init = () => {
        // if we don't have the sub accounts and menu yet, we need to build and save it
        if (!localStorage.getItem(subacctray.instance)) {
            // check for stash
            let stash = subacctray.stash();
            subacctray.stack = stash.stack.length >= 1 ? stash.stack : subacctray.stack;

            var p = stash.page > 1 ? stash.page + 1 : 1,
                pp = 100,
                fetch = $.Deferred();

            let get_sub_accounts = (p) => {
                $.ajax({
                    headers: {
                        accepts: 'application/json+canvas-string-ids'
                    },
                    method: 'get',
                    dataType: 'json',
                    url: '/api/v1/accounts/self/sub_accounts',
                    cache: false,
                    data: {
                        'recursive': subacctray.cfg.recursive,
                        'per_page': pp,
                        'page': p
                    }
                }).done(function(res, s, xhr) {
                    for (let i in res) {
                        // if(subacctray.cfg.active == true && sa[i].workflow_state == 'deleted') continue;
                        subacctray.stack.push({
                            'id': res[i].id,
                            'parentid': res[i].parent_account_id,
                            'name': res[i].name,
                            'children': null
                        });
                        // get instance root account id from the first response, set it and continue
                        if(!subacctray.root && res[i].root_account_id)
                            subacctray.root = res[i].root_account_id;
                    }
                    // get more until the end
                    if (xhr.getResponseHeader('Link').indexOf('rel="next"') != -1) {
                        subacctray.stash(p, subacctray.stack);
                        get_sub_accounts(p+1);
                    } else {
                        fetch.resolve();
                    }
                });
            };
            get_sub_accounts(p);
            // once we have all the sub accounts, sort and build the tree
            fetch.then(function() {
                subacctray.stash(0,{});
                subacctray.stack.sort(function(a, b) {
                    /* got this from http://www.javascriptkit.com/javatutors/arraysort2.shtml */
                    let nameA = a.name.toLowerCase(),
                        nameB = b.name.toLowerCase();
                    if (nameA < nameB)
                        return -1;
                    if (nameA > nameB)
                        return 1;
                    return 0;
                });
                // turn the result stack into a nested array
                subacctray.tree = subacctray.list_to_tree(subacctray.stack, {
                    idKey: 'id',
                    parentKey: 'parentid',
                    childrenKey: 'children'
                });
                // build the html list
                // TODO opt param: type = list/table, depending on global nav tray or /accounts page
                var html = subacctray.tree_to_html(subacctray.tree, subacctray.root);
                // save html menu to local storage for the user
                subacctray.html = localStorage.setItem(subacctray.instance, html);
                subacctray.menu();
            });
        // we already have it in local storage
        } else if (localStorage.getItem(subacctray.instance)) {
            subacctray.menu();
        }
        // check for mutations on the nav-tray-portal
        subacctray.jj_checkPortal();
    };
    // for user script
    function userCSS() {
        let styles = {
            'ul#admin-tray-sam, ul#admin-tray-sam ul' : 'margin: 0; padding: 0; list-style: none;',
            'ul#admin-tray-sam ul' : 'margin-left: 5px; border-left: 1px dotted #ccc; padding-left: 5px;',
            'ul#admin-tray-sam a.toggle::after' : 'float: right; content: "⬘";',
            'input#admin-tray-sam-search' : 'width: 95%;',
            'ol#admin-tray-sam-results' : 'border-bottom: 2px solid #ccc; margin: 0; padding-left: 18px;',
            'li#adm-tray-subacctray a.reload::after' : 'float: right; content: "↻";',
            'li#adm-tray-subacctray .rc-progress' : 'position: absolute; margin: -4px 0px 0px 45px; color: #333; font-size: 85%',
            'li#adm-tray-subacctray .loader' : `border: 8px solid #eee; border-top: 8px solid #ccc; border-radius: 50%;
                width: 30px; height: 30px; animation: adm-tray-subacctray-load 2s linear infinite;`,
            '@keyframes adm-tray-subacctray-load' : '0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }',
            //'#nav-tray-portal > span > span' : 'width: 415px;'
        };
        if (typeof styles !== 'undefined' && Object.keys(styles).length > 0) {
            let style = document.createElement('style');
            style.setAttribute('data-adm-subacctray-css', 'here');
            document.head.appendChild(style);
            let sheet = style.sheet;
            Object.keys(styles).forEach(function(key) {
                sheet.insertRule(`${key} { ${styles[key]} }`, sheet.cssRules.length);
            });
        }
    }
    userCSS();
    subacctray.init();
})();