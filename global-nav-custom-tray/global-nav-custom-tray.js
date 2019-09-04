/**
// @name        Global Nav - Custom Tray
// @namespace   https://github.com/robert-carroll/ccsd-canvas
// @author      Robert Carroll <carror@nv.ccsd.net>
//
// Pin by [Gregor Cresnar](https://thenounproject.com/grega.cresnar/) from [The Noun Project]
// https://creativecommons.org/licenses/by/3.0/
**/
$(document).ready(function() {
    ///* set tray title, icon, links and footer here *///
    ///*  for user role based conditions see README  *///
    var title   = 'Resources',
        svg     = 'https://hosted.img.cdn/pin-gregor-cresnar.svg',
        trayLinks = [
            { href: 'http://www.example.com/your-library', title: 'Library', desc:'Optional text description' },
            { href: 'http://www.google.com', title: 'Google' },
            { href: 'http://www.example.com/help-desk', title: 'Help Desk', desc:'Optional  text description' }
        ],
		footer  = 'Optional footer text, put whatever you want here, or leave it blank.';
        
    ///* options are above for convenience, continue if you like *///
    var tidle     = title.replace(/\s/, '_').toLowerCase(),
        trayid    = 'global_nav_'+tidle+'_tray',
        trayItems = '',
        trayLinks = trayLinks.forEach(function(link) {
            trayItems += '<li class="gcnt-list-item">'
                      + '<span class="gcnt-list-link-wrapper">'
                      + '<a target="_blank" rel="noopener" class="gcnt-list-link" href="'+link.href+'" role="button" tabindex="0">'+ link.title +'</a>'
                      + '</span>';
            // append link description if set
            if(!!link.desc && link.desc.length > 1)
                { trayItems +='<div class="gcnt-link-desc">'+ link.desc +'</div>' }
            trayItems += '</li>';
        }),
        // tray html
        tray = '<span id="'+trayid+'" style="display: none;">'
            + '<span class="global-nav-custom-tray gnct-easing">'
            + '<span role="region" aria-label="Global navigation tray" class="Global-navigation-tray">'
            // begin close button
            + '<span class="gcnt-tray-close-wrapper">'
            + '<button id="'+trayid+'_close" type="button" role="button" tabindex="0" class="gcnt-tray-close-btn" style="margin:0px;">'
            + '<span class="gcnt-tray-close-svg-wrapper">'
            + '<svg name="IconXSolid" viewBox="0 0 1920 1920" style="fill:currentColor;width:1em;height:1em;" width="1em" height="1em" aria-hidden="true" role="presentation" disabled="true">'
            + '<g role="presentation"><svg version="1.1" viewBox="0 0 1920 1920">'
            + '<path d="M1743.858.012L959.869 783.877 176.005.012 0 176.142l783.74 783.989L0 1743.87 176.005 1920l783.864-783.74L1743.858 1920l176.13-176.13-783.865-783.74 783.865-783.988z" stroke="none" stroke-width="1"></path>'
            + '</svg></g></svg><span class="gcnt-tray-close-txt">Close</span></span></button></span>'
            // end of close button; begin tray header
            + '<div class="tray-with-space-for-global-nav">'
            + '<div id="custom_'+tidle+'_tray" class="gnct-content-wrap">'
            + '<h1 class="gcnt-tray-h1">'+ title +'</h1><hr role="presentation"/>'
            // end tray header; begin tray links list
            + '<ul class="gcnt-list">'
            + trayItems;
            // end tray links; if there is a footer, append it
            if(footer.length > 1) {
                tray += '<li class="gcnt-list-item"><hr role="presentation"/></li>'
                      + '<li class="gcnt-list-item">'+ footer + '</li>';
            }
            // end tray html
            tray += '</ul></div></div></span></span></span>';
    // global nav icon
    var main = $('#main'),
        menu = $('#menu'),
        icon = $('<li>', {
            id: 'global_nav_'+tidle+'_menu',
            class: 'ic-app-header__menu-list-item',
            html: '<a id="global_nav_'+tidle+'_link" role="button" href="javascript:void(0)" class="ic-app-header__menu-list-link">'
              + '<div class="menu-item-icon-container" role="presentation"><span class="svg-'+tidle+'-holder"></span></div>'
              + '<div class="menu-item__text">' + title + '</div></a>'
            });
        icon.find('.svg-'+tidle+'-holder').load(svg, function(){
            var svg = $(this).find('svg')[0],
                svg_id = 'global_nav_'+tidle+'_svg';
                svg.setAttribute('id', svg_id);
                svg.setAttribute('class', 'ic-icon-svg menu-item__icon ic-icon-svg--apps svg-icon-help ic-icon-svg-custom-tray')
                $('#'+svg_id).find('path').removeAttr('fill')
        });
    menu.append(icon);
    main.append(tray);
    // if you ventured this far, please note variable reassignment
    icon = $('#global_nav_'+tidle+'_menu');
    tray = $('#'+trayid);

    // TODO: there's a delay in switching active icon states, sometimes both are active for a moment

    // multiple ways for the tray to get closed, reduce and reuse
    function close_gnct() {
        menu.find('a').each(function(){this.onmouseup = this.blur()})
        tray.find('.gnct-easing').animate({
            left: '-200px', opacity: .8
        }, 300, 'linear', function() {
            tray.hide()
            icon.removeClass('ic-app-header__menu-list-item--active')
        })
    }
    icon.click(function() {
        // if the tray is open, close it
        if($(this).hasClass('ic-app-header__menu-list-item--active')) {
            close_gnct()
        // else open the tray
        } else {
            menu.find('a').each(function(){this.onmouseup = this.blur()})
            tray.show()
            tray.find('.gnct-easing').animate({
                left: '0px', opacity: 1
            }, 300, 'linear', function() {
                $('.ic-app-header__menu-list-item').removeClass('ic-app-header__menu-list-item--active');
                icon.addClass('ic-app-header__menu-list-item--active');
            })
        }
    });
    // close the tray if the user clicks another nav icon that is not this one
    $('.ic-app-header__menu-list-item').not(icon).click(function() { close_gnct(); });
    // close the tray
    $('#'+trayid+'_close').click(function() { close_gnct(); });
});