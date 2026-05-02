// Route guard & auth helpers

const auth = {
    /** Pages that don't require authentication */
    publicPages: ["login.html", "register.html", "index.html", ""],

    /** Redirect to login if no token; redirect to dashboard if already logged in */
    guard() {
        const page = window.location.pathname.split("/").pop()
        const token = localStorage.getItem("rbac_token")
        const isPublic = auth.publicPages.includes(page)

        if (!token && !isPublic) {
            window.location.href = "login.html"
            return false
        }
        if (token && (isPublic || page === "")) {
            window.location.href = "dashboard.html"
            return false
        }
        return true
    },

    /** Login: call API, store token + metadata */
    async login(email, password) {
        const res = await window.api.login({ email, password })
        const user = res.data
        localStorage.setItem("rbac_token",  user.token)
        localStorage.setItem("rbac_user_id", user._id)
        localStorage.setItem("rbac_name",   user.name)
        localStorage.setItem("rbac_role",   user.role?.code || "")
        localStorage.setItem("rbac_role_id", user.role?._id || "")
        window.permission.set(user.permissions, user.role?.code)
        window.permission.save()
        return user
    },

    /** Register */
    async register(data) {
        const res = await window.api.register(data)
        return res.data
    },

    /** Logout: clear everything */
    logout() {
        localStorage.clear()
        window.permission.clear()
        window.location.href = "login.html"
    },

    /** Fetch current user profile */
    async getMe() {
        const res = await window.api.getMe()
        // Refresh permissions in memory
        window.permission.set(res.data.permissions, res.data.role?.code)
        window.permission.save()
        return res.data
    },

    /** Get stored user ID */
    getUserId() {
        return localStorage.getItem("rbac_user_id")
    }
}

window.auth = auth

// Auto-run guard on every page load
document.addEventListener("DOMContentLoaded", () => {
    // Load permissions from localStorage first
    if (window.permission) window.permission.load()

    const allowed = auth.guard()
    if (!allowed) return

    // Initialise UI chrome on authenticated pages
    if (window.ui) {
        window.ui.renderSidebarUser()
        window.ui.setActiveNav()
        window.ui.initModals()
    }

    // Apply DOM permission gates
    if (window.permission) window.permission.applyToDOM()

    // Wire logout button
    const logoutBtn = document.getElementById("logout-btn")
    if (logoutBtn) logoutBtn.addEventListener("click", () => auth.logout())
})
