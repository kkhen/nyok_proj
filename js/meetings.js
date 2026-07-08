async function loadMeetings() {

    const { data, error } = await myClient
        .from("meetings")
        .select("*")
        .eq("active", true)
        .order("start_time");

    if (error) {
        console.error(error);
        alert(error.message);
        return [];
    }

    return data;

}