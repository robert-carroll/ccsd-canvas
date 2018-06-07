/**
// @name        Canvas LMS - Create a Workroom Button
// @namespace   https://github.com//robert-carroll/ccsd-canvas
// @author      Aaron Leonard <leonaa@nv.ccsd.net> [v1]
// @author      Robert Carroll <carror@nv.ccsd.net> [v1.0.1]
**/
(function() {
    var workroom = {
        cfg: {
            // the ID of the subaccount where all workrooms should be put
            wkrm_acct_id: 123456,
            // the ID of the term that all workrooms should be created with (Forever)
            term_id: 1234,
            // the roles allowed to create a workroom
            roles: ['teacher']
        }
    }
    workroom.alert = function(title, message) {
        $('#enrollAlert').html(message).dialog({
            title: title
        })
    }
    workroom.codedDate = function(date) {
        return date
            .toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
            .replace(/\,\s/g, '_')
            .replace(/\s/g, '')
            .toUpperCase()
            .replace(/AM|PM/, '')
    }
    workroom.getSISID = function() {
        return $.get(
                '/api/v1/courses?per_page=1&enrollment_type=teacher&enrollment_state=active'
            )
            .pipe(function(courses) {
                if (courses.length == 0) {
                    return $.Deferred().reject()
                }
                return $.get('/api/v1/courses/' + courses[0].id + '/enrollments?user_id=self')
            })
            .pipe(function(enroll) {
                if (enroll.length === 0 || !enroll[0].user.sis_user_id) {
                    return $.Deferred().reject()
                }
                return enroll[0].user.sis_user_id
            })
    }
    workroom.enroll = function(employee_id, shortName) {
        // https://*.instructure.com/doc/api/courses.html#method.courses.create
        var DATE_FM = workroom.codedDate(new Date()),
            long_name = 'WORKROOM -- ' + ENV.current_user.display_name + ' -- ' + DATE_FM,
            short_name = 'WKRM-' + shortName,
            course_id = 'WKRM-' + employee_id + '-' + DATE_FM;

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
        return $.ajax({
            url: '/api/v1/accounts/' + workroom.cfg.wkrm_acct_id + '/courses',
            type: 'POST',
            method: 'POST',
            data: data
        }).pipe(
            function(res) {
                window.location = '/courses/' + res.id
            },
            function() {
                workroom.alert(
                    'Error',
                    'There was an error creating the workroom.'
                )
            }
        )
    }
    workroom.init = function() {
        // This initializes the DOM elements necessary for creating a workroom
        var enrollBtn = $('<button>', {
            class: 'btn button-sidebar-wide pull-right',
            id: 'enrollWorkroomBtn',
            style: 'margin-top: 10px;'
        }).text("Create a Workroom");

        var enrollHtml =
            '<div id="enrollWorkroom" style="display: none;"><table class="formtable">'
            + '<tr class="formrow"><td>'
            + '<label>Employee Id:<span>*</span></label>'
            + '</td><td><input type="text" name="employee_id" />'
            + '</td></tr>'
            + '<tr class="formrow"><td>'
            + '<label>Enter Course Short Name:<span>*</span></label>'
            + '</td><td>'
            + '<input type="text" name="short_name" required maxlength="16" />'
            + '</td></tr>'
            + '</table></div>'
            + '<div id="enrollAlert"></div>';

        enrollBtn.prependTo($('.header-bar'));
        $('body').append(enrollHtml);

        enrollBtn.click(function(e) {
            var btn = $(this),
                origTex = btn.text()

            e.preventDefault()

            btn.prop('disabled', true)
                .text('Working...')
                .addClass('btn-primary')

            workroom.getSISID()
                .pipe(
                    function(sis_user_id) {

                        var dfd = $.Deferred();

                        $('#enrollWorkroom :input').val('').prop('disabled', false)
                        $('#enrollWorkroom .formrow').show()

                        $('#enrollWorkroom').dialog({
                            title: 'Create a New Workroom',
                            width: '450',
                            buttons: [{
                                    text: 'Close',
                                    click: function() {
                                        $(this).dialog('close');
                                        dfd.reject();
                                    }
                                },
                                {
                                    text: 'Add Workroom',
                                    class: 'btn-primary',
                                    click: function() {
                                        var employee_id = sis_user_id ? sis_user_id : 'E' + $(this).find('[name=employee_id]').val();
                                        var shortName = $(this).find('[name=short_name]').val();

                                        if (shortName.length < 1) {
                                            workroom.alert('Error', 'Please enter a short name.');
                                            //return dfd.reject();
                                        } else {
                                            dfd.resolve({
                                                employee_id: employee_id,
                                                shortName: shortName
                                            });
                                            $(this).dialog('close');
                                        }
                                    }
                                }
                            ],
                            close: function() {
                                dfd.reject();
                            }
                        });

                        // if sis_user_id is present we don't need to display the field
                        if (sis_user_id) {
                            $('#enrollWorkroom [name=employee_id]')
                                .val(sis_user_id)
                                .prop('disabled', true)
                                .closest('.formrow')
                                .hide();
                        }
                        return dfd;
                    },
                    function() {
                        alert('Something went wrong. We apologize for any inconvenience.');
                    }
                )
                .pipe(function(data) {
                    return workroom.enroll(data.employee_id, data.shortName);
                })
                .done(function() {
                    btn.text('Done!').addClass('btn-success');
                })
                .fail(function() {
                    btn.text(origTex);
                    btn.prop('disabled', false).removeClass('btn-success btn-primary');
                });
        });
    }
    ccsd.util.onPage(/\/courses$/, function() {
        if (ccsd.util.hasAnyRole.apply(this, workroom.cfg.roles)) {
            workroom.init();
        }
    });
})();
