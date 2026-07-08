(async () => {

    const session = await requireLogin();

    if (!session) return;

    const organizations = await loadOrganizations();

    const meetings = await loadMeetings();

const meetingDropdown =
    document.getElementById("schedule");

meetings.forEach(meeting => {

    meetingDropdown.innerHTML += `
        <option value="${meeting.id}">
            ${meeting.meeting_name}
        </option>
    `;

});

    const organizationDropdown =
        document.getElementById("organization");

    organizations.forEach(org => {

    organizationDropdown.innerHTML +=
        `<option value="${org.org_name}">
            ${org.org_name}
        </option>`;

    

});

    document.getElementById("name").value =
    session.user.user_metadata.full_name;

    document.getElementById("date").value =
    new Date().toISOString().split("T")[0];

    document.getElementById("email").value =
    session.user.email;

})();

document.getElementById("logoutBtn").addEventListener("click", logout);


