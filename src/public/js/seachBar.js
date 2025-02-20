// SEARCH BAR

const searchBar = document.querySelector(".searchBar");
const searchInput = document.querySelector(".searchBar input");
const overlayInfos = document.querySelector(".overlayInfos");

searchBar.addEventListener("click", () => {
  searchBar.classList.add("open");
  overlayInfos.style.display = "block";
  overlayInfos.style.opacity = "1";
  searchInput.focus();
});

document.addEventListener("click", (event) => {
  if (
    !searchBar.contains(event.target) &&
    searchBar.classList.contains("open")
  ) {
    searchBar.classList.add("closing");
    overlayInfos.style.opacity = "0";

    setTimeout(() => {
      searchBar.classList.remove("open", "closing");
      overlayInfos.style.display = "none";
    }, 300);
  }
});
