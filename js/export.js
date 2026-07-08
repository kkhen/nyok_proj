document
    .getElementById("exportCsvBtn")
    .addEventListener("click", exportCsv);

    function exportCsv() {

    if (filteredAttendanceData.length === 0) {

        alert("There are no records to export.");
        return;

    }

    const headers = [
    "Name",
    "Organization",
    "Date",
    "Meeting",
    "Time In",
    "Remarks"
];

const rows = filteredAttendanceData.map(record => [

    record.Name,
    record.Organization,
    record.Date,
    record.meetings?.meeting_name ?? "",
    new Date(record.Time_In).toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }),
    record.Remarks

]);

const csvContent = [

    headers.join(","),

    ...rows.map(row => row.join(","))

].join("\n");

const blob = new Blob(
    [csvContent],
    { type: "text/csv;charset=utf-8;" }
);

const url = URL.createObjectURL(blob);

const link = document.createElement("a");

link.href = url;

link.download =
    `Attendance_${new Date().toISOString().split("T")[0]}.csv`;

document.body.appendChild(link);

link.click();

document.body.removeChild(link);

URL.revokeObjectURL(url);

}