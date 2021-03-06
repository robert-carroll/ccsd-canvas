# Course Add People Modal

As we continue to respond to the addition of React components in Canvas, we find a need to revise and improve our mutation observers. Each time these break we look for more refined ways of catching the mutation we want to target and update.

The JavaScript file provided here is probably not a one size fits all solution, but can help other institutions address removing or adding elements to the Add People Modal. [Here's a community thread where this is discussed.](https://community.canvaslms.com/thread/15837-customizing-add-people-dialog-with-custom-javascript)

Our version adds an alert to the modal informing staff not to Enroll students as anything but the student role. This would be a FERPA violation as students would have access to the gradebook and other student information. We're aware this is an entirely superficial 'bandaid', it just provides a reminder. We also address this by unenrolling K-12 students who end up as teachers nightly with Canvas Data. [Here's a query for that in the community](https://community.canvaslms.com/message/112296-re-custom-javascript-for-admincourses-page#comment-111957)
![Course Add People Modal](https://s3-us-west-2.amazonaws.com/ccsd-canvas/git-docs/add-people-modal.png) 
