# Admin Tray - Sub Account Menu

If you're a **system administrator** of a Canvas LMS instance with a deep organization of sub accounts you have inevitably found yourself in one of *Dante's 9 Circles of Hell*, repetitively clicking *Sub Accounts* at each and every level as you drill down to where you need to go. Here at CCSD we have over 8,000 sub accounts, and yet this only affects 5 people. So we will share this to help anyone else who is trapped.

The JavaScript and CSS files here add a directory style recursive HTML menu to the Canvas global navigation admin tray...


## In Pictures


Collapsed | Expanded | Search
------------ | ------------- | -------------
![Admin Tray Collapsed](https://s3-us-west-2.amazonaws.com/ccsd-canvas/git-docs/admintray-collapsed.png) | ![Admin Tray Expanded](https://s3-us-west-2.amazonaws.com/ccsd-canvas/git-docs/admintray-expanded.png) | ![Admin Tray Search](https://s3-us-west-2.amazonaws.com/ccsd-canvas/git-docs/admintray-search.png)



## Features & Use


### Configuration
Zero to little configuration is needed. The script will pull the `ENV.DOMAIN_ROOT_ACCOUNT_ID` from Canvas, and upon load will initialize an API call (a loop of x/100) to collect every sub account in your instance, compile a recursive HTML unordered list and store it your browser's `localStorage`.

> Depending on the number of your sub accounts and internet speed, this will take a moment, be patient for the first load, open the tray and wait for it to show up. This takes us about 45-60 seconds.

### Alphabetical Sorting

Yup! As far as I know, the Canvas API does not allow sorting API calls alphabetically during pagination. The entire stack of sub accounts is sorted prior to building the menu.

### Localized Search
Using JavaScript/jQuery to search within the stored HTML, preventing further API calls. You can search the entire sub account menu by name.

### Search Result - Parent Account Skip-to-Depth Display 
*I don't know what else to call it, so here is an explanation.*

Suppose your directory structure looks something like the following, where (#) is the depth of the account.
    
      - High Schools (1)
      - - George Washington HS (2)
      - - - SIS Courses (3)
      - - - - English (4)
      - - - - Math (4)
      - - - - Science (4)
      - - - Course Shells (3)
      - Middle Schools (1)
      - - Betsy Ross MS (2)
      - - - SIS Courses (3)
      - - - - English (4)
      - - - - Math (4)
      - - - Course Shells (3)

When we search for **Science** and get multiple sub accounts of 'Science', we can't identify which one we want to choose.
      
1. Science
2. Science

So if we map the results depth of 4 to it's parent depth at 2 (instead of 3, SIS Courses) we can get a result like:

```javascript
skipd: {
    4: 2
},
```

1. George Washington HS > Science
2. Betsy Ross MS > Science

And both are links to their respective account.

> Note: If you don't define the skip, it will not display a parent

> Note: You can add multiple skips, but each depth must be unique

### Reload
The ↻ button at the bottom right of the menu will clear the menu from localStorage and recompile. Use this when you or other admins have added or removed sub accounts in your instance.


### User Impact

As mentioned above, CCSD has **5 system admins**, with 40,000 Employees and over 300,000 Students. Be kind to your users, use the snippet below to reduce the impact of your **admin-only** tools. A file is also included in the repo.

```javascript
if (ccsd.util.hasAnyRole("admin","root_admin")) {
  $.ajax({
    url:
      "https:///host-on-some.cdn/js/admintray-subaccmenu.js",
    dataType: "script",
    cache: true
  });
}
```

