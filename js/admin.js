// --- Premium Light/Dark Mode Logic ---
const currentTheme = localStorage.getItem("theme");

// Instantly apply the saved theme on page load to prevent flashing
if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
}

document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const isDark = document.documentElement.getAttribute("data-theme") === "dark";
            if (isDark) {
                // Switch to Light Mode
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem("theme", "light");
            } else {
                // Switch to Dark Mode
                document.documentElement.setAttribute("data-theme", "dark");
                localStorage.setItem("theme", "dark");
            }
        });
    }
});
// -------------------------------------

let attendanceData = [];

async function refreshAttendancePage() {

    attendanceData = await loadAttendanceData();
    filteredAttendanceData = attendanceData;

    loadOrganizationFilter();
    loadDateFilter();
    loadScheduleFilter();
    loadRemarksFilter();

    renderTable(attendanceData);
    updateDashboard(attendanceData);

}

(async () => {

    // Check if user is logged in
    const session = await requireLogin();

    if (!session) return;

    // Check user's role
    const { data: user, error } = await myClient
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

    if (error) {
        console.error("User lookup error:", error);
        showToast(error.message, "error"); // Upgraded from native alert
        return;
    }

    if (user.role !== "admin") {
        window.location.href = "dashboard.html";
        return;
    }

    // LOADING OF ATTENDANCE RECORDS
    await refreshAttendancePage();

    const meetings = await loadMeetingsTable();
    renderMeetingsTable(meetings);

    const orgs = await loadOrgsTable();
    renderOrgsTable(orgs);

    // --- NEW PREMIUM LOGOUT INTERCEPTOR ---
    document.getElementById("logoutBtn").addEventListener("click", async () => {
        const isConfirmed = await showLogoutModal();
        if (isConfirmed) {
            await logout(); // Calls your existing logout function from auth.js
        }
    });
})();

// --- Premium Custom Logout Dialog Logic ---
function showLogoutModal() {
    return new Promise((resolve) => {
        const modal = document.getElementById("logoutModal");
        const confirmBtn = document.getElementById("confirmLogoutBtn");
        const cancelBtn = document.getElementById("cancelLogoutBtn");

        // Reveal the modal
        modal.classList.add("show");

        // Cleanup function to hide modal and return the result
        const cleanup = (result) => {
            modal.classList.remove("show");
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
            resolve(result);
        };

        // Resolve true if Log Out is clicked, false if Cancel is clicked
        confirmBtn.onclick = () => cleanup(true);
        cancelBtn.onclick = () => cleanup(false);
    });
}