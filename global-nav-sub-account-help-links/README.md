
# Global Nav - Custom Sub Account Help Links

Adds custom Help Links to the Global Navigation Help tray and responsive hamburger menu

More specifically; Canvas only allows adding custom help links to the Help menu from the Root Account.

- If you wanted to add custom help links by role or at a Sub Account, this can help you.
- If you place the function at a global account theme, and configs at sub accounts, you can reduce the repeated code and keep link configs in sub account themes.

## Config for Custom Help Link
```js
// links for global help tray
const linksForGlobalNavCustomHelpTray = [{
    href: "#custom_help_link",
    title: "Custom Link 1",
    desc: "Adding this from Javascript",
    target: '',
    position: 2
  },
  {
    href: "#custom_help_link_two",
    title: "Custom Link 2",
    desc: "This one too",
    target: '_blank',
    position: 5
  }
];

// links for specific roles
if (['teacher', 'admin'].some(a => ENV.current_user_roles.includes(a))) {
  linksForGlobalNavCustomHelpTray.push({
    href: "#custom_teacher_help_link",
    title: "Custom Admin/Teacher Help Link",
    desc: "Training Materials",
    target: '_blank',
    //position: 9
  });
}
// student links
if (ENV.current_user_roles.indexOf('student') >= 0) {
  linksForGlobalNavCustomHelpTray.push({
    href: "#custom_student_help_link",
    title: "Custom Student Help Link",
    desc: "Student Support",
    target: '_blank',
    //position: 9
  });
}
```


