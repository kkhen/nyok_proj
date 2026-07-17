// Pagination State
let currentOrgPage = 1;
let orgRowsPerPage = 5;
let currentOrgsList = [];
let orgSortAsc = true; // Tracks the current sort direction

// --- Accordion UI Logic ---
document.getElementById("orgToggleBtn").addEventListener("click", () => {
    const content = document.getElementById("orgContent");
    const icon = document.getElementById("orgToggleIcon");
    
    // Toggle the premium slide class instead of hardcoding the style
    content.classList.toggle("open");
    
    // Rotate the chevron arrow smoothly
    if (content.classList.contains("open")) {
        icon.style.transform = "rotate(180deg)";
    } else {
        icon.style.transform = "rotate(0deg)";
    }
});

// --- Premium Column Sorting Logic ---
document.getElementById("sortOrgName").addEventListener("click", () => {
    const icon = document.getElementById("orgSortIcon");
    
    if (orgSortAsc) {
        // Sort Z to A
        currentOrgsList.sort((a, b) => b.org_name.localeCompare(a.org_name));
        icon.style.transform = "rotate(180deg)"; // Flip icon up
    } else {
        // Sort A to Z
        currentOrgsList.sort((a, b) => a.org_name.localeCompare(b.org_name));
        icon.style.transform = "rotate(0deg)"; // Flip icon down
    }
    
    orgSortAsc = !orgSortAsc; // Toggle the state for the next click
    currentOrgPage = 1; // Reset pagination to page 1 to prevent getting lost
    renderOrgsTableBody(); // Instantly redraw the table!
});

async function loadOrgsTable() {
    const { data, error } = await myClient
        .from("organization") // Check DB table name
        .select("*")
        .order("org_name");

    if (error) {
        console.error(error);
        showToast(error.message, "error");
        return [];
    }
    return data;
}

function renderOrgsTable(orgs) {
    currentOrgsList = orgs;
    
    const rppSelect = document.getElementById("orgRowsPerPage").value;
    orgRowsPerPage = rppSelect === "all" ? currentOrgsList.length : parseInt(rppSelect);

    const maxPage = Math.ceil(currentOrgsList.length / orgRowsPerPage);
    if (currentOrgPage > maxPage && maxPage > 0) currentOrgPage = maxPage;
    if (currentOrgPage === 0 && maxPage > 0) currentOrgPage = 1;

    renderOrgsTableBody();
}

