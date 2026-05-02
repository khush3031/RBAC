// Permission helper — reads from in-memory store populated after login
const _perms = {
    list: [],
    role: null
}

const permission = {
    /** Populate from login/me response */
    set(permissions, roleCode) {
        _perms.list = permissions || []
        _perms.role = roleCode || null
    },

    /** Load from localStorage (on page refresh) */
    load() {
        try {
            const stored = localStorage.getItem("rbac_perms")
            if (stored) _perms.list = JSON.parse(stored)
            _perms.role = localStorage.getItem("rbac_role") || null
        } catch { _perms.list = [] }
    },

    /** Save to localStorage */
    save() {
        localStorage.setItem("rbac_perms", JSON.stringify(_perms.list))
        if (_perms.role) localStorage.setItem("rbac_role", _perms.role)
    },

    /** Clear */
    clear() {
        _perms.list = []
        _perms.role = null
        localStorage.removeItem("rbac_perms")
        localStorage.removeItem("rbac_role")
    },

    /** Check if user has a permission */
    can(perm) {
        return _perms.list.includes(perm)
    },

    /** Check if user is admin */
    isAdmin() {
        return _perms.role === "ADMIN"
    },

    /**
     * Hide elements with [data-permission="role:create"] if user lacks that permission.
     * Also handles [data-admin-only] elements.
     */
    applyToDOM() {
        document.querySelectorAll("[data-permission]").forEach(el => {
            const perm = el.getAttribute("data-permission")
            if (!permission.can(perm)) el.style.display = "none"
        })
        document.querySelectorAll("[data-admin-only]").forEach(el => {
            if (!permission.isAdmin()) el.style.display = "none"
        })
    }
}

window.permission = permission
