if (ccsd.util.hasAnyRole("admin","root_admin")) {
  $.ajax({
    url:
      "/js/admintray-subaccmenu.js",
    dataType: "script",
    cache: true
  });
}