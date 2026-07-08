async function loadAttendanceData() {

    const { data, error: attendanceError } = await myClient
        .from("attendance_records")
        .select(`
            *,
            meetings (
                meeting_name
            )
        `)
        .order("Date", { ascending: false });

    if (attendanceError) {
        console.error("Attendance error:", attendanceError);
        alert(attendanceError.message);
        return [];
    }


    return data.map(record => ({
    ...record,
    MeetingName: record.meetings?.meeting_name ?? "No Meeting"
}));

}