import {
    login,
    logout,
    watchAuth,
    createRepair,
    watchRepairs
}
from "./firebase.js";

import {
    APP_VERSION
}
from "./config.js";

let repairs = [];

function $(id) {

    return document.getElementById(id);

}

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

    if(page){

        page.classList.add(
            "active"
        );

    }

}

window.showPage = showPage;


// LOGIN

function initLogin() {

    $("loginBtn")
    ?.addEventListener(
        "click",
        async ()=>{

            try{

                await login(

                    $("email").value,

                    $("password").value

                );

            }

            catch(error){

                console.error(error);

                alert(
                    "Neplatné přihlášení."
                );

            }

        }
    );

}


// LOGOUT

function initLogout(){

    $("logoutBtn")
    ?.addEventListener(
        "click",
        async ()=>{

            await logout();

        }
    );

}


// AUTH

function initAuth(){

    watchAuth(user=>{

        if(user){

            showPage(
                "calendarPage"
            );

            startRealtime();

        }

        else{

            showPage(
                "loginPage"
            );

        }

    });

}


// NAVIGATION

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

                showPage(
                    target
                );

            }
        );

    });

}


// CALENDAR

function initCalendar(){

    const button =
    $("calendarAddRepairBtn");

    if(!button){

        return;

    }

    button.addEventListener(
        "click",
        ()=>{

            showPage(
                "repairFormPage"
            );

        }
    );

}


// COSTS

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
            .appendChild(row);

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


// SAVE

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

                clearForm();

            }

            catch(error){

                console.error(error);

                alert(
                    "Chyba ukládání."
                );

            }

        }
    );

}

function clearForm(){

    [
        "brand",
        "spz",
        "owner",
        "phone",
        "repairDate",
        "problem",
        "solution",
        "note"
    ]
    .forEach(id=>{

        const el = $(id);

        if(el){

            el.value = "";

        }

    });

}


// REALTIME

function startRealtime(){

    watchRepairs(data=>{

        repairs = data;

        renderRepairs();

    });

}

function renderRepairs(){

    const container =
    $("repairList");

    if(!container){

        return;

    }

    container.innerHTML = "";

    repairs.forEach(repair=>{

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "repair-card";

        card.innerHTML = `

<div class="repair-title">
${repair.znacka || ""}
</div>

<div class="repair-spz">
${repair.spz || ""}
</div>

<div>
${repair.zavada || ""}
</div>

<div>
${repair.stav || ""}
</div>

`;

        container.appendChild(
            card
        );

    });

}


// VERSION

function initVersion(){

    const version =
    $("appVersion");

    if(version){

        version.textContent =
            "Verze " +
            APP_VERSION;

    }

}


// START

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        initLogin();

        initLogout();

        initNavigation();

        initCalendar();

        initCosts();

        initSaveRepair();

        initVersion();

        initAuth();

    }
);
