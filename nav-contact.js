/* Nav contact popover: toggle open/closed, close on outside click or Escape,
 * submit name+email straight to Supabase via CTSG.signUp. Shared across every
 * page since the header markup (and this button) is duplicated on each one. */
(function () {
    'use strict';

    document.querySelectorAll('.nav-contact-item').forEach(function (item) {
        var toggle = item.querySelector('.nav-contact-toggle');
        var panel = item.querySelector('.nav-contact-panel');
        var form = item.querySelector('form');
        var status = item.querySelector('.nav-contact-status');
        var emailField = item.querySelector('input[type="email"]');
        var nameField = item.querySelector('input[type="text"]');
        var submit = form.querySelector('button[type="submit"]');

        function close() {
            panel.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
        }

        function open() {
            panel.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');
            emailField.focus();
        }

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (panel.hidden) { open(); } else { close(); }
        });

        document.addEventListener('click', function (e) {
            if (!panel.hidden && !item.contains(e.target)) { close(); }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !panel.hidden) {
                close();
                toggle.focus();
            }
        });

        if (!window.CTSG) { return; }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var email = emailField.value.trim();
            if (email.indexOf('@') < 1 || email.indexOf('.', email.indexOf('@')) < 0) {
                status.textContent = 'That does not look like an email address.';
                status.className = 'nav-contact-status is-error';
                emailField.focus();
                return;
            }

            submit.disabled = true;
            status.textContent = 'Sending…';
            status.className = 'nav-contact-status';

            CTSG.signUp(email, nameField.value.trim(), 'nav-contact')
                .then(function (result) {
                    form.hidden = true;
                    status.textContent = result.duplicate
                        ? 'Already have your info — I will be in touch.'
                        : 'Thanks — I will be in touch.';
                    status.className = 'nav-contact-status is-ok';
                })
                .catch(function () {
                    submit.disabled = false;
                    status.textContent = 'Something went wrong. Please try again in a moment.';
                    status.className = 'nav-contact-status is-error';
                });
        });
    });
}());
