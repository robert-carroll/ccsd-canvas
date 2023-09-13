/**
// @name        Hides PII columns on the course users page (roster), provides a toggle button
// @namespace   https://github.com/robert-carroll/ccsd-canvas
// @author      Aaron Leonard <leonaa@nv.ccsd.net>
**/

(function () {
  "use strict";

  if (/\/courses\/\d+\/users/.test(window.location.pathname)) {
    var observer = new MutationObserver(function () {
      $("#addUsers").after(
        '<div class="text-right clear" style="padding-top: 0.25em"><button id="showAllRosterData" class="btn btn-primary btn-small pull-right">Toggle All Roster Data</button></div>'
      );

      $(document).on("click", "#showAllRosterData", function (e) {
        e.preventDefault();

        $(".roster").toggleClass("show-all");
      });

      observer.disconnect();
    });

    observer.observe(document.getElementById("content"), {
      childList: true,
      subtree: true
    });

    var filterColumns = [
      'SIS ID',
      'Login ID',
      'Total Activity'
    ];

    var tableObserver = new MutationObserver(function () {
      if ($('.roster').length == 0) {
        return;
      }

      tableObserver.disconnect();

      var styleEl = document.createElement('style');
      document.head.appendChild(styleEl);
      var styleSheet = styleEl.sheet;

      var headerRow = $('.roster > thead tr');
      var children = headerRow.children();
      var cols = $();

      filterColumns.forEach(function (header) {
        var hideColumn = children.filter(":contains('" + header + "')");
        if (hideColumn.length) {
          cols = cols.add(hideColumn);
        }
      });

      cols.each(function (i) {
        var index = children.index(this);
        styleSheet.insertRule(".roster:not(.show-all) tr > *:nth-child(" + (index + 1) + ") { display: none; }", 0);
      });
    });

    tableObserver.observe(document.getElementById("content"), {
      childList: true,
      subtree: true
    });

  }
})();