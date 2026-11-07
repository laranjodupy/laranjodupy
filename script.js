const filters = document.querySelector('.filters');
const filterButtons = filters.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('[data-category]');
const filterStatus = document.querySelector('#filter-status');

filters.hidden = false;

filters.addEventListener('click', (event) => {
  const selected = event.target.closest('[data-filter]');
  if (!selected || selected.getAttribute('aria-pressed') === 'true') return;

  for (const button of filterButtons) {
    button.setAttribute('aria-pressed', String(button === selected));
  }

  const category = selected.dataset.filter;
  let visible = 0;
  for (const project of projects) {
    const matches = category === 'todos' || project.dataset.category.split(' ').includes(category);
    project.hidden = !matches;
    if (matches) visible++;
  }

  const label = visible === 1 ? 'projeto exibido' : 'projetos exibidos';
  filterStatus.textContent = `${visible} ${label} em ${selected.textContent}.`;
});
