/**
// @name        Course Pages Update 'Add People' Modal
// @namespace   https://github.com/robert-carroll/ccsd-canvas
// @author      Bruce A. Smith <smithb7@nv.ccsd.net>
**/

(function() {
    'use strict';

    //ccsd.util.onPage(/^\/courses\/\d+\/users/, function() {

    // use this -if- you don't want to include onPage
    if(/^\/courses\/\d+\/users/.test(window.location.pathname)) {

        var pplModal = {
            cfg: {
                // Id of the button that triggers the mutation observer
                triggerId: 'addUsers',
                // The id that will be searched for to confirm that the mutation we are looking for has occured
                mutationId: 'add_people_modal',
                // Id of the new message added to the people modal
                newId: 'custom-addPeople-Notice',
                // Class of the new message
                newClass: 'alert alert-warning',
                // The message
                newText: "Please keep in mind, K-12 students should only be enrolled with the <b>Student</b> role.",
                // Class of the element that the message will be inserted before.
                elemClass: 'peoplesearch__selections',
            }
        }
        pplModal.getByClass = function(targetClass) {
            var elems=document.getElementsByTagName('*'), i;
            for (i in elems) {
                if (elems[i].className === targetClass) {
                    return elems[i];
                }
            }
        }
        pplModal.addAlert = function() {
            var neededElem = pplModal.getByClass(pplModal.cfg.elemClass);
            var newNode = document.createElement("div");
            newNode.id = pplModal.cfg.newId;
            newNode.className = pplModal.cfg.newClass;
            newNode.innerHTML = pplModal.cfg.newText;
            neededElem.parentNode.insertBefore(newNode, neededElem);
        }
        pplModal.startObserver = function() {
            var detectedModal = false;
            var mcb = function(mutationsList) {
                var mutationHTML = '';
                for(var mutation of mutationsList) {
                    mutationHTML = mutation.target.innerHTML;
                    if((mutationHTML).indexOf(pplModal.cfg.mutationId) > 1 ) {
                        detectedModal = true;
                        pplModal.addAlert();
                        break;
                    }
                }
                if (detectedModal === true) { observer.disconnect(); }
            };
        
            var observer = new MutationObserver(mcb);
            observer.observe(document.body, { attributes: true, childList: true, subtree: true });
        }
        document.getElementById(pplModal.cfg.triggerId).onclick = pplModal.startObserver;
    }//);
})();