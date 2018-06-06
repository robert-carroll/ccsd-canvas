if (ccsd.util.hasAnyRole('admin','root_admin')) {
  // used for search results, result:parent, see documentation for more details
  var show_results_parent = {}
  // async load the sub account menu script
  $.ajax({
    url: 'https://host-on-some.cdn/js/admintray-subaccmenu.min.js',
    dataType: 'script',
    cache: true,
    data: {skipd: JSON.stringify(show_results_parent)}
  })
}
