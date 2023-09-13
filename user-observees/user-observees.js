/**
// @name        Show Observers or Observees on the Users profile page, and allow removal
// @namespace   https://github.com/robert-carroll/ccsd-canvas
// @author      Aaron Leonard <leonaa@nv.ccsd.net>
**/
(function () {
  "use strict";

  if (['admin','root_admin'].some(a => ENV.current_user_roles.includes(a))) {
  // if (ccsd.util.hasAnyRole("admin")) {
    var matches;

    var usersName = ENV.CONTEXT_USER_DISPLAY_NAME || "This User";
    
    if(matches = window.location.pathname.match(/\/users\/(\d+)$/)) {
    //if ((matches = ccsd.util.onPage(/\/users\/(\d+)$/))) {
      var user_id = matches[1];

      var loadObservees = function () {
        $.getJSON(`/api/v1/users/${user_id}/observees?include[]=avatar_url`, function (resp, i, len) {
          $("#ccsd-observees-options tbody").empty();

          if (resp.length > 0) {
            $("#ccsd-observees").show(); 
          }
          else { console.log('hide');
            $("#ccsd-observees").hide();
          }

          resp.forEach(function (observee) {
            let accountId = observee.observation_link_root_account_ids[0];
            var id = observee.id.toString();

            var html = `
              <tr>
                <td>
                  <a href="/accounts/${accountId}/users/${observee.id}">
                    <span class="avatar_image">
                      <span class="fs-exclude avatar" style="background-image: url('${observee.avatar_url}')"></span>
                    </span>
                    <span>${observee.name}</span>
                  </a>
                </td>
                <td class="text-right">
                  <a class="remove-observee" href="#" style="float: right;" data-id="${id}">Remove Observee</a>
                </td>
              </tr>
            `;

            $("#ccsd-observees-options tbody").append(html);
          });
        });
      };

      var loadObservers = function () {
        $.getJSON(`/api/v1/users/${user_id}/observers?include[]=avatar_url`, function (resp, i, len) {
          
          $("#ccsd-observers-options tbody").empty();

          if (resp.length > 0) {
            $("#ccsd-observers").show(); 
          }
          else {
            $("#ccsd-observers").hide();
          }

          resp.forEach(function (observee) {
            let accountId = observee.observation_link_root_account_ids[0];
            var id = observee.id.toString();
   
            var html = `
              <tr>
                <td>
                  <a href="/accounts/${accountId}/users/${observee.id}">
                    <span class="avatar_image">
                      <span class="fs-exclude avatar" style="background-image: url('${observee.avatar_url}')"></span>
                    </span>
                    <span>${observee.name}</span>
                  </a>
                </td>
                <td class="text-right">
                  <a class="remove-observer" href="#" style="float: right;" data-id="${id}">Remove Observer</a>
                </td>
              </tr>
            `;

            $("#ccsd-observers-options tbody").append(html);
          });
        });
      };

      $(document).on('click', '.remove-observee', function(e){
        let prompt = "Do you want to remove this observee?";
        if (confirm(prompt)) {
          e.preventDefault();
          var id = $(this).attr('data-id');

          $.ajax({
            url: `/api/v1/users/${user_id}/observees/${id}`,
            type: "DELETE"
          })
          .then(function(){
            loadObservees();
          });
        }
      });

      $(document).on('click', '.remove-observer', function(e){
        let prompt = "Do you want to remove this observer?";
        if (confirm(prompt)) {
          e.preventDefault();
          var id = $(this).attr('data-id');

          $.ajax({
            url: `/api/v1/users/${id}/observees/${user_id}`,
            type: "DELETE"
          })
          .then(function(){
            loadObservers();
          });
        }
      });

      $("#login_information").after(
        `<fieldset id="ccsd-observees" style="display: none"><legend>${usersName} is Observing</legend><table id="ccsd-observees-options" style="width: 100%"><tbody></tbody></table></fieldset>` +
        `<fieldset id="ccsd-observers" style="display: none"><legend>Users who are Observing ${usersName}</legend><table id="ccsd-observers-options" style="width: 100%"><tbody></tbody></table></fieldset>`
      );

      loadObservees();
      loadObservers();
    }
  }
})();