function renderOrgsTableBody() {
    const tbody = document.querySelector("#orgsTable tbody");
    tbody.innerHTML = "";

    if (currentOrgsList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="2" style="text-align: center; padding: 32px; color: #6b7280;">No organizations found.</td></tr>`;
        updateOrgPaginationInfo(0, 0);
        return;
    }

    const startIndex = (currentOrgPage - 1) * orgRowsPerPage;
    const endIndex = Math.min(startIndex + orgRowsPerPage, currentOrgsList.length);
    const recordsToShow = currentOrgsList.slice(startIndex, endIndex);

    recordsToShow.forEach(org => {
        tbody.innerHTML += `
            <tr>
                <td>${org.org_name}</td>
                <!-- Rolling Cylinder Action Column for Organizations -->
                <td style="vertical-align: middle; text-align: right;">
                    <div class="roll-action-group">
                        
                        <!-- Premium Edit Icon Button (Logic Safe) -->
                        <button class="roll-btn roll-edit editOrg" data-id="${org.id}" data-name="${org.org_name}" title="Edit Organization">
                            <div class="roll-content">
                                <span class="roll-text">EDIT</span>
                                <svg class="roll-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                            </div>
                        </button>
                        
                        <!-- Premium Delete Icon Button (Logic Safe) -->
                        <button class="roll-btn roll-delete deleteOrg" data-id="${org.id}" data-name="${org.org_name}" title="Delete Organization">
                            <div class="roll-content">
                                <span class="roll-text">DELETE</span>
                                <svg class="roll-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </div>
                        </button>
                        
                    </div>
                </td>
            </tr>
        `;
    });

    // Wire up both buttons!
    document.querySelectorAll(".deleteOrg").forEach(button => {
        button.addEventListener("click", deleteOrg);
    });
    document.querySelectorAll(".editOrg").forEach(button => {
        button.addEventListener("click", editOrg);
    });

    updateOrgPaginationInfo(startIndex, endIndex);
}

function updateOrgPaginationInfo(startIndex, endIndex) {
    const total = currentOrgsList.length;
    const infoDiv = document.getElementById("orgPaginationInfo");
    const indicator = document.getElementById("orgPageIndicator");
    const prevBtn = document.getElementById("prevOrgPageBtn");
    const nextBtn = document.getElementById("nextOrgPageBtn");

    if (total === 0) {
        infoDiv.textContent = "Showing 0 to 0 of 0 entries";
        indicator.textContent = "Page 1 of 1";
        prevBtn.disabled = true; nextBtn.disabled = true;
        return;
    }

    infoDiv.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${total} entries`;
    const maxPage = Math.ceil(total / orgRowsPerPage);
    indicator.textContent = `Page ${currentOrgPage} of ${maxPage}`;

    prevBtn.disabled = currentOrgPage === 1;
    nextBtn.disabled = currentOrgPage === maxPage;
}

// --- Event Listeners ---
document.getElementById("orgRowsPerPage").addEventListener("change", (e) => {
    const val = e.target.value;
    orgRowsPerPage = val === "all" ? currentOrgsList.length : parseInt(val);
    currentOrgPage = 1; 
    renderOrgsTableBody();
});

document.getElementById("prevOrgPageBtn").addEventListener("click", () => {
    if (currentOrgPage > 1) { currentOrgPage--; renderOrgsTableBody(); }
});

document.getElementById("nextOrgPageBtn").addEventListener("click", () => {
    const maxPage = Math.ceil(currentOrgsList.length / orgRowsPerPage);
    if (currentOrgPage < maxPage) { currentOrgPage++; renderOrgsTableBody(); }
});

// --- Core Database Logic ---
async function createOrg() {
    const orgName = document.getElementById("orgNameInput").value.trim();

    if (!orgName) {
        showToast("Please enter an organization name.", "error"); 
        return;
    }

    // Duplicate Check Validation
    const { data: existingOrgs, error: checkError } = await myClient
        .from("organization") // Updated to match your exact DB table name
        .select("id")
        .ilike("org_name", orgName); 

    if (existingOrgs && existingOrgs.length > 0) {
        showToast("This organization already exists!", "error");
        return;
    }

    // --- NEW: Trigger Premium Confirmation Modal ---
    const isConfirmed = await showAddOrgModal(orgName);
    if (!isConfirmed) return; // Stop if they click Cancel
    // -----------------------------------------------

    // Insert into DB
    const { error } = await myClient
        .from("organization")
        .insert([{ org_name: orgName }]);

    if (error) {
        console.error(error);
        showToast(error.message, "error");
        return;
    }

    showToast("Organization added successfully!", "success");
    document.getElementById("orgNameInput").value = "";
    
    const orgs = await loadOrgsTable();
    renderOrgsTable(orgs);
}

// --- Premium Custom Add Org Dialog Logic ---
function showAddOrgModal(orgName) {
    return new Promise((resolve) => {
        const modal = document.getElementById("addOrgModal");
        const confirmBtn = document.getElementById("confirmAddOrgBtn");
        const cancelBtn = document.getElementById("cancelAddOrgBtn");
        const nameDisplay = document.getElementById("confirmOrgName");

        // Dynamically inject the name they typed into the popup text!
        nameDisplay.textContent = `"${orgName}"`;

        // Reveal the modal
        modal.classList.add("show");

        // Cleanup function
        const cleanup = (result) => {
            modal.classList.remove("show");
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
            resolve(result);
        };

        // Resolve true if Add is clicked, false if Cancel is clicked
        confirmBtn.onclick = () => cleanup(true);
        cancelBtn.onclick = () => cleanup(false);
    });
}

async function deleteOrg(event) {
    const orgId = event.target.dataset.id;
    const orgName = event.target.dataset.name; // Grab the name we just attached

    // Trigger the new custom modal
    const isConfirmed = await showDeleteOrgModal(orgName);
    
    if (!isConfirmed) return;

    const { error } = await myClient
        .from("organization")
        .delete()
        .eq("id", orgId);

    if (error) {
        console.error("Error deleting org:", error);
        if (error.code === "23503") {
            showToast("Cannot delete: Records exist for this organization.", "error");
        } else {
            showToast("Failed to delete. Check database security permissions.", "error");
        }
        return;
    }

    showToast("Organization deleted successfully!", "success");
    const orgs = await loadOrgsTable();
    renderOrgsTable(orgs);
}

// --- Premium Custom Delete Org Dialog Logic ---
function showDeleteOrgModal(orgName) {
    return new Promise((resolve) => {
        const modal = document.getElementById("deleteOrgModal");
        const confirmBtn = document.getElementById("confirmDeleteOrgBtn");
        const cancelBtn = document.getElementById("cancelDeleteOrgBtn");
        const nameDisplay = document.getElementById("deleteOrgNameDisplay");

        // Inject the organization name into the text
        nameDisplay.textContent = `"${orgName}"`;

        modal.classList.add("show");

        const cleanup = (result) => {
            modal.classList.remove("show");
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
            resolve(result);
        };

        confirmBtn.onclick = () => cleanup(true);
        cancelBtn.onclick = () => cleanup(false);
    });
}

document.getElementById("createOrgBtn").addEventListener("click", createOrg);
document.getElementById("clearOrgBtn").addEventListener("click", () => {
    document.getElementById("orgNameInput").value = "";
});


// --- Core Edit Logic ---
async function editOrg(event) {
    const orgId = event.target.dataset.id;
    const oldName = event.target.dataset.name;

    // Trigger the Modal and wait for the user to type a new name
    const newName = await showEditOrgModal(oldName);
    
    // If they clicked cancel, or didn't change the name at all, stop here.
    if (!newName || newName === oldName) return; 

    // Prevent duplicate renaming
    const { data: existingOrgs, error: checkError } = await myClient
        .from("organization")
        .select("id")
        .ilike("org_name", newName)
        .neq("id", orgId); // Don't check against itself!

    if (existingOrgs && existingOrgs.length > 0) {
        showToast("An organization with this name already exists!", "error");
        return;
    }

    // Push the update to Supabase
    const { error } = await myClient
        .from("organization")
        .update({ org_name: newName })
        .eq("id", orgId);

    if (error) {
        console.error("Error updating org:", error);
        showToast("Failed to update. Check RLS UPDATE policy.", "error");
        return;
    }

    showToast("Organization updated successfully!", "success");
    const orgs = await loadOrgsTable();
    renderOrgsTable(orgs);
}

// --- Premium Custom Edit Dialog Logic ---
function showEditOrgModal(oldName) {
    return new Promise((resolve) => {
        const modal = document.getElementById("editOrgModal");
        const confirmBtn = document.getElementById("confirmEditOrgBtn");
        const cancelBtn = document.getElementById("cancelEditOrgBtn");
        const inputField = document.getElementById("editOrgNameInput");

        // Pre-fill the input box with the old name
        inputField.value = oldName;
        modal.classList.add("show");
        inputField.focus();

        const cleanup = (result) => {
            modal.classList.remove("show");
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
            resolve(result);
        };

        // Pass the new typed value back to the main function
        confirmBtn.onclick = () => cleanup(inputField.value.trim());
        cancelBtn.onclick = () => cleanup(null);
    });
}