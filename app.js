import {
    login,
    logout,
    watchAuth,
    createRepair
}
from "./firebase.js";

import {
    APP_VERSION
}
from "./config.js";

function $(id) {

    return document.getElementById(id);

}


// ======================================
// PAGE SWITCH
// ======================================

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });

    const page =
        document.getElementById(
            pageId
        );

    if (page) {

        page.classList.add(
            "active"
        );

    }

}

window.showPage = showPage;


// ======================================
// LOGIN
// ======================================

function initLogin() {

    const button =
        $("loginBtn");

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        async () => {

            try {

                await login(

                    $("email").value,

                    $("password").value

                );

            }

            catch(error){

                console.error(
                    error
                );

                alert(
                    "Neplatné přihlášení."
                );

            }

        }
    );

}


// ======================================
// LOGOUT
// ======================================

function initLogout(){

    $("logoutBtn")
    ?.addEventListener(
        "click",
        async ()=>{

            await logout();

        }
    );

}


// ======================================
// AUTH
// ======================================

function initAuth(){

    watchAuth(user=>{

        if(user){

            showPage(
                "calendarPage"
            );

        }

        else{

            showPage(
                "loginPage"
            );

        }

    });

}


// ======================================
// NAVIGATION
// ======================================

function initNavigation(){

    document
    .querySelectorAll(
        "#bottomNav button"
    )
    .forEach(button=>{

        button.addEventListener(
            "click",
            ()=>{

                const target =
                button.dataset.page;

                if(target){

                    showPage(
                        target
                    );

                }

            }
        );

    });

}


// ======================================
// DARK MODE
// ======================================

function initDarkMode(){

    const saved =
    localStorage.getItem(
        "darkMode"
    );

    if(saved === "true"){

        document.body
        .classList.add(
            "dark"
        );

    }

    const darkMode =
    $("darkMode");

    if(!darkMode){

        return;

    }

    darkMode.checked =
    saved === "true";

    darkMode.addEventListener(
        "change",
        event=>{

            document.body
            .classList.toggle(
                "dark"
            );

            localStorage.setItem(

                "darkMode",

                event.target.checked

            );

        }
    );

}


// ======================================
// CALENDAR
// ======================================

function initCalendar(){

    $("calendarAddRepairBtn")
    ?.addEventListener(
        "click",
        ()=>{

            showPage(
                "repairFormPage"
            );

        }
    );

}


// ======================================
// COSTS
// ======================================

function initCosts(){

    $("addCostBtn")
    ?.addEventListener(
        "click",
        ()=>{

            const row =
            document.createElement(
                "div"
            );

            row.className =
            "cost-row";

            row.innerHTML = `

<input
 class="cost-name"
 placeholder="Název položky"
>

<input
 class="cost-price"
 type="number"
 placeholder="Cena"
>

`;

            $("costsContainer")
            ?.appendChild(row);

            row
            .querySelector(
                ".cost-price"
            )
            .addEventListener(
                "input",
                calculateTotal
            );

        }
    );

}

function calculateTotal(){

    let total = 0;

    document
    .querySelectorAll(
        ".cost-price"
    )
    .forEach(item=>{

        total += Number(
            item.value || 0
        );

    });

    $("totalCost").textContent =

        total.toLocaleString(
            "cs-CZ"
        )

        + " Kč";

}


// ======================================
// SAVE REPAIR
// ======================================

function initSaveRepair(){

    $("saveRepairBtn")
    ?.addEventListener(
        "click",
        async ()=>{

            const repair = {

                znacka:
                $("brand").value,

                spz:
                $("spz").value,

                majitel:
                $("owner").value,

                telefon:
                $("phone").value,

                datum:
                $("repairDate").value,

                zavada:
                $("problem").value,

                provedenaOprava:
                $("solution").value,

                priorita:
                $("priority").value,

                stav:
                $("status").value,

                poznamka:
                $("note").value,

                archiv:false

            };

            try{

                await createRepair(
                    repair
                );

                alert(
                    "Oprava uložena."
                );

            }

            catch(error){

                console.error(
                    error
                );

                alert(
                    "Chyba ukládání."
                );

            }

        }
    );

}


// ======================================
// VERSION
// ======================================

function initVersion(){

    const version =
    $("appVersion");

    if(!version){

        return;

    }

    version.textContent =

    "Verze " +

    APP_VERSION;

}


// ======================================
// START
// ======================================

document
.addEventListener(
    "DOMContentLoaded",
    ()=>{

        initLogin();

        initLogout();

        initNavigation();

        initDarkMode();

        initCalendar();

        initCosts();

        initSaveRepair();

        initVersion();

        initAuth();

    }
);
