const API_BASE_URL = "http://localhost:5036/api";

export const getUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error("Kullanıcılar getirilemedi");
    return await response.json();
};

export const addUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error("Kullanıcı eklenemedi");
    return await response.json();
};