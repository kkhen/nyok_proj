async function loadOrganizations() {

    const { data, error } = await myClient
        .from("organization")
        .select("*")
        .order("org_name");

    if (error) {
        console.error(error);
        alert(error.message);
        return [];
    }

    return data;

}