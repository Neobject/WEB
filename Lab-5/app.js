const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: name.value,
    email: email.value,
    age: Number(age.value),
    comment: comment.value,
  };

  localStorage.setItem("lastUser", JSON.stringify(payload));

  try {
    const res = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    alert("Saved!");
  } catch {
    alert("Server unavailable");
  }
});
