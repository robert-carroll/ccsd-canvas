# Utilities

These are utility functions used within our code. Many of the customizations and hacks in this repository reference these snippets.
I am placing these here, as I am not going to change or copy/paste them into each feature that use them, or inline credit comment everywhere they are used.

If you use the code without these utilities, you will see `[Uncaught ReferenceError: ccsd is not defined]` for `[ccsd.util]` functions.

> There are more, but these are currently necessary for the repository

> Feel free to rename the "ccsd" namespace to whatever you like


## onPage() & hasAnyRole()

Originally presented by @RyanFlorence for InstructureCon 2013.

[Best Practices for Using Global Javascript | InstructureCon 2013](https://www.youtube.com/watch?v=ag6mxnBMTnQ)

https://gist.github.com/ryanflorence/5817898


## addMenuButton()

```javascript
if (ccsd.util.hasAnyRole("teacher")) {
  ccsd.util.addMenuButton(
    "CCSD Hub",
    "https://ccsd.instructure.com/courses/123456",
    "https://s3.aws/branding/images/ccsd-community-icon.svg"
  );
}
```
