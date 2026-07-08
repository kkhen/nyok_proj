// Check if user is already logged in
(async () => {

    const {
        data: { session }
    } = await myClient.auth.getSession();

    // User is not logged in
    if (!session) {
        console.log("No session found.");
        return;
    }

    // Check if the user already exists
    const { data: user, error } = await myClient
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

    if (error) {
        console.error(error);
        return;
    }

    // First time login
    if (!user) {

        const { error: insertError } = await myClient
            .from("users")
            .insert({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata.full_name,
                role: "user"
            });

        if (insertError) {
            console.error(insertError);
            return;
        }

        // New users always go to the dashboard
        window.location.href = "dashboard.html";
        return;
    }

    // Existing user
    if (user.role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "dashboard.html";
    }

})();

const googleBtn = document.getElementById("googleBtn");

// Google login button
googleBtn.addEventListener("click", async () => {

    const { error } = await myClient.auth.signInWithOAuth({
        provider: "google"
    });

    if (error) {
        console.error(error);
    }

});

