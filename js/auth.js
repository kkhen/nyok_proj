async function getSession() {

    const {
        data: { session }
    } = await myClient.auth.getSession();

    return session;

}

async function requireLogin() {

    const session = await getSession();

    if (!session) {

        window.location.href = "index.html";
        return null;

    }

    return session;

}

async function logout() {

    await myClient.auth.signOut();

    window.location.href = "index.html";

}