/**
// @name        Global Nav - Custom Trays
// @namespace   https://github.com/robert-carroll/ccsd-canvas
//
// Pin by [Gregor Cresnar](https://thenounproject.com/grega.cresnar/) from [The Noun Project]
// https://creativecommons.org/licenses/by/3.0/
**/
const globalNavCustomTray = (cfg) => {

  ///* options are above for convenience, continue if you like *///
  const tidle = cfg.title.replace(/\W/g, '_').toLowerCase(),
    trayid = `global_nav_${tidle}_tray`,
    menuItemClass = `ic-app-header__menu-list-item`,
    trayActiveClass = `${menuItemClass}--active`;

  // tray html
  var tray = `<span id="${trayid}" style="display: none;">
    <span class="global-nav-custom-tray gnct-easing">
    <span role="region" aria-label="Global navigation tray" class="Global-navigation-tray">

    <span class="gcnt-tray-close-wrapper">
    <button id="${trayid}_close" type="button" role="button" tabindex="0" class="gcnt-tray-close-btn" style="margin:0px;">
    <span class="gcnt-tray-close-svg-wrapper">
    <svg name="IconXSolid" viewBox="0 0 1920 1920" style="fill:currentColor;width:1em;height:1em;" width="1em" height="1em" aria-hidden="true" role="presentation" disabled="true">
    <g role="presentation"><svg version="1.1" viewBox="0 0 1920 1920">
    <path d="M1743.858.012L959.869 783.877 176.005.012 0 176.142l783.74 783.989L0 1743.87 176.005 1920l783.864-783.74L1743.858 1920l176.13-176.13-783.865-783.74 783.865-783.988z" stroke="none" stroke-width="1"></path>
    </svg></g></svg><span class="gcnt-tray-close-txt">Close</span></span></button></span>

    <div class="tray-with-space-for-global-nav">
    <div id="custom_${tidle}_tray" class="gnct-content-wrap">
    <h1 class="gcnt-tray-h1">${cfg.title}</h1><hr role="presentation"/>

    <ul class="gcnt-list">`;
  cfg.trayLinks.forEach(function (link) {
    tray +=
      `<li class="gcnt-list-item">
        <span class="gcnt-list-link-wrapper">
        <a target="_blank" rel="noopener" class="gcnt-list-link" href="${link.href}" role="button" tabindex="0">${link.title}</a>
        </span>`;
    // append link description if set
    tray += (!!link.desc && link.desc.length > 1) ? `<div class="gcnt-link-desc">${link.desc}</div>` : ''
    tray += '</li>';
  })
  // end tray links; if there is a footer, append it
  tray += (cfg.footer.length > 1) ? `<li class="gcnt-list-item"><hr role="presentation"/></li><li class="gcnt-list-item">${cfg.footer}</li>` : ''
  // end tray html
  tray += '</ul></div></div></span></span></span>';

  // global nav icon
  var main = $('#main'),
    menu = $('#menu'),
    icon = $('<li>', {
      id: `global_nav_${tidle}_menu`,
      class: `${menuItemClass} rc-gnct`,
      html: `<a id="global_nav_${tidle}_link" role="button" href="javascript:void(0)" class="ic-app-header__menu-list-link">
        <div class="menu-item-icon-container" role="presentation"><span class="svg-${tidle}-holder"></span></div>
        <div class="menu-item__text">${cfg.title}</div></a>`
    });
  // instructure icon
  if (/^icon-[a-z]/.test(cfg.icon_svg) == true) {

    icon.find(`.svg-${tidle}-holder`).append($('<div>', {
      id: `global_nav_${tidle}_svg`,
      class: 'menu-item-icon-container',
      html: `<i class="icon-line ${cfg.icon_svg} gnct_inst_menu_icon"></i></div>`,
      role: 'presentation'
    }));

  // externally hosted svg
  } else if (/^http/.test(cfg.icon_svg)) {

    icon.find(`.svg-${tidle}-holder`).load(cfg.icon_svg, function () {
      let svg = $(this).find('svg')[0],
        svg_id = `global_nav_${tidle}_svg`;
      svg.setAttribute('id', svg_id);
      svg.setAttribute('class', 'ic-icon-svg menu-item__icon ic-icon-svg--apps svg-icon-help ic-icon-svg-custom-tray');
      if (typeof cfg.svg_size === 'object') {
        svg.setAttribute('height', cfg.svg_size.height);
        svg.setAttribute('width', cfg.svg_size.width);
      }
    });

    // inline/script svg
  } else if (/^<svg/.test(cfg.icon_svg)) {

    icon.find(`.svg-${tidle}-holder`).append($(cfg.icon_svg))
    let svg = icon.find(`.svg-${tidle}-holder`).find('svg')[0],
      svg_id = `global_nav_${tidle}_svg`;
    svg.setAttribute('id', svg_id);
    svg.setAttribute('class', 'ic-icon-svg menu-item__icon ic-icon-svg--apps svg-icon-help ic-icon-svg-custom-tray');

    if (typeof cfg.svg_size === 'object') {
      svg.setAttribute('height', cfg.svg_size.height);
      svg.setAttribute('width', cfg.svg_size.width);
    }
  }
 
  menu.append(icon);
  main.append(tray);

  // handle interactions
  // please note variable reassignment
  icon = $(`#global_nav_${tidle}_menu`);
  tray = $(`#${trayid}`);
  
  var prevActiveIcon=null;
  // TODO: there's a delay in switching active icon states, sometimes both are active for a moment

  // multiple ways for the tray to get closed, reduce and reuse
  function close_gnct() {
	menu.find('a').each(function () {
      this.onmouseup = this.blur()
    })
    icon.removeClass(trayActiveClass)
	tray.find('.gnct-easing').animate({
      left: '-200px',
      opacity: .8
    }, 300, 'linear', function () {
      tray.hide()
    })
  }
  icon.click(function () {
    // if the tray is open, close it
    if ($(this).hasClass(trayActiveClass)) {
	  prevActiveIcon.addClass(trayActiveClass);
	  close_gnct();
      // else open the tray
    } else {
      prevActiveIcon=$(`.${trayActiveClass}`);
      // close all custom trays when opening a tray
      $('.rc-gnct').not(icon).click(function () {
        close_gnct();
      });
	  setTimeout(function () {
        $(`.${menuItemClass}`).removeClass(trayActiveClass);
        icon.addClass(trayActiveClass);
      }, 10)
      menu.find('a').each(function () {
        this.onmouseup = this.blur()
      })
      tray.show();
      tray.find('.gnct-easing').animate({
        left: '0px',
        opacity: 1
      }, 300, 'linear')
    }
  });
  // close the tray if the user clicks another nav icon that is not this one
  $(`.${menuItemClass}`).not(icon).click(function () {
    close_gnct();
  });
  // close the tray
  $(`#${trayid}_close`).click(function () {
    prevActiveIcon.addClass(trayActiveClass);
	close_gnct();
  });
}
