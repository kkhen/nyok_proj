let filteredAttendanceData = [];

function filterTable() {

    const searchText =
        document.getElementById("searchBox").value.toLowerCase();

    const selectedOrganization =
        document.getElementById("organizationFilter").value;

    const selectedDate =
    document.getElementById("dateFilter").value;

    const selectedSchedule =
    document.getElementById("scheduleFilter").value;

    const filtered = attendanceData.filter(record => {

        const matchesSearch =
            record.Name
            .toLowerCase()
            .includes(searchText);

        const matchesOrganization =
            selectedOrganization === "" ||
            record.Organization === selectedOrganization;

        const matchesDate =
            selectedDate === "" ||
            record.Date === selectedDate;

        const matchesSchedule =
    selectedSchedule === "" ||
    record.MeetingName === selectedSchedule;

        const selectedRemarks =
        document.getElementById("remarksFilter").value;

        const matchesRemarks =
    selectedRemarks === "" ||
    record.Remarks === selectedRemarks;

        return matchesSearch && matchesOrganization && matchesDate && matchesSchedule && matchesRemarks;

    });

    filteredAttendanceData = filtered;

    renderTable(filtered);
    updateDashboard(filtered);

}

function loadOrganizationFilter() {

    const organizationFilter =
        document.getElementById("organizationFilter");

    
    organizationFilter.innerHTML =
        `<option value="">All</option>`;

    // Get unique organizations
    const organizations =
        [...new Set(attendanceData.map(record => record.Organization))];

    organizations.sort();

    organizations.forEach(org => {

        organizationFilter.innerHTML +=
            `<option value="${org}">${org}</option>`;

    });

}

function loadDateFilter() {

    const dateFilter =
        document.getElementById("dateFilter");

    dateFilter.innerHTML =
        `<option value="">All</option>`;

    const dates =
        [...new Set(attendanceData.map(record => record.Date))];

    dates.sort().reverse();

    dates.forEach(date => {

        dateFilter.innerHTML +=
            `<option value="${date}">${date}</option>`;

    });

}

function loadScheduleFilter() {

    const scheduleFilter =
        document.getElementById("scheduleFilter");

    scheduleFilter.innerHTML =
        `<option value="">All</option>`;

    const schedules =
        [...new Set(
            attendanceData.map(record => record.MeetingName)
        )];

    schedules.sort();

    schedules.forEach(schedule => {

        if (schedule === "No Meeting") return;

        scheduleFilter.innerHTML +=
            `<option value="${schedule}">${schedule}</option>`;

    });

}

function loadRemarksFilter() {

    const remarksFilter =
        document.getElementById("remarksFilter");

    remarksFilter.innerHTML = `
        <option value="">All</option>
        <option value="Present">Present</option>
        <option value="Late">Late</option>
    `;

}

document.getElementById("searchBox")
.addEventListener("input", filterTable);

document.getElementById("organizationFilter")
.addEventListener("change", filterTable);

document.getElementById("dateFilter")
.addEventListener("change", filterTable);

document.getElementById("scheduleFilter")
.addEventListener("change", filterTable);

document.getElementById("remarksFilter")
.addEventListener("change", filterTable);