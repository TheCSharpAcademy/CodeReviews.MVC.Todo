const themeSwitcher = document.querySelector('.light-theme-button');
const theme = document.body;

themeSwitcher.addEventListener('click', () => {
  themeSwitch();
});

function themeSwitch() {
  if (themeSwitcher.classList.contains('dark-theme-button')) {
    themeSwitcher.classList.remove('dark-theme-button');
    theme.classList.remove('light-theme');
  } else {
    themeSwitcher.classList.add('dark-theme-button');
    theme.classList.add('light-theme');
  }
}