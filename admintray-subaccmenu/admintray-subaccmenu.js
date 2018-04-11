/**
// @name        Admin Tray - Sub Account Menu
// @namespace   https://github.com//robert-carroll/ccsd-canvas
// @author      Robert Carroll <carror@nv.ccsd.net>
**/
(function() {
    var subacctray = {
        cfg: {
            // this should work for most canvas instances...
            // if not you may have to statically add your root account id
            root: parseInt(ENV.DOMAIN_ROOT_ACCOUNT_ID.toString().split("0000").pop()),
            recursive: true,
            active: true
        },
        // used for search results, result:parent
        // see documentation for more details
        skipd: {},
        // the DOM element we are going to look for, and place the menu after, see append_html() for more
        where: '.tray-with-space-for-global-nav a:contains("All Accounts")',
        /* !!!! should be no need to edit below here, unless you're adventurous */
        depth: 0, // just a global value to track depth during recursion
        stack: [], // the response data from the api, all collected
        tree: [], // the complete recursive tree of the sub account structure
        html: '' // the final parsed HTML menu string that is held in LocalStorage to save API calls
    }
    // converts flat array to recursive tree
    subacctray.list_to_tree = function(data, options) {
        /* got this from https://stackoverflow.com/a/42643996 */
        options = options || {}
        var ID_KEY = options.idKey || 'id',
            PARENT_KEY = options.parentKey || 'parent',
            CHILDREN_KEY = options.childrenKey || 'children',
            item, id, parentId,
            map = {}
        for (var i = 0; i < data.length; i++) { // make cache
            if (data[i][ID_KEY]) {
                map[data[i][ID_KEY]] = data[i]
                data[i][CHILDREN_KEY] = []
            }
        }
        for (var i = 0; i < data.length; i++) {
            if (data[i][PARENT_KEY]) { // is a child
                if (map[data[i][PARENT_KEY]]) { // for dirty data
                    map[data[i][PARENT_KEY]][CHILDREN_KEY].push(data[i]) // add child to parent
                    data.splice(i, 1) // remove from root
                    i-- // iterator correction
                } else {
                    data[i][PARENT_KEY] = 0 // clean dirty data
                }
            }
        }
        return data
    }
    // recursively format nested ul menu
    subacctray.tree_to_html = function(arr, parentid) {
        var html = '<ul' + (subacctray.depth == 0 ? ' id="admin-tray-sam"' : '') + '>'
        subacctray.depth++
            for (var i in arr) {
                html += '<li data-depth="' + subacctray.depth + '">'
                html += (arr[i].children.length ? '<a href="#" class="toggle"></a>' : '')
                html += '<a href="/accounts/' + arr[i].id + '" class="sub-acc">' + arr[i].name + '</a>'
                // if this node has any branches, append a nested sub list of it's sub accounts
                if (arr[i].children.length) {
                    html += this.tree_to_html(arr[i].children, arr[i].parentid)
                }
                html += '</li>'
            }
        html += '</ul>'
        subacctray.depth--
            return html
    }
    subacctray.append_html = function() {

        subacctray.html = localStorage.getItem('adm_tray_sub_acc_menu')

        var appendToTray = $(subacctray.where)
        if (!appendToTray.length) return;
        appendToTray.closest('li').after(
            $('<li/>', {
                'id': 'adm-tray-subacctray',
                // dynamically grab the class set from the closest LI, for continuity and maybe future proof some Canvas updates
                'class': $(subacctray.where).closest('li').attr('class'),
                html: '<hr><input type="text" id="admin-tray-sam-search" placeholder="Search..." /><ol id="admin-tray-sam-results"></ol>' + subacctray.html
            })
        )
        $('ul#admin-tray-sam').delegate('a.toggle', 'click', function() {
            $(this).parent().children('ul').slideToggle(250)
        })
        // collapse the sub lists
        $('ul#admin-tray-sam').find('ul').hide()
        // search
        $('#admin-tray-sam-search').on('input', function() {
            // clear the search results
            $('#admin-tray-sam-results').html('')
            /* got this from https://stackoverflow.com/a/30581042 */
            var text = $.trim($(this).val()),
                filter = '^(?=.*\\b' + text.split(/\s+/).join('\\b)(?=.*\\b') + ').*$',
                reg = RegExp(filter, 'i'),
                results = ''
            if (text.length >= 3) {
                $("a.sub-acc").each(function() {
                    if (reg.test($(this).text())) {
                        var distance,
                            skip_to = '',
                            res_depth = $(this).parent('li').attr('data-depth'),
                            add_parent = ''
                        if (!!subacctray.skipd[res_depth]) {
                            distance = res_depth - subacctray.skipd[res_depth]
                            skip_to = 'li:eq(' + distance + ')'
                            add_parent = $(this).parents(skip_to).children('a.sub-acc').prop('outerHTML') + ' > '
                        }
                        $('#admin-tray-sam-results').append('<li />')
                        $('#admin-tray-sam-results li:last').append(add_parent + $(this).prop('outerHTML'))
                    }
                })
            }
        })
    }
    subacctray.listener = function() {
        $('#global_nav_accounts_link').click(function() {
            var callback = function(mutationsList) {
                if ($(subacctray.where).length == 1 && $("li#adm-tray-subacctray").length == 0 && $.active == 0) {
                    console.log('mutation')
                    subacctray.init()
                }
            }
            var observer = new MutationObserver(callback)
            observer.observe(document.body, {
                childList: true,
                subtree: true
            })
        })
    }
    subacctray.init = function() {
        // if we don't have the sub accounts and menu yet, we need to build and save it
        if (!localStorage.adm_tray_sub_acc_menu) {
            var p = 1,
                pp = 100,
                fetch = $.Deferred();

            function get_sub_accounts(p) {
                $.ajax({
                    method: 'get',
                    dataType: 'json',
                    url: '/api/v1/accounts/' + ENV.DOMAIN_ROOT_ACCOUNT_ID + '/sub_accounts',
                    cache: true,
                    data: {
                        'recursive': 'true',
                        'per_page': pp,
                        'page': p
                    }
                }).done(function(res, status, xhr) {
                    for (var i in res) {
                        // api doesn't seem to be pulling deleted sub accounts... in case that changes, we can skip them
                        //if(subacctray.cfg.active == true && sa[i].workflow_state == 'deleted') continue;
                        subacctray.stack.push({
                            'id': parseInt(res[i].id),
                            'parentid': parseInt(res[i].parent_account_id),
                            'name': res[i].name,
                            'children': null
                        })
                    }
                    // get more until the end
                    // TODO: if the user leaves the page before completion
                    // could cache the stack and continue where we left off, saving api calls
                    if (xhr.getResponseHeader('Link').indexOf('rel="next"') != -1) {
                        get_sub_accounts(p + 1)
                    } else {
                        fetch.resolve();
                    }
                })
            }
            get_sub_accounts(p)

            // once we have all the sub accounts, sort and build the tree
            fetch.then(function() {
                subacctray.stack.sort(function(a, b) {
                    /* got this from http://www.javascriptkit.com/javatutors/arraysort2.shtml */
                    var nameA = a.name.toLowerCase(),
                        nameB = b.name.toLowerCase()
                    if (nameA < nameB)
                        return -1
                    if (nameA > nameB)
                        return 1
                    return 0
                })
                // turn the result stack into a nested array
                subacctray.tree = subacctray.list_to_tree(subacctray.stack, {
                    idKey: 'id',
                    parentKey: 'parentid',
                    childrenKey: 'children'
                })
                // build the html list
                // TODO opt param: type = list/table, depending on global nav tray or /accounts page
                var html = subacctray.tree_to_html(subacctray.tree, subacctray.cfg.root)
                // save html menu to local storage for the user
                subacctray.html = localStorage.setItem('adm_tray_sub_acc_menu', html)
                subacctray.append_html()
            });

            // we already have it in local storage
        } else if (localStorage.adm_tray_sub_acc_menu) {
            subacctray.append_html()
        }
        subacctray.listener()
    }
    subacctray.init()
})()
