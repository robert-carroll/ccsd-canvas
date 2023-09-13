
# Global Nav Custom Tray

This version of the Global Nav Custom Tray supports multiple trays and 3 options for choosing icons.

The link will appear at the bottom of the Left Navigation Menu

![](https://s3-us-west-2.amazonaws.com/ccsd-canvas/git-docs/global-nav-custom-tray.png)

## Multi Trays
Can now handle multiple trays by passing tray sets to the `globalNavCustomTray()` function. See examples below for creating multiple trays.


## SVG Options
There are now 3 options when chosing SVG icons.
- Instructure Icons
- Externally hosted (CDN) .svg file
- Inline `<SVG>`

See examples below for icon options.

## Minified Example
[global-nav-custom-tray-multi.min.js](global-nav-custom-tray-multi.min.js)

## Instructure UI Icon Set
Choose available icons from [https://instructure.design/#icons-font](https://instructure.design/#icons-font)
```js
const InstIconTray = {
  title: 'InstIconTray', // the menu item or tray name, what users will see
  icon_svg: 'icon-pin',
  trayLinks: [{
      href: 'http://www.example.com/your-library',
      title: 'Library',
      desc: 'Optional text description'
    },
    {
      href: 'http://www.google.com',
      title: 'Google'
    },
    {
      href: 'http://www.example.com/help-desk',
      title: 'Help Desk',
      desc: 'Optional text description'
    }
  ],
  footer: 'Optional footer text, put whatever you want here, or leave it blank.'
}
globalNavCustomTray(InstIconTray);

```

## Externally hosted SVG file
```js
const externalIconTray = {
  title: 'externalIconTray', // the menu item or tray name, what users will see
  icon_svg : 'https://hosted.img.cdn/pin-gregor-cresnar.svg',
  //svg_size: { height: '26px', width: '26px' }, // overrides svg settings, uncomment and adjust if needed
  trayLinks: [{
      href: 'http://www.example.com/your-library',
      title: 'Library',
      desc: 'Optional text description'
    },
    {
      href: 'http://www.google.com',
      title: 'Google'
    },
    {
      href: 'http://www.example.com/help-desk',
      title: 'Help Desk',
      desc: 'Optional text description'
    }
  ],
  footer: 'Optional footer text, put whatever you want here, or leave it blank.'
}
globalNavCustomTray(externalIconTray);

```

## Inline SVG
```js
const inlineIconTray = {
  title: 'inlineIconTray', // the menu item or tray name, what users will see
  icon_svg: `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="26px" height="26px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
          <path fill="#FFFFFF" d="M290.869,15.55c-8.035-8.037-21.064-8.037-29.1,0c-8.036,8.035-8.036,21.064,0,29.101l26.633,26.941  l-97.997,97.688c-46.665-26.121-104.991-18.147-142.934,19.538l-11.928,11.825c-8.036,8.028-8.043,21.049-0.016,29.085  c0.005,0.004,0.011,0.01,0.016,0.016l109.514,109.205L15.697,468.72c-8.036,8.026-8.043,21.049-0.016,29.084  c0.005,0.007,0.01,0.013,0.016,0.018c3.828,3.638,8.91,5.661,14.19,5.655c5.466,0.031,10.721-2.114,14.602-5.964l129.36-129.155  l108.487,108.177c3.887,4.079,9.273,6.383,14.91,6.376c5.443-0.022,10.658-2.203,14.498-6.067l11.928-11.823  c37.637-38.01,45.604-96.326,19.537-143.038l97.998-98.201l26.529,26.53c3.812,4.001,9.076,6.298,14.602,6.375  c11.359,0.01,20.574-9.191,20.582-20.55c0.006-5.488-2.186-10.752-6.082-14.617L290.869,15.55z M297.246,432.833l-218-217.279  c31.259-28.251,79.165-27.077,109,2.674l106.019,105.71C324.141,353.63,325.451,401.547,297.246,432.833z M317.811,288.872  l-94.603-93.885l94.603-94.604l93.988,94.604L317.811,288.872z"/>
          </svg>`,
  // svg_size: { height: '26px', width: '26px' }, // overrides svg settings, uncomment and adjust if needed
  trayLinks: [{
      href: 'http://www.example.com/your-library',
      title: 'Library',
      desc: 'Optional text description'
    },
    {
      href: 'http://www.google.com',
      title: 'Google'
    },
    {
      href: 'http://www.example.com/help-desk',
      title: 'Help Desk',
      desc: 'Optional text description'
    }
  ],
  footer: 'Optional footer text, put whatever you want here, or leave it blank.'
}
globalNavCustomTray(inlineIconTray);
```


## Customizing by Role
Roles can be adjusted as previously featured and documented.
Simply add the tray config before pushing links and adjusting values.

```js
const TraybyRole = {
  title: 'InstIconTray', // the menu item or tray name, what users will see
  icon_svg: 'icon-pin',
  trayLinks: [{
      href: 'http://www.example.com/your-library',
      title: 'Library',
      desc: 'Optional text description'
    },
    {
      href: 'http://www.google.com',
      title: 'Google'
    },
    {
      href: 'http://www.example.com/help-desk',
      title: 'Help Desk',
      desc: 'Optional text description'
    }
  ],
  footer: 'Optional footer text, put whatever you want here, or leave it blank.'
}
// customizing based on roles
if(['teacher','admin'].some(a => ENV.current_user_roles.includes(a))) {
    TraybyRole.trayLinks.push({ href: 'http://www.example.com/your-library', title: 'Teacher Library', desc:'Optional text description' })
    TraybyRole.trayLinks.push({ href: 'http://www.google.com', title: 'Google' })
    TraybyRole.footer = 'Teacher/Admin Footer overwrites default';
  } else if (ENV.current_user_roles.indexOf('student') >= 0) {
    TraybyRole.trayLinks.push({ href: 'http://www.example.com/your-library', title: 'Student Library', desc:'Optional text description' })
    TraybyRole.trayLinks.push({ href: 'http://www.google.com', title: 'Google' })
    TraybyRole.footer = 'Student Footer overwrites default';
}
globalNavCustomTray(TraybyRole);
```

## Roles can be tricky though

For instance, if you have employees in the student role, maybe for PD, depending on the Sub Account you install this too, employees would see the Student links. 
Trying using elimination, instead of inclusion, to find users that don't have employee roles.

```js
// customizing based on roles
// if the user is not a teacher, admin, or root_admin; user, student, observer only
if (!['teacher', 'admin', 'root_admin'].some(a => ENV.current_user_roles.includes(a)))
    // links for user, student, observer
    TraybyRole.trayLinks.push({ href: 'http://www.example.com/your-library', title: 'Student Library', desc:'Optional text description' })
    TraybyRole.trayLinks.push({ href: 'http://www.google.com', title: 'Google' })
    TraybyRole.footer = 'Student Footer overwrites default';
  } else {
    // links for teacher, admin, root_admin
    TraybyRole.trayLinks.push({ href: 'http://www.example.com/your-library', title: 'Teacher Library', desc:'Optional text description' })
    TraybyRole.trayLinks.push({ href: 'http://www.google.com', title: 'Google' })
    TraybyRole.footer = 'Teacher/Admin Footer overwrites default';
}
```

## Credits for the sample navigation tray icon - Pin
Pin by [Gregor Cresnar](https://thenounproject.com/grega.cresnar/) from [The Noun Project](https://thenounproject.com/)

https://creativecommons.org/licenses/by/3.0/


## Canvas Community Discussion
https://community.canvaslms.com/message/101582-global-nav-custom-tray