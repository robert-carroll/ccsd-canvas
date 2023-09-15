/**
// @name        Global Nav - Custom Sub Account Help Links
// @namespace   https://github.com/robert-carroll/ccsd-canvas
//
**/
(function () {
  'use strict';
  const hamb_menu_sel = 'div[role="dialog"][aria-label="Global Navigation"] ul';
  const cheerful_panda = 'img[data-testid="cheerful-panda-svg"]';
  var hamb_help_menu = '';
  const global_help_tray = '#help_tray',
    tag_complete = 'custom-help-link',
    watch_tray_portal = (mtx, observer) => {
      let portal = document.getElementById('nav-tray-portal');
      if (!portal) {
        if (typeof observer === 'undefined') {
          var obs = new MutationObserver(watch_tray_portal);
          obs.observe(document.body, {
            'childList': true
          });
        }
        return;
      }
      if (typeof observer !== 'undefined') {
        observer.disconnect();
      }
      let tray = new MutationObserver(check_tray);
      tray.observe(portal, {
        'childList': true,
        'subtree': true
      });
    },
    check_tray = (mtx, observer) => {
      let tray_is_open = document.querySelector(`#help_tray ${cheerful_panda}`);
      let any_custom_links = document.querySelectorAll(`${global_help_tray} ul li.${tag_complete}`);
      if (tray_is_open && any_custom_links.length == 0) {
        insert_links(global_help_tray);
        // keep observing
        //observer.disconnect();
      }
    },
    watch_burger_tray = function (mtx, observer) {
      let rspv_nav = document.querySelector(hamb_menu_sel);
      if (!rspv_nav) {
        if (typeof observer === 'undefined') {
          var obs = new MutationObserver(watch_burger_tray);
          obs.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
        return;
      }

      if (rspv_nav != null) {
        observer.disconnect();
        wait_for_hamb_helper();
        exit_burger_tray();
      }
    },
    exit_burger_tray = function (mtx, observer) {
      let rspv_nav = document.querySelector(hamb_menu_sel);
      if (rspv_nav != null) {
        if (typeof observer === 'undefined') {
          var obs = new MutationObserver(exit_burger_tray);
          obs.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
        return;
      }
      if (rspv_nav == null) {
        observer.disconnect();
        watch_burger_tray();
      }
    },
    wait_for_hamb_helper = function (mtx, observer) {
      let lost_panda = document.querySelector(cheerful_panda);
      if (!lost_panda) {
        if (typeof observer === 'undefined') {
          var obs = new MutationObserver(wait_for_hamb_helper);
          obs.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
        return;
      }

      if (lost_panda != null) {
        observer.disconnect();
        hamb_help_menu = document.querySelector(`${cheerful_panda}`).parentElement.parentElement.className;
        insert_links(`${hamb_menu_sel} span.${hamb_help_menu}`);
        exit_hamb_helper();
      }
    },
    exit_hamb_helper = function (mtx, observer) {
      let lost_panda = document.querySelector(cheerful_panda);
      if (lost_panda != null) {
        if (typeof observer === 'undefined') {
          var obs = new MutationObserver(exit_hamb_helper);
          obs.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
        return;
      }
      if (lost_panda == null) {
        observer.disconnect();
        wait_for_hamb_helper();
      }
    },
    insert_links = (help_menu) => {
      if (!document.querySelector(help_menu) || typeof linksForGlobalNavCustomHelpTray === 'undefined') return;

      linksForGlobalNavCustomHelpTray.forEach(link => {

        // going to insert the custom link before this one
        // if position isn't set, insert them at the top
        let position = link.position || linksForGlobalNavCustomHelpTray.indexOf(link) - 1;
        let target_li = document.querySelector(`${help_menu} ul li:nth-of-type(${position})`),
          new_help_link_item = document.createElement('li');
        new_help_link_item.innerHTML =
          `<span direction="row" wrap="no-wrap" class="">
            <span class="" style="min-width: 100%; flex-basis: 100%;">
            <a target="${link.target}" rel="noopener" href="${link.href}" role="button" tabindex="0" class="">${link.title}</a>
            <div class="">${link.desc}</div>
            </span><span class=""></span></span>`;
        // copy the class list from its sibling
        new_help_link_item.className = target_li.getAttribute('class');
        // tag the item for the observer
        new_help_link_item.classList.add(tag_complete);
        // insert the new help link
        target_li.before(new_help_link_item);
      });
    };
  watch_tray_portal();
  watch_burger_tray();
})();
// add custom link config below