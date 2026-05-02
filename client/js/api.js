// Base API utility
const BASE_URL = "http://localhost:6000/api"

const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("rbac_token")
    const headers = { "Content-Type": "application/json", ...options.headers }
    if (token) headers["Authorization"] = `Bearer ${token}`

    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
        const err = new Error(data.message || "Request failed")
        err.status = res.status
        err.data = data
        throw err
    }
    return data
}

// Auth
const api = {
    login:    (body) => apiFetch("/auth/login",    { method: "POST", body: JSON.stringify(body) }),
    register: (body) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    getMe:    ()     => apiFetch("/auth/me"),

    // Users
    getUsers:   ()         => apiFetch("/users"),
    getUser:    (id)       => apiFetch(`/users/${id}`),
    createUser: (body)     => apiFetch("/users",      { method: "POST",   body: JSON.stringify(body) }),
    updateUser: (id, body) => apiFetch(`/users/${id}`,{ method: "PUT",    body: JSON.stringify(body) }),
    deleteUser: (id)       => apiFetch(`/users/${id}`,{ method: "DELETE" }),

    // Roles
    getRoles:   ()         => apiFetch("/roles"),
    getRole:    (id)       => apiFetch(`/roles/${id}`),
    createRole: (body)     => apiFetch("/roles",      { method: "POST",   body: JSON.stringify(body) }),
    updateRole: (id, body) => apiFetch(`/roles/${id}`,{ method: "PUT",    body: JSON.stringify(body) }),
    deleteRole: (id)       => apiFetch(`/roles/${id}`,{ method: "DELETE" }),

    // Admin seed
    seed: () => apiFetch("/admin/seed", { method: "POST" })
}

window.api = api
