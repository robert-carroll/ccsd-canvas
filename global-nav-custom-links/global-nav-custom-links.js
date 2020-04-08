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
      title: 'External SVG',
      icon_svg: 'https://hosted.img.cdn/pin-gregor-cresnar.svg',
      href: 'https://community.canvaslms.com/',
      target: '_blank'
    },
    {
      title: 'Inline SVG', // the menu item or tray name, what users will see
      icon_svg: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="26px" height="26px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
      <path fill="#FFFFFF" d="M290.869,15.55c-8.035-8.037-21.064-8.037-29.1,0c-8.036,8.035-8.036,21.064,0,29.101l26.633,26.941  l-97.997,97.688c-46.665-26.121-104.991-18.147-142.934,19.538l-11.928,11.825c-8.036,8.028-8.043,21.049-0.016,29.085  c0.005,0.004,0.011,0.01,0.016,0.016l109.514,109.205L15.697,468.72c-8.036,8.026-8.043,21.049-0.016,29.084  c0.005,0.007,0.01,0.013,0.016,0.018c3.828,3.638,8.91,5.661,14.19,5.655c5.466,0.031,10.721-2.114,14.602-5.964l129.36-129.155  l108.487,108.177c3.887,4.079,9.273,6.383,14.91,6.376c5.443-0.022,10.658-2.203,14.498-6.067l11.928-11.823  c37.637-38.01,45.604-96.326,19.537-143.038l97.998-98.201l26.529,26.53c3.812,4.001,9.076,6.298,14.602,6.375  c11.359,0.01,20.574-9.191,20.582-20.55c0.006-5.488-2.186-10.752-6.082-14.617L290.869,15.55z M297.246,432.833l-218-217.279  c31.259-28.251,79.165-27.077,109,2.674l106.019,105.71C324.141,353.63,325.451,401.547,297.246,432.833z M317.811,288.872  l-94.603-93.885l94.603-94.604l93.988,94.604L317.811,288.872z"/>`, // can be instructure icon, <svg>, or link to .svg
      href: 'https://community.canvaslms.com/',
      target: '' // _blank opens new window/tab, '' opens in the current window/tab
    }
  ];

  // leave this alone
  const globalNavCustomLinks = (links) => {
    (function () {
      if (document.querySelectorAll('[data-global-nav-custom-css="set"]').length == 0) {
        let styles = {
          'i.gnct_inst_menu_icon:before': 'font-size: 26px; width: 26px; line-height: 26px;',
          'i.gnct_inst_menu_icon': 'width: 26px; height: 26px;'
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

    let gnci_svg = (svg, tidle) => {
      svg.setAttribute('id', `global_nav_${tidle}_svg`);
      svg.setAttribute('class', 'ic-icon-svg menu-item__icon ic-icon-svg--apps svg-icon-help ic-icon-svg-custom-tray');
      if (svg.getAttribute('height') > '26px') {
        svg.removeAttribute('height')
      }
      if (svg.getAttribute('width') > '26px') {
        svg.removeAttribute('width')
      }
    }

    links.forEach(link => {
      // selector id from link title
      const tidle = link.title.replace(/\W/g, '_').toLowerCase();
      // global nav icon
      var icon = $('<li>', {
        id: `global_nav_${tidle}_link`,
        class: `ic-app-header__menu-list-item`,
        html: `<a id="global_nav_${tidle}_link" role="button" href="${link.href}" target="${link.target}" class="ic-app-header__menu-list-link">
            <div class="menu-item-icon-container" role="presentation"><span class="svg-${tidle}-holder"></span></div>
            <div class="menu-item__text">${link.title}</div></a>`
      });
      // instructure icon
      if (/^icon-[a-z]/.test(link.icon_svg) == true) {

        icon.find(`.svg-${tidle}-holder`).append($('<div>', {
          id: `global_nav_${tidle}_svg`,
          class: 'menu-item-icon-container',
          html: `<i class="icon-line ${link.icon_svg} gnct_inst_menu_icon"></i></div>`,
          role: 'presentation'
        }));
        // externally hosted svg
      } else if (/^http/.test(link.icon_svg)) {

        icon.find(`.svg-${tidle}-holder`).load(link.icon_svg, function () {
          let svg = $(this).find('svg')[0];
          gnci_svg(svg, tidle);
        });
        // inline/script svg
      } else if (/^<svg/.test(link.icon_svg)) {

        icon.find(`.svg-${tidle}-holder`).append($(link.icon_svg))
        let svg = icon.find(`.svg-${tidle}-holder`).find('svg')[0];
        gnci_svg(svg, tidle);
      }
      $('#menu').append(icon);
    });
  }
  globalNavCustomLinks(links);
})();