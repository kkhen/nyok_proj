document
    .getElementById("clearAttendanceBtn")
    .addEventListener("click", clearAttendanceRecords);

    async function clearAttendanceRecords() {

    const confirmation = prompt(
        "WARNING!\n\nThis will permanently delete ALL attendance records.\n\nType DELETE to continue."
    );

    if (confirmation === null) {
        return;
    }

    if (confirmation !== "DELETE") {

        alert("Deletion cancelled.");

        return;

    }

    const { error } = await myClient
    .rpc("clear_attendance_records");

    if (error) {

    console.error(error);

    alert(error.message);

    return;
}

await refreshAttendancePage();

alert("All attendance records have been deleted.");

}