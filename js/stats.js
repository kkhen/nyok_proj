function updateDashboard(records) {

    console.log("Dashboard records:", records.length);

    document.getElementById("totalRecords").textContent =
        records.length;

    document.getElementById("presentCount").textContent =
        records.filter(r => r.Remarks === "Present").length;

    document.getElementById("lateCount").textContent =
        records.filter(r => r.Remarks === "Late").length;

    const selectedOrganization =
    document.getElementById("organizationFilter").value;

document.getElementById("organizationCount").textContent =
    selectedOrganization === ""
        ? "All"
        : selectedOrganization;

}