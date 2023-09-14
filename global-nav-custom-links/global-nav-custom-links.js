/**
// @name        Global Nav - Custom Links
// @namespace   https://github.com/robert-carroll/ccsd-canvas
//
**/
(function () {
  'use strict';

  // configure links
  const links = [{
      title: 'Instructure Icon',
      icon_svg: 'icon-pin',
      href: 'https://community.canvaslms.com/',
      target: '_blank'
    },
    {
      title: 'External Icon',
      // example only, host your own, or use icon class
      icon_svg: 'https://raw.githubusercontent.com/instructure/instructure-ui/master/packages/ui-icons/svg/Line/pin.svg',
      href: 'https://community.canvaslms.com/',
      target: '_blank'
    },
    {
      title: 'Inline Icon',
      // example, instructure-ui pin.svg from above
      icon_svg: `<svg viewBox="0 0 1920 1920" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1643.272 835.697c-22.024 22.023-57.826 22.023-79.85 0l-20.442-20.442c-.226-.226-.226-.452-.452-.678-.226-.113-.452-.113-.565-.339L1072.806 345.08c-.226-.225-.34-.564-.565-.79-.226-.226-.565-.339-.79-.452l-20.33-20.33c-22.024-22.023-22.024-57.938 0-79.962l83.915-83.802 592.15 592.038-83.914 83.915zm-506.768 305.167c-7.34-8.584-13.44-18.07-21.571-26.09L771.93 771.773c-8.018-8.132-17.506-13.892-26.09-21.12l286.42-286.419 390.437 390.438-286.193 286.193zm-101.42 453.007l-16.49 16.49-742.362-742.25 16.489-16.49c106.73-106.842 292.743-106.842 399.36 0l343.002 343.003c53.309 53.308 82.673 124.235 82.673 199.567 0 75.445-29.364 146.372-82.673 199.68zM1135.035.045L971.272 163.697c-59.295 59.294-62.344 150.776-15.022 216.847L658.876 677.918c-4.066 3.953-6.437 8.81-9.035 13.553-144.565-60.085-322.899-33.656-436.97 80.301l-96.338 96.34 411.106 411.105-511.06 511.059c-22.136 22.023-22.136 57.826 0 79.85 10.956 11.067 25.413 16.602 39.869 16.602s28.913-5.535 39.981-16.603l511.059-511.059 411.106 410.993 96.339-96.339c74.654-74.54 115.764-173.816 115.764-279.529 0-55.115-11.745-108.31-33.091-157.327 2.597-1.92 5.647-3.05 8.018-5.421l300.763-300.763c29.365 20.895 62.456 34.448 96.903 34.448 43.37 0 86.852-16.603 119.83-49.582l163.766-163.764L1135.036.045z" stroke="none" stroke-width="1" fill-rule="evenodd"/></svg>`,
      href: 'https://community.canvaslms.com/',
      target: ''
    }
  ];

  // leave this alone
  const globalNavCustomLinks = () => {

    const nav_item_append = (item, hamb = true) => {
      var tidle = item.title.replace(/\W/g, '_').toLowerCase();
      const holder = hamb ? `.rspv-svg-${tidle}-holder` : `.svg-${tidle}-holder`;
      var icon;

      // handle menu icon
      if (hamb == true) {
        // ok so some might argue about the react class usage here
        // but I copied these in spring of 2020
        // I made 1 change to the below classes for release... let's roll with it for now
        // far cheaper than copying all that computed css out of canvas and back into your themes
        icon = $('<li>', {
          id: `rspv_nav_${tidle}_menu`,
          class: `fOyUs_bGBk jpyTq_bGBk jpyTq_ycrn jpyTq_cYsY`,
          html: `<a href="${item.href}" target="${item.target}" cursor="pointer" class="fOyUs_bGBk eHiXd_bGBk eHiXd_brAJ eHiXd_doqw eHiXd_eESV eHiXd_cuTS"
          style="margin: 0px; cursor: pointer;"><span class="eHiXd_caGd"><span direction="row" wrap="no-wrap"
              class="fOyUs_bGBk fOyUs_desw bDzpk_bGBk bDzpk_busO bDzpk_fZWR bDzpk_qOas"><span class="fOyUs_bGBk dJCgj_bGBk rspv-svg-${tidle}-holder"
                style="width: 3rem;"></span><span class="fOyUs_bGBk dJCgj_bGBk"><span wrap="normal" letter-spacing="normal"
                  class="enRcg_bGBk enRcg_ycrn enRcg_eQnG">${item.title}</span></span></span></span></a></li>`
        });
      } else {
        icon = $('<li>', {
          id: `global_nav_${tidle}_link`,
          class: `menu-item ic-app-header__menu-list-item`,
          html: `<a id="global_nav_${tidle}_link" role="button" href="${item.href}" target="${item.target}" class="ic-app-header__menu-list-link">
              <div class="menu-item-icon-container" role="presentation"><span class="svg-${tidle}-holder"></span></div>
              <div class="menu-item__text">${item.title}</div></a>`
        });
      }

      // instructure icon
      if (/^icon-[a-z]/.test(item.icon_svg) == true) {

        icon.find(holder).append($('<div>', {
          id: hamb ? `rspv_nav_${tidle}_svg` : `global_nav_${tidle}_svg`,
          class: hamb ? '' : 'menu-item-icon-container',
          html: `<i class="icon-line ${item.icon_svg} gnct_inst_menu_icon"></i></div>`,
          role: 'presentation'
        }));

        // externally hosted svg
      } else if (/^http/.test(item.icon_svg)) {

        icon.find(holder).load(item.icon_svg, function () {
          let svg = $(this).find('svg')[0];
          svg.setAttribute('id', `global_nav_${tidle}_svg`);
          if (hamb == true) {
            svg.setAttribute('class', 'dUOHu_bGBk dUOHu_cRbP cGqzL_bGBk cGqzL_VCXp dUOHu_drOs')
          } else {
            svg.setAttribute('class', 'ic-icon-svg menu-item__icon ic-icon-svg--apps svg-icon-help ic-icon-svg-custom-tray gnct_icon_svg');
          }
        });
        // inline/script svg
      } else if (/^<svg/.test(item.icon_svg)) {

        icon.find(holder).append($(item.icon_svg))
        let svg = icon.find(holder).find('svg')[0];
        svg.setAttribute('id', `global_nav_${tidle}_svg`);

        if (hamb == true) {
          svg.setAttribute('class', 'dUOHu_bGBk dUOHu_cRbP cGqzL_bGBk cGqzL_VCXp dUOHu_cVUo')
        } else {
          svg.setAttribute('class', 'ic-icon-svg menu-item__icon ic-icon-svg--apps svg-icon-help ic-icon-svg-custom-tray gnct_icon_svg');
        }
      }

      if (hamb == true) {
        $('div[role="dialog"][aria-label="Global Navigation"] ul').append(icon);
      } else {
        $('#menu').append(icon);
      }
    }
    const append_links = (links, hamb = true) => {
      links.forEach(link => {
        nav_item_append(link, hamb)
      });
    }
    const observeHamburger = function (mtx, observer) {
      let rspv_nav = document.querySelector('div[role="dialog"][aria-label="Global Navigation"] ul');
      if (!rspv_nav) {
        if (typeof observer === 'undefined') {
          var obs = new MutationObserver(observeHamburger);
          obs.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
        return;
      }

      if (rspv_nav != null) {
        observer.disconnect();
        append_links(links, true);
        exitRspvNav();
      }
    }

    const exitRspvNav = function (mtx, observer) {
      let rspv_nav = document.querySelector('div[role="dialog"][aria-label="Global Navigation"] ul');
      if (rspv_nav != null) {
        if (typeof observer === 'undefined') {
          var obs = new MutationObserver(exitRspvNav);
          obs.observe(document.body, {
            childList: true,
            subtree: true
          });
        }
        return;
      }
      if (rspv_nav == null) {
        observer.disconnect();
        observeHamburger();
      }
    }
    observeHamburger();
    append_links(links, false);
  }

  // handle css, remove or comment if you're also using Global Nav Custom Tray
  (function () {
    if (document.querySelectorAll('[data-global-nav-custom-css="set"]').length == 0) {
      let styles = {
        'i.gnct_inst_menu_icon:before': 'font-size: 32px; width: 32px; line-height: 32px;',
        'i.gnct_inst_menu_icon': 'width: 32px; height: 32px; font-style: bold;',
        '.gnct_icon_svg': 'width: 32px !important; height: 32px !important; font-style: bold;',
      };
      if (typeof styles !== 'undefined' && Object.keys(styles).length > 0) {
        let style = document.createElement('style');
        style.setAttribute('data-global-nav-custom-css', 'set');
        document.head.appendChild(style);
        let sheet = style.sheet;
        Object.keys(styles).forEach(function (key) {
          sheet.insertRule(`${key} { ${styles[key]} }`, sheet.cssRules.length);
        });
      }
    }
  })();

  // add links to menu
  globalNavCustomLinks(links);
})();