/**
// @name        Admin Course Links
// @namespace   https://github.com/robert-carroll/ccsd-canvas
// @author      Robert Carroll <robert.c@nv.ccsd.net>
**/

(function() {
    'use strict';

    onPage(/^\/accounts\/\d+$/, function() {

    // use this -if- you don't want to include onPage, check line 30 and 72
    //if(/^\/accounts\/\d+$/.test(window.location.pathname)) {

        var links = {
            'users' : 'People',
            'grades' : 'Grades',
            'settings': 'Settings',
            // 'analytics' : 'Analytics',
            // 'announcements' : 'Announcements',
            // 'assignments' : 'Assignments',
            // 'discussion_topics' : 'Discussions',
            // 'files' : 'Files',
            // 'modules' : 'Modules',
            // 'outcomes':'Outcomes',
            // 'pages':'Pages',
            // 'quizzes':'Quizzes',
            // 'assignments/syllabus' : 'Syllabus',
        };
        if(Object.keys(links).length <= 0) return;

        const el = 'tbody[data-automation="courses list"] tr td:nth-child(2)';
        const mark = 'rc-course-links';
        const courses = () => {
            let targets = document.querySelectorAll(`${el} > a`),
                count = targets.length;
            let marked = document.querySelectorAll(`${el}  > a + .${mark}`);
            let child, parent;
            if (targets.length > marked.length) {
                for (let i = 0; i < count; i++) {
                    if (!targets[i].querySelector('.' + mark)) {
                        child = addLinks(targets[i].href);
                        parent = targets[i].parentNode;
                        if (parent && child) {
                            parent.appendChild(child);
                        }
                    }
                }
            }
        };
        
        const addLinks = (base) => {
            let div = document.createElement('div');
            div.classList.add(mark);
            let ul = document.createElement('ul'), item, a;
            Object.keys(links).forEach(function(key) {
                item = document.createElement('li');
                a = document.createElement('a');
                a.href = `${base}/${key}`;
                a.textContent = links[key];
                item.appendChild(a);
                ul.appendChild(item);
            });
            div.append(ul);
            return div;
        };
        
        const watch = document.getElementById('content');
        const observer = new MutationObserver(courses);
        observer.observe(watch, { childList: true, subtree: true });
        courses();
    }); //}
})();