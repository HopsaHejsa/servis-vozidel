import {
    login,
    logout,
    watchAuth,
    createRepair,
    watchRepairs,
    getRepair,
    updateRepair,
    markRepairDone,
    archiveRepair,
    getVehicleHistory,
}
from "./firebase.js";

import {
    APP_VERSION
}
from "./config.js";

let repairs = [];
let currentFilter = "open";
let selectedRepairId = null;
let editMode = false;

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


// FILTERS

function initFilters(){

    document
    .querySelectorAll(".tab")
    .forEach(button=>{

        button.addEventListener(
            "click",
            ()=>{

                document
                .querySelectorAll(".tab")
                .forEach(tab=>{

                    tab.classList.remove(
                        "active"
                    );

                });

                button.classList.add(
                    "active"
                );

                currentFilter =
                    button.dataset.filter ||
                    "open";

                renderRepairs();

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

                if(editMode){

    await updateRepair(

        selectedRepairId,

        repair

    );

    editMode = false;

    selectedRepairId = null;

}
else{

    await createRepair(
        repair
    );

}

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

alert("renderRepairs");
    
    const container =
    $("repairList");

    if(!container){

        return;

    }

    container.innerHTML = "";

    let visibleRepairs =
        [...repairs];

    if(currentFilter === "open"){

        visibleRepairs =
            visibleRepairs.filter(
                repair =>

                    !repair.archiv
                    &&
                    repair.stav !== "Hotovo"
            );

    }

    if(currentFilter === "done"){

        visibleRepairs =
            visibleRepairs.filter(
                repair =>

                    !repair.archiv
                    &&
                    repair.stav === "Hotovo"
            );

    }

    if(currentFilter === "archive"){

        visibleRepairs =
            visibleRepairs.filter(
                repair =>
                    repair.archiv === true
            );

    }

    visibleRepairs.forEach(repair=>{

        const card =
        document.createElement(
            "div"
        );

        card.className =
        "repair-card card";

        card.addEventListener(
    "click",
    ()=>{

         alert("Klik na opravu");
        
        openRepairDetail(
            repair.id
        );

    }
);
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
function initEditRepair(){

    $("editRepairBtn")
    ?.addEventListener(
        "click",
        async ()=>{

            if(!selectedRepairId){

                return;

            }

            const repair =
                await getRepair(
                    selectedRepairId
                );

            if(!repair){

                return;

            }

            editMode = true;

            $("brand").value =
                repair.znacka || "";

            $("spz").value =
                repair.spz || "";

            $("owner").value =
                repair.majitel || "";

            $("phone").value =
                repair.telefon || "";

            $("repairDate").value =
                repair.datum || "";

            $("problem").value =
                repair.zavada || "";

            $("solution").value =
                repair.provedenaOprava || "";

            $("priority").value =
                repair.priorita || "medium";

            $("status").value =
                repair.stav || "Otevřeno";

            $("note").value =
                repair.poznamka || "";

            showPage(
                "repairFormPage"
            );

        }
    );

}

function initDetailActions(){

    $("markDoneBtn")
    ?.addEventListener(
        "click",
        async ()=>{

            if(!selectedRepairId){

                return;

            }

            await markRepairDone(
                selectedRepairId
            );

            showPage(
                "repairsPage"
            );

        }
    );

    $("archiveRepairBtn")
    ?.addEventListener(
        "click",
        async ()=>{

            if(!selectedRepairId){

                return;

            }

            await archiveRepair(
                selectedRepairId
            );

            showPage(
                "repairsPage"
            );

        }
    );

}

async function openRepairDetail(id){

    selectedRepairId = id;

    const repair =
        await getRepair(id);

    if(!repair){

        return;

    }

    $("detailBrand").textContent =
        repair.znacka || "";

    $("detailSpz").textContent =
    repair.spz || "";

    $("detailOwner").textContent =
        repair.majitel || "";

    $("detailPhone").textContent =
        repair.telefon || "";

    $("detailDate").textContent =
        repair.datum || "";

    $("detailStatus").textContent =
        repair.stav || "";

    $("detailProblem").textContent =
        repair.zavada || "";

    $("detailSolution").textContent =
        repair.provedenaOprava || "";

    $("detailNote").textContent =
        repair.poznamka || "";

    showPage(
        "repairDetailPage"
    );

}

async function openVehicleHistory(spz){

    const history =
        await getVehicleHistory(
            spz
        );

    $("vehicleSpz").textContent =
        spz;

    $("vehicleHistory").innerHTML =
        "";

    history.forEach(item=>{

        const row =
        document.createElement(
            "div"
        );

        row.className =
        "card";

        row.innerHTML = `

<div>
${item.datum || ""}
</div>

<div>
${item.zavada || ""}
</div>

<div>
${item.stav || ""}
</div>

`;

        $("vehicleHistory")
        .appendChild(
            row
        );

    });

    showPage(
        "vehiclePage"
    );

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

        initFilters();

        initCalendar();

        initCosts();

        initSaveRepair();

        initEditRepair();

initDetailActions();
        
        initVersion();

        $("backToRepairsBtn")
?.addEventListener(
    "click",
    ()=>{

        showPage(
            "repairsPage"
        );

    }
);
        initAuth();

    }
);
