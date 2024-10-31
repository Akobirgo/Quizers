window.addEventListener("DOMContentLoaded", (e) => {
  const navbar = document.querySelector(".navbar-scroll");

  const btnMenus = document.querySelectorAll(".btn-menu");
  const menuToggle = document.querySelector(".menu-toggle");

  let isMenuToggled = false;

  const DEFAULT_MENU_TOP_LENGTH = "50px";

  if (window.scrollY > 60) {
    navbar.classList.remove("d-none");
    menuToggle.style.top = DEFAULT_MENU_TOP_LENGTH;
  }
  let rectButton = document
    .querySelector(".btn-menu-main")
    .getBoundingClientRect();
  let rectBody = document.body.getBoundingClientRect();

  if (window.scrollY > 60) {
    menuToggle.style.top = DEFAULT_MENU_TOP_LENGTH;
  } else {
    menuToggle.style.top = `${rectButton.bottom + 6}px`;
  }

  menuToggle.style.right = `${
    rectBody.right - rectButton.left - rectButton.width
  }px`;

  btnMenus.forEach((btn) =>
    btn.addEventListener("click", () => {
      if (isMenuToggled) {
        menuToggle.classList.add("d-none");
        isMenuToggled = !isMenuToggled;

      } else {
        menuToggle.classList.remove("d-none");
        isMenuToggled = !isMenuToggled;
      }
    })
  );

  document.addEventListener("scroll", (e) => {
    rectButton = document
      .querySelector(".btn-menu-main")
      .getBoundingClientRect();

    if (window.scrollY > 60) {
      navbar.classList.remove("d-none");
      menuToggle.style.top = DEFAULT_MENU_TOP_LENGTH;
    } else {
      navbar.classList.add("d-none");
      menuToggle.style.top = `${rectButton.bottom + 6}px`;
    }
  });

  window.addEventListener("resize", (e) => {
    rectButton = document
      .querySelector(".btn-menu-main")
      .getBoundingClientRect();

    rectBody = document.body.getBoundingClientRect();

    if (window.scrollY > 60) {
      menuToggle.style.top = DEFAULT_MENU_TOP_LENGTH;
    } else {
      menuToggle.style.top = `${rectButton.bottom + 6}px`;
    }
    menuToggle.style.right = `${
      rectBody.right - rectButton.left - rectButton.width
    }px`;
  });
});
