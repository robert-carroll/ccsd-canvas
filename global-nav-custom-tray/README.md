
# Global Navigation - Custom Tray

This JavaScript will spawn and style (with CSS) DOM elements that mimic the Canvas global navigation tray, with animated easing for opening and closing the tray, and other interactions with the global navigation.

![
](https://s3-us-west-2.amazonaws.com/ccsd-canvas/git-docs/global-nav-custom-tray.png)

## Features
 - Custom tray name with tooltip
 - SVG navigation icon included, or provide your own
 - Links with optional description
 - Footer text optional

## Icon Size
Use the SVG element's width and height to set the icon size for the navigation tray icon.
26px is about the default. see [#comment-157915]](https://community.canvaslms.com/thread/23242-global-nav-custom-tray#comment-157915)

## Role Based Conditions

### Tray Limited To Role(s)

To create a tray that only shows up for certain roles, wrap the tray in an ```if condition``` that checks for role.

2 role example
```javascript
if(ENV.current_user_roles.indexOf('teacher') >= 0 || ENV.current_user_roles.indexOf('admin') >= 0) { 
	// tray source here
}
```

1 role example 
```javascript
if(ENV.current_user_roles.indexOf('student') >= 0){
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
        // tray source here
    });
}

```

### Tray for everyone, links by role
You can also create a tray that will appear for all users, but provide links (or even the tray name, icon, and footer), specific to the user role.

```javascript
var title   = 'Resources',
    svg     = 'https://hosted.img.cdn/pin-gregor-cresnar.svg',
    // default links for all users
    trayLinks = [
        { href: 'http://www.example.com/your-library', title: 'Library', desc:'Optional text description' },
        { href: 'http://www.google.com', title: 'Google' },
        { href: 'http://www.example.com/help-desk', title: 'Help Desk', desc:'Optional  text description' }
    ],
    footer  = 'Default footer for all users';
    
// these links are appended to the tray by user role
if(ENV.current_user_roles.indexOf('teacher') >= 0 || ENV.current_user_roles.indexOf('admin') >= 0){
    trayLinks.push({ href: 'http://www.example.com/your-library', title: 'Teacher Library', desc:'Optional text description' })
    trayLinks.push({ href: 'http://www.google.com', title: 'Google' })
    footer  = 'Teacher/Admin Footer overwrites default';
} else if (ENV.current_user_roles.indexOf('student') >= 0) {
    trayLinks.push({ href: 'http://www.example.com/your-library', title: 'Student Library', desc:'Optional text description' })
    trayLinks.push({ href: 'http://www.google.com', title: 'Google' })
    footer  = 'Student Footer overwrites default';
}
```

## Credits for the included navigation tray icon - Pin
Pin by [Gregor Cresnar](https://thenounproject.com/grega.cresnar/) from [The Noun Project](https://thenounproject.com/)

https://creativecommons.org/licenses/by/3.0/


## Canvas Community Discussion
https://community.canvaslms.com/message/101582-global-nav-custom-tray
