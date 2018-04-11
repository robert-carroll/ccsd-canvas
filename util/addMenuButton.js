/**
// @name        Global Nav - Add Menu Button
// @namespace   https://github.com//robert-carroll/ccsd-canvas
// @author      Aaron Leonard <leonaa@nv.ccsd.net>
**/
ccsd.util.addMenuButton = function(title, url, img) {
  var id_title = 'global_nav_custom_' + title.replace(/\s/, '_').toLowerCase();

  var button = $('<li class="custom-menu ic-app-header__menu-list-item" id="'+id_title+'_menu">' +
    '<a id="'+id_title+'" href="'+url+'" class="ic-app-header__menu-list-link">' +
      '<div class="menu-item-icon-container" aria-hidden="true"><span class="menu-item__badge" style="display: none">'+title+'</span><span class="svg-holder"></span></div>' +
      '<div class="menu-item__text">' + title + '</div>' +
    '</a>' +
  '</li>');

  button.find('.svg-holder').load(img, function(){
      var svg = $(this).find('svg')[0];
      try {
          svg.classList.add('ic-icon-svg', 'ic-icon-svg--apps ic-icon-svg-ccsd');
      }
      catch (e) {
          svg.setAttribute('class', 'ic-icon-svg ic-icon-svg--apps ic-icon-svg-ccsd');
      }

      $('#'+id_title+'_menu').remove();
      $('#menu .menu-item:last').after(button);
  });
};
