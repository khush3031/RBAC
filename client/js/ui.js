// UI helpers: toast, modal, loading

/* ── Toast ─────────────────────────────────────────────────────── */
const ui = {
    toast(message, type = "info", duration = 3500) {
        let container = document.getElementById("toast-container")
        if (!container) {
            container = document.createElement("div")
            container.id = "toast-container"
            document.body.appendChild(container)
        }
        const icons = { success: "✅", error: "❌", info: "ℹ️" }
        const t = document.createElement("div")
        t.className = `toast ${type}`
        t.innerHTML = `<span>${icons[type] || "ℹ️"}</span><span>${message}</span>`
        container.appendChild(t)
        setTimeout(() => {
            t.classList.add("hide")
            t.addEventListener("animationend", () => t.remove())
        }, duration)
    },

    /* ── Modal ───────────────────────────────────────────────────── */
    openModal(id) {
        const m = document.getElementById(id)
        if (m) m.classList.add("open")
    },

    closeModal(id) {
        const m = document.getElementById(id)
        if (m) m.classList.remove("open")
    },

    /** Wire all .modal-close buttons */
    initModals() {
        document.querySelectorAll(".modal-close, [data-close-modal]").forEach(btn => {
            btn.addEventListener("click", () => {
                const overlay = btn.closest(".modal-overlay")
                if (overlay) overlay.classList.remove("open")
            })
        })
        document.querySelectorAll(".modal-overlay").forEach(overlay => {
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) overlay.classList.remove("open")
            })
        })
    },

    /* ── Button loading state ────────────────────────────────────── */
    setLoading(btn, loading, label = "Save") {
        if (loading) {
            btn.disabled = true
            btn._label = btn.innerHTML
            btn.innerHTML = `<span class="loader"></span>`
        } else {
            btn.disabled = false
            btn.innerHTML = btn._label || label
        }
    },

    /* ── Render sidebar user info ────────────────────────────────── */
    renderSidebarUser() {
        const name = localStorage.getItem("rbac_name") || "User"
        const role = localStorage.getItem("rbac_role") || ""
        const nameEl = document.getElementById("sidebar-user-name")
        const roleEl = document.getElementById("sidebar-user-role")
        const avatarEl = document.getElementById("sidebar-avatar")
        if (nameEl) nameEl.textContent = name
        if (roleEl) roleEl.textContent = role
        if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase()
    },

    /* ── Highlight active nav link ───────────────────────────────── */
    setActiveNav() {
        const current = window.location.pathname.split("/").pop()
        document.querySelectorAll(".nav-link").forEach(link => {
            const href = link.getAttribute("href") || ""
            link.classList.toggle("active", href.includes(current) && current !== "")
        })
    },

    /* ── Confirm dialog ──────────────────────────────────────────── */
    confirm(message) {
        return window.confirm(message)
    }
}

window.ui = ui
