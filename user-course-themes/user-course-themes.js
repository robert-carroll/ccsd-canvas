// ==UserScript==
// @name         User Course Themes
// @namespace    https://github.com/robert-carroll/ccsd-canvas
// @description  Differentiates current course by colorizing the Global Nav with the Course Card Color
// @description  best as a user script, or user level api example
// @version      0.4
// @author       Robert Carroll
// @include      https://*.instructure.com/courses/*
// ==/UserScript==

// op: https://community.canvaslms.com/ideas/14710
// basically why a forum is a bad repo

(function () {
  'use strict';

  if (/^\/courses\/\d+/.test(window.location.pathname)) {

    let course_id = window.location.pathname.match(/\d+/g)[0];

    fetch(`/api/v1/users/self/colors/course_${course_id}`, {
        'headers': {
          'accept': 'application/json',
          'content-type': 'application/json',
          'cache': 'default'
        }
      })
      .then(res => {
        if (!res.ok) throw Error(res.status);
        return res.json()
      })
      .then(json => set_nav_css(json.hexcode))
      .catch(err => console.error(err));

    const set_nav_css = hexcode => {
      let styles = {
        'ic-app-header__primary, .ic-app-header': `background-color: ${hexcode} !important;`,
      };
      if (typeof styles !== 'undefined' && Object.keys(styles).length > 0) {
        let style = document.createElement('style');
        document.head.appendChild(style);
        let sheet = style.sheet;
        Object.keys(styles).forEach(function (key) {
          sheet.insertRule(`${key} { ${styles[key]} }`, sheet.cssRules.length);
        });
      }
    }
  }
})();