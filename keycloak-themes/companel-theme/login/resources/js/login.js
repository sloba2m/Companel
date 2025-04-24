document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-password-toggle]').forEach((btn) => {
    const input = document.getElementById(btn.getAttribute('aria-controls'));
    const iconShow = btn.querySelector('.icon-show');
    const iconHide = btn.querySelector('.icon-hide');

    btn.addEventListener('click', () => {
      const isVisible = input.getAttribute('type') === 'text';
      iconShow.style.display = isVisible ? 'inline' : 'none';
      iconHide.style.display = isVisible ? 'none' : 'inline';
    });
  });
});
