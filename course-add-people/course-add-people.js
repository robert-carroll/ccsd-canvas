/**
// @name        Course Pages Update 'Add People' Modal
// @namespace   https://github.com/robert-carroll/ccsd-canvas
// @author      Bruce A. Smith <smithb7@nv.ccsd.net>
**/

// on the course/users page
// add alert to the course +people modal
(function() {
    'use strict';

    //ccsd.util.onPage(/^\/courses\/\d+\/users/, function() {

    // use this -if- you don't want to include onPage
	if(/^\/courses\/\d+\/users/.test(window.location.pathname)) {

        var addAlert = function() {
            var neededElem = document.getElementsByClassName('peoplesearch__selections')[0];
            var newNode = document.createElement("div");
            newNode.id = 'custom-addPeople-Notice';
            newNode.className = 'alert alert-warning';
            newNode.textContent = 'Please keep in mind, K-12 students should only be enrolled with the <b>Student</b> role.';
            neededElem.parentNode.insertBefore(newNode, neededElem);
        }

        var startObserver = function() {
            var mcb = function() {
                var findModal = document.getElementById('add_people_modal');
                if(findModal) {
                    addAlert();
                    observer.disconnect();
                }
            };
        
            var observer = new MutationObserver(mcb);
            observer.observe(document.body, { attributes: true, childList: true, subtree: true });
        }
        document.getElementById('addUsers').onclick = startObserver;
    }//);
})();
