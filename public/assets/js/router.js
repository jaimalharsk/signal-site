(() => {
  const title = document.querySelector('[data-title-link]');
  if (title) {
    title.addEventListener('click', () => {
      window.location.href = '/portfolio.html';
    });
  }
})();
