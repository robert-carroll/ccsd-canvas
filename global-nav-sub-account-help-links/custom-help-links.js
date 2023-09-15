
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