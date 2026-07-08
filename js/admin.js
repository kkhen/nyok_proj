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
    alert(error.message);
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

    document.getElementById("logoutBtn").addEventListener("click", logout);
})();



