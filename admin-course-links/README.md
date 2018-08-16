# Admin Course Links
This JavaScript and CSS will modify the administrative course search page and add course-specific links for each course. It is intended to be used in the Canvas Theme Editor, along with any other global changes you make there.


# Preamble
James Jones explains it well.

https://github.com/jamesjonesmath/canvancement/tree/master/courses/admin-course-links


# Theme Version
Since James and I collaborated on this script, back and forth, reviewing each others ideas and knowledge, I made a decision to try and keep it as close to his version as possible for a few of reasons:

- James provided a good example of my original draft without using jQuery. I'm using that for DOM manipulation, because we should learn to avoid jQuery.
- James provided a simpler way of handling the mutations and deciding which 'tasks' were remaining with the mark/wrapperClass.
- James made a point that using a UL and list items is semantically correct for a set of links, and I liked his choices for CSS.

I used what I learned from James and wrote the script in a style that suits my preferences and makes considerations for use within the Canvas Theme Editor instead of as a user script. Some of the syntax I used shortens the length of the file by size and number of characters. I also took this opportunity to show off some additional ES6 features like `template literals`, `const` and `let`, along with `arrow functions`, and iterate with `Object.Keys` instead of using them in a `for loop`.

I did this hoping to provide a comparison for different, but fully reasonable alternatives for different use cases, and that *similar differences can be nearly equivalent*.

## Customization
The default includes the use of the `onPage()` function found here https://github.com/robert-carroll/ccsd-canvas/tree/master/util

***If you don't want to use onPage()***
- remove the onPage line 10
- uncomment line 13
- remove line 30, and make sure you have at least 1 link available in `links`
- fix/swap line 72 using `}` vs `});`

I like onPage(), because it provides a test and callback, allowing the script to gracefully exit on line 30 versus wrapping the whole thing in an `if`. The user script manager helps with this by only executing the script when the conditions of the include are met. `// @include /^https://.*\.instructure\.com/accounts/[0-9]+(\?.*)*$/`

Whereas, if we use James' script as a global theme script, the `linksToAdd`, `wrapperClass`, `wrapperCSS`, `pageRegex` are all set before we test/check if we're on the correct page, because that `@include` would be ignored.

## Links to Add
There is a configuration object at the top that lists which items should appear in the list. By default, it includes links to the People, Grades, and Settings page. There are also links for Analytics, Announcements, Assignments, Discussions, Files, Modules, Outcomes, Pages, Quizzes, and the Syllabus that can be enabled by uncommenting the lines. You can reorder each line to change the order the items appear in.

## CSS
Using James' example, the added links are marked with a class, rc-course-links, also keeping the changes from interfering with Canvas styles.

## Minified
I have provided a minified version of the JavaScript file, reducing the file size to 1KB from 3KB.

The minified version utilizes `onPage()`

## ES6
As mentioned this script utilizes features of ES6.
This shouldn't be a problem if you maintain alignment with Canvas browser compatibility.

https://community.canvaslms.com/docs/DOC-10720-67952720329

https://caniuse.com/#search=es6
