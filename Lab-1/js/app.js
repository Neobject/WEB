function loadData(source, buttonId, outputId) {
  document.getElementById(buttonId).addEventListener("click", async () => {
    const output = document.getElementById(outputId);
    output.style.display = "block";
    output.textContent = "Завантаження...";
    try {
      const res = await fetch(source);
      const data = await res.json();
      output.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
      output.textContent = "Помилка завантаження: " + e.message;
    }
  });
}

// Підключаємо всі три API
loadData("https://jsonplaceholder.typicode.com/users/1", "loadUser", "outputUser");
loadData("https://jsonplaceholder.typicode.com/posts/1", "loadPost", "outputPost");
loadData("https://jsonplaceholder.typicode.com/albums/1", "loadAlbum", "outputAlbum");

// Кнопка "нагору"
const up = document.getElementById("up");
window.addEventListener("scroll", () => {
  up.style.display = window.scrollY > 200 ? "block" : "none";
});
