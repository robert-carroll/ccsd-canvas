# Admin Tray - Sub Account Menu

If you're a **system administrator** of a Canvas LMS instance with a deep organization of sub accounts you have inevitably found yourself in one of *Dante's 9 Circles of Hell*, repetitively clicking *Sub Accounts* at each and every level as you drill down to where you need to go. Here at CCSD we have over 8,000 sub accounts, and yet this only affects 5 people. So we will share this to help anyone else who is trapped.

The JavaScript and CSS files here add a directory style recursive HTML menu to the Canvas global navigation admin tray...


## In Pictures


Collapsed | Expanded | Search
------------ | ------------- | -------------
![Admin Tray Collapsed](https://s3-us-west-2.amazonaws.com/ccsd-canvas/git-docs/admintray-collapsed.png) | ![Admin Tray Expanded](https://s3-us-west-2.amazonaws.com/ccsd-canvas/git-docs/admintray-expanded.png) | ![Admin Tray Search](https://s3-us-west-2.amazonaws.com/ccsd-canvas/git-docs/admintray-search.png)


### Configuration & Setup
Zero to little configuration is needed for **admintray-subaccmenu.js**, so I won't even bother explaining `subacctray.cfg`

Option 1
1. Host the file **admintray-subaccmenu.js** on a secure server (https) or somewhere like Amazon S3
2. Copy/append the contents of **admintray-subaccmenu.inc.js** to your Canvas Theme JavaScript file, point the `URL` to the hosted file.

Option 2 (Quick Start)
1. Just copy the example snippet below that uses this repo's version and RawGit 💕 to your Canvas Theme JavaScript file. However, please note that the RawGit URL points to the repo source and any changes to it may affect your usage later. I recommend hosting your own for stability, but this can get you started.

Once loaded the script will initialize an API call (to /api/v1/accounts/self/sub_accounts) and loop through x/100, collecting every sub account in your instance, compile a recursive HTML unordered list and store it your browser's `localStorage`.

> Depending on the number of your sub accounts and internet speed, this will take a moment, be patient for the first load, open the tray and wait for it to show up. This takes us about 45-60 seconds on production. You will see a loading indicator in the Admin Tray while it compiles.


## Features & Use


### Instance Independent

There are some users (like Instructure Canvas Remote Admins) who may login to multiple Canvas Instances/institutions, so each menu will be stored in localStorage based on the uniqueness of **x**.instructure.com, including **x.beta**.instructure.com, **x.test**.instructure.com, and **xyz**.instructure.com.

For most users and institutions this will go mostly unnoticed unless you have different sub accounts between your Production, Test and Beta environments. I made this update to help those users it will affect. I also personally hate copying, pasting or replicating files just to change 1 line. This update allows 1 file to be hosted on a CDN like Amazon S3 and simply change the `var show_results_parent` value in **admintray-subaccmenu.inc.js** or leave it blank.

Therefore an already minified file has been provided in the repo.


### Alphabetical Sorting

Yup! As far as I know, the Canvas API does not allow sorting API calls alphabetically during pagination. The entire stack of sub accounts is sorted prior to building the menu.

### Localized Search

Using JavaScript and jQuery to search within the stored HTML, preventing further API calls. You can search the entire sub account menu by name.


### Search Result - Prefix Parent Account (Skip-to-Depth Display)
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

1. George Washington HS > Science
2. Betsy Ross MS > Science

#### Examples
```javascript
// one skip
show_results_parent = { 4:2 }
// expected result:
// George Washington HS > Science

// or multiple skips, must be unique
show_results_parent = { 4:2, 3:2 }
// expected results:
// (4:2) George Washington HS > Science
// (3:2) George Washington HS > SIS Courses
```

And both are links to their respective account.

> Note: If you don't define the skip, it will not display a parent


### Reload

The ↻ button at the bottom right of the menu will clear the menu from localStorage and recompile it for the current Canvas instance. Use this when you or other admins have added or removed sub accounts.


### User Impact & Include Snippet

As mentioned above, CCSD has **5 system admins**, with 40,000 Employees and over 300,000 Students. Be kind to your users, use the snippet below to reduce the impact of your **admin-only** tools. This is included in the repo as **admintray-subaccmenu.inc.js**

```javascript
if (ccsd.util.hasAnyRole('admin','root_admin')) {
  // used for search results, result:parent, see documentation for more details
  var show_results_parent = {}
  // async load the sub account menu script
  $.ajax({
    url: 'https://cdn.rawgit.com/robert-carroll/ccsd-canvas/master/admintray-subaccmenu/admintray-subaccmenu.min.js',
    dataType: 'script',
    cache: true,
    data: {skipd: JSON.stringify(show_results_parent)}
  })
}
```

