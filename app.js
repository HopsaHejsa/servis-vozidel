import {
    login,
    logout,
    watchAuth
} from "./firebase.js";

function $(id) {
    return document.getElementById(id);
}

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }
}

function initLogin() {

    const loginBtn = $("loginBtn");

    if (!loginBtn) {
        return;
    }

    loginBtn.addEventListener(
        "click",
        async () => {

            const email =
                $("email").value.trim();

            const password =
                $("password").value;

            try {

                await login(
                    email,
                    password
                );

            } catch (error) {

                console.error(error);

                alert(
                    "Neplatné přihlášení."
                );

            }

        }
    );
}

function initLogout() {

    const logoutBtn =
        $("logoutBtn");

    if (!logoutBtn) {
        return;
    }

    logoutBtn.addEventListener(
        "click",
        async () => {

            await logout();

        }
    );
}

function initNavigation() {

    document
        .querySelectorAll(
            "#bottomNav button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        button.dataset.page;

                    if (target) {

                        showPage(
                            target
                        );

                    }

                }
            );

        });

}

function initDarkMode() {

    const saved =
        localStorage.getItem(
            "darkMode"
        );

    if (saved === "true") {

        document.body.classList.add(
            "dark"
        );

    }

    const darkMode =
        $("darkMode");

    if (!darkMode) {
        return;
    }

    darkMode.checked =
        saved === "true";

    darkMode.addEventListener(
        "change",
        event => {

            document.body.classList.toggle(
                "dark"
            );

            localStorage.setItem(
                "darkMode",
                event.target.checked
            );

        }
    );
}

function initAuth() {

    watchAuth(user => {

        if (user) {

            showPage(
                "dashboardPage"
            );

        } else {

            showPage(
                "loginPage"
            );

        }

    });

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initLogin();

        initLogout();

        initNavigation();

        initDarkMode();

        initAuth();

    }
);