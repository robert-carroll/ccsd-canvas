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
      target: '_blank',
      position: 1 // can be one of : integer (position after first), 'after' (help or last), 'before' (help or last)
    },
    {
      title: 'External Icon',
      // example only, host your own, or use icon class
      icon_svg: 'https://raw.githubusercontent.com/instructure/instructure-ui/master/packages/ui-icons/svg/Line/pin.svg',
      href: 'https://community.canvaslms.com/',
      target: '_blank',
      //position: 'before' // default
    },
    {
      title: 'Inline Icon',
      // example, instructure-ui pin.svg from above
      icon_svg: `<svg viewBox="0 0 1920 1920" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M1643.272 835.697c-22.024 22.023-57.826 22.023-79.85 0l-20.442-20.442c-.226-.226-.226-.452-.452-.678-.226-.113-.452-.113-.565-.339L1072.806 345.08c-.226-.225-.34-.564-.565-.79-.226-.226-.565-.339-.79-.452l-20.33-20.33c-22.024-22.023-22.024-57.938 0-79.962l83.915-83.802 592.15 592.038-83.914 83.915zm-506.768 305.167c-7.34-8.584-13.44-18.07-21.571-26.09L771.93 771.773c-8.018-8.132-17.506-13.892-26.09-21.12l286.42-286.419 390.437 390.438-286.193 286.193zm-101.42 453.007l-16.49 16.49-742.362-742.25 16.489-16.49c106.73-106.842 292.743-106.842 399.36 0l343.002 343.003c53.309 53.308 82.673 124.235 82.673 199.567 0 75.445-29.364 146.372-82.673 199.68zM1135.035.045L971.272 163.697c-59.295 59.294-62.344 150.776-15.022 216.847L658.876 677.918c-4.066 3.953-6.437 8.81-9.035 13.553-144.565-60.085-322.899-33.656-436.97 80.301l-96.338 96.34 411.106 411.105-511.06 511.059c-22.136 22.023-22.136 57.826 0 79.85 10.956 11.067 25.413 16.602 39.869 16.602s28.913-5.535 39.981-16.603l511.059-511.059 411.106 410.993 96.339-96.339c74.654-74.54 115.764-173.816 115.764-279.529 0-55.115-11.745-108.31-33.091-157.327 2.597-1.92 5.647-3.05 8.018-5.421l300.763-300.763c29.365 20.895 62.456 34.448 96.903 34.448 43.37 0 86.852-16.603 119.83-49.582l163.766-163.764L1135.036.045z" stroke="none" stroke-width="1" fill-rule="evenodd"/></svg>`,
      href: 'https://community.canvaslms.com/',
      target: '',
      position: 'after'
    },
  ];

  // leave this alone
  const globalNavCustomLinks = () => {

    const hamb_menu_sel = 'div[role="dialog"][aria-label="Global Navigation"] ul';
    const nav_item_append = (item, hamb = true) => {
      const tidle = item.title.replace(/\W/g, '_').toLowerCase();

      // handle menu icon
      if (hamb == true) {

        const dash_icon_li = document.querySelector(`div[role="dialog"][aria-label="Global Navigation"] ul svg[name="IconDashboard"]`).closest('li');
        var target_li = document.querySelector(`div[role="dialog"][aria-label="Global Navigation"] ul li:last-child`);
        var resp_icon = dash_icon_li.cloneNode(true);
        resp_icon.setAttribute('id', `resp-global_nav_${tidle}_link`);
        resp_icon.querySelector('svg').parentElement.classList.add(`rspv-svg-${tidle}-holder`);
        resp_icon.querySelector('a').href = item.href;
        resp_icon.querySelector('span[class$="text"]').textContent = item.title;
        var svg_holder = resp_icon.querySelector(`.rspv-svg-${tidle}-holder`);
        resp_icon.querySelector('svg').remove();
        if (item.target !== undefined && item.target.includes('_blank', '_self', '_parent')) {
          resp_icon.querySelector('a').setAttribute('target', item.target);
        }
      } else {

        var icon = $('<li>', {
          id: `global_nav_${tidle}_link`,
          class: `menu-item ic-app-header__menu-list-item`,
          html: `<a id="global_nav_${tidle}_link" role="button" href="${item.href}" target="${item.target}" class="ic-app-header__menu-list-link">
              <div class="menu-item-icon-container" role="presentation"><span class="svg-${tidle}-holder"></span></div>
              <div class="menu-item__text">${item.title}</div></a>`
        });
      }

      // instructure icon
      if (/^icon-[a-z]/.test(item.icon_svg) == true) {

        if (hamb == true) {
          svg_holder.insertAdjacentHTML('afterbegin', `<div id="resp-global_nav_${tidle}_svg" role="presentation"><i class="icon-line ${item.icon_svg} gnct_inst_menu_icon"></i></div>`)

        } else {
          icon.find(`.svg-${tidle}-holder`).append($('<div>', {
            id: `global_nav_${tidle}_svg`,
            class: 'menu-item-icon-container',
            html: `<i class="icon-line ${item.icon_svg} gnct_inst_menu_icon"></i></div>`,
            role: 'presentation'
          }));
        }

        // externally hosted svg
      } else if (/^http/.test(item.icon_svg)) {
        if (hamb == true) {
          // fetch hosted svg, you must handle cors policies locally
          fetch(item.icon_svg, {
              mode: 'cors',
              method: 'GET',
              headers: {
                'Access-Control-Request-Method': 'GET',
                'Accept': 'text/plain',
                'Content-Type': 'text/plain',
              }
            })
            .then(r => r.text())
            .then(svg => {
              svg_holder.insertAdjacentHTML('afterbegin', svg);
              resp_icon.querySelector('svg').setAttribute('id', `resp-global_nav_${tidle}_svg`);
              resp_icon.querySelector('svg').classList.add('css-1216v6a-inlineSVG-svgIcon');
            })
            .catch(console.error.bind(console));

        } else {
          icon.find(`.svg-${tidle}-holder`).load(item.icon_svg, function () {
            let svg = $(this).find('svg')[0];
            svg.setAttribute('id', `global_nav_${tidle}_svg`);
            svg.setAttribute('class', 'ic-icon-svg menu-item__icon ic-icon-svg--apps svg-icon-help ic-icon-svg-custom-tray gnct_icon_svg');
          });
        }

        // inline/script svg
      } else if (/^<svg/.test(item.icon_svg)) {

        if (hamb == true) {
          svg_holder.insertAdjacentHTML('afterbegin', item.icon_svg);
          resp_icon.querySelector('svg').setAttribute('id', `resp-global_nav_${tidle}_svg`);
          resp_icon.querySelector('svg').classList.add('css-1216v6a-inlineSVG-svgIcon');

        } else {
          icon.find(`.svg-${tidle}-holder`).append($(item.icon_svg))
          let svg = icon.find(`.svg-${tidle}-holder`).find('svg')[0];
          svg.setAttribute('id', `global_nav_${tidle}_svg`);
          svg.setAttribute('class', 'ic-icon-svg menu-item__icon ic-icon-svg--apps svg-icon-help ic-icon-svg-custom-tray gnct_icon_svg');
        }
      }

      // positioned
      if (item.position !== undefined && typeof item.position === 'number') {
        var sel = (hamb == true ? hamb_menu_sel : '#menu') + ` > li:nth-of-type(${item.position})`;

        if (hamb == true) {
          document.querySelector(sel).after(resp_icon);
        } else {
          $(sel).after(icon);
        }
        // after
      } else if (item.position !== undefined && item.position == 'after') {
        if (hamb == true) {
          target_li.after(resp_icon);
        } else {
          $('#menu').append(icon);
        }
        // before
      } else {
        if (hamb == true) {
          target_li.before(resp_icon)
        } else {
          $('#menu li:last').before(icon);
        }
      }
    }
    const append_links = (links, hamb = true) => {
      links.forEach(link => {
        nav_item_append(link, hamb);
      });
    }
    const watch_burger_tray = function (mtx, observer) {
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
        append_links(links, true);
        exit_burger_tray();
      }
    }

    const exit_burger_tray = function (mtx, observer) {
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
    }
    watch_burger_tray();
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