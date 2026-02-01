const BASE_URL = "https://jsonplaceholder.typicode.com";

export async function fetchUsers() {
  try {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error("Помилка завантаження користувачів");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
