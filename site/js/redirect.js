const destination = new URL('https://dvoineu.github.io/Frazia/');
destination.search = window.location.search;
destination.hash = window.location.hash;
if (destination.search || destination.hash) {
  document.querySelectorAll('[data-destination]').forEach((link) => {
    link.href = destination.href;
  });
}
window.location.replace(destination.href);
