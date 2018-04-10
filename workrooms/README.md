# Create a Workroom - Button 

This JavaScript file adds a **Create a Workroom** button and tiny dialog to Canvas LMS /courses page. It allows an end user to create a new empty course shell for them to utlize as a Sandbox.

## Implementation & Deployment

Please use this code as you see fit, but here is a quick explanation of our process.

Within our SIS Integration all employees are enrolled as a **teacher** in a course "Workroom" for their own use, the course is named *WORKROOM -- Employee Name | CCSD*, the course is added to a root level sub account named ***Workrooms***.

This automatically ensures that every employee has a Teacher role in Canvas, regardless of their position within the institution. Anyone from Support Staff to the Superintendent may create a workroom. *We also utilize Canvas for more than SIS courses.*


> Our formatted import files look like this.
```
https://*.instructure.com/doc/api/file.sis_csv.html
courses.csv
course_id,short_name,long_name,account_id,term_id,status
WKRM-E1234567,WKRM-PANDC,WORKROOM -- Canvas Panda | CCSD,CCSDWRK,Forever,active

enrollments.csv
course_id,user_id,role,status
WKRM-E1234567,E1234567,teacher,active
```

### But Why?
We do this because we didn't want to allow everyone to be able to create their own courses throughout Canvas. We disable the `+ Course` button on the /courses page with the following snippet.

```javascript
(function() {
  var handleNewCourse = function() {
    ccsd.util.hasAnyRole("admin")
      ? $("#start_new_course").show()
      : $("#start_new_course").remove();
  };
  handleNewCourse();
})();
```

## Configuration
The configuration variables have been set toward the top of the file to make it easy to set for your instance.

```javascript
var workroom = {
    cfg : {
        wkrm_acct_id    : 138759,       // the ID of the subaccount where all workrooms should be put
        term_id         : 5473,         // the ID of the term that all workrooms should be created with (We recommend the 'Forever' term)
        roles           : ['teacher']   // the roles allowed to create a workroom
    }
}
```

You may also want to review the `workroom.enroll()` function for the course **long_name** and **short_name** formatting as well as the following course creation API parameters.

```javascript
var DATE_FM     = workroom.codedDate(new Date()),
    long_name   = 'WORKROOM -- ' + ENV.current_user.display_name + ' -- ' + DATE_FM,
    short_name  = 'WKRM-' + shortName,
    course_id   = 'WKRM-' + employee_id + '-' + DATE_FM;

var data = {
    course: {
        name: long_name,
        course_code: short_name,
        //sis_course_id: course_id,
        is_public: false,
        is_public_to_auth_users: false,
        enrollment_term_id: workroom.cfg.term_id
    },
    enroll_me: true
};
```

### Additional Considerations

The `workroom.getSISID()` function depends on exposing the following in your Canvas instance permissions

		https://*.instructure.com/accounts/###/permissions > Course Roles : Teacher > Read SIS data

If you do not want to expose this, you can modify the code to remove Employee identifiers, search the code for **sis_user_id** and **employee_id**

You can also replace it completely with a custom callback or method of your own choice.
