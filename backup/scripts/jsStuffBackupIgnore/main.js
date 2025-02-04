document.addEventListener('DOMContentLoaded', function() {
    const switchLabels = document.querySelectorAll('.switch-label');
    const pages = document.querySelectorAll('.page');

    switchLabels.forEach(label => {
        label.addEventListener('click', function() {
            const target = this.getAttribute('data-target');

            pages.forEach(page => {
                page.classList.remove('active');
                if (page.classList.contains(target)) {
                    page.classList.add('active');
                }
            });
        });
    });

    // Initialize with login page active
    document.querySelector('.login-page').classList.add('active');
});
