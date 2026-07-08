function renderTable(records) {

    const tbody = document.querySelector("#attendanceTable tbody");

    tbody.innerHTML = "";

    records.forEach(record => {

        const timeOnly = new Date(record.Time_In)
            .toLocaleTimeString("en-PH", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            });

        tbody.innerHTML += `
            <tr>
                <td>${record.Name}</td>
                <td>${record.Organization}</td>
                <td>${record.Date}</td>
                <td>${record.MeetingName}</td>
                <td>${timeOnly}</td>
                <td>${record.Remarks}</td>
            </tr>
        `;

    });

}