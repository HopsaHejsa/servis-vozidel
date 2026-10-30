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
let currentDate = new Date();

let selectedDate = null;

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

    if(button){

        button.addEventListener(
            "click",
            ()=>{

                if(selectedDate){

                    $("repairDate").value =
                        selectedDate;

                }

                showPage(
                    "repairFormPage"
                );

            }
        );

    }

    function renderCalendar(){

    const grid =
        $("calendarGrid");

    if(!grid){

        return;

    }

    grid.innerHTML = "";

[
    "Po",
    "Út",
    "St",
    "Čt",
    "Pá",
    "So",
    "Ne"
]
.forEach(day=>{

    const header =
    document.createElement(
        "div"
    );

    header.className =
        "calendar-header-day";

    header.textContent =
        day;

    grid.appendChild(
        header
    );

});
        
    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

    const firstDay =
        new Date(
            year,
            month,
            1
        );

        let startDay =
    firstDay.getDay();

startDay =
    startDay === 0
    ? 6
    : startDay - 1;

for(
    let i = 0;
    i < startDay;
    i++
){

    const empty =
    document.createElement(
        "div"
    );

    grid.appendChild(
        empty
    );

}

    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );


    $("calendarMonth").textContent =

        currentDate.toLocaleDateString(
            "cs-CZ",
            {
                month:"long",
                year:"numeric"
            }
        );

    for(
        let day = 1;
        day <= lastDay.getDate();
        day++
    ){

        const cell =
        document.createElement(
            "button"
        );

        cell.className =
            "calendar-day";

const dateString =
    `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

const today =
    new Date();

const todayString =
    `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

if(dateString === todayString){

    cell.classList.add(
        "selected-day"
    );

    selectedDate =
        todayString;

    renderSelectedDayRepairs(
        todayString
    );

}
        
const hasRepair =
    repairs.some(
        repair =>
            repair.datum ===
            dateString
    );

if(hasRepair){

    cell.classList.add(
        "has-repair"
    );

}
        
        cell.textContent =
            day;

        cell.addEventListener(
            "click",
            ()=>{
document
.querySelectorAll(
    ".calendar-day"
)
.forEach(day=>{

    day.classList.remove(
        "selected-day"
    );

});

cell.classList.add(
    "selected-day"
);
                selectedDate =
                    dateString;

                renderSelectedDayRepairs(
                    dateString
                );

            }
        );

        grid.appendChild(
            cell
        );

    }

}

    function renderSelectedDayRepairs(
    date
){

    const container =
        $("selectedDayRepairs");

    if(!container){

        return;

    }

    container.innerHTML = "";

    const dayRepairs =
        repairs.filter(
            repair =>

                repair.datum === date
        );

    if(
        dayRepairs.length === 0
    ){

        container.innerHTML =
            "<p>Žádné opravy.</p>";

        return;

    }

    dayRepairs.forEach(repair=>{

        const card =
        document.createElement(
            "div"
        );

        card.className =
            "repair-card card";

        card.addEventListener(
    "click",
    ()=>{

        openRepairDetail(
            repair.id
        );

    }
);

        card.innerHTML = `

<div>

<strong>
${repair.znacka || ""}
</strong>

</div>

<div>

${repair.spz || ""}

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

    $("prevMonthBtn")
    ?.addEventListener(
        "click",
        ()=>{

            const currentMonth =
    currentDate.getMonth();

currentDate =
    new Date(
        currentDate.getFullYear(),
        currentMonth - 1,
        1
    );

            renderCalendar();

        }
    );

    $("nextMonthBtn")
    ?.addEventListener(
        "click",
        ()=>{

           const currentMonth =
    currentDate.getMonth();

currentDate =
    new Date(
        currentDate.getFullYear(),
        currentMonth + 1,
        1
    );

            renderCalendar();

        }
    );

    renderCalendar();

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

            const costs = [];

document
.querySelectorAll(".cost-row")
.forEach(row=>{

    costs.push({

        name:
            row.querySelector(
                ".cost-name"
            )?.value || "",

        price:
            Number(

                row.querySelector(
                    ".cost-price"
                )?.value || 0

            )

    });

});
            
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

costs:costs,

totalCost:

    costs.reduce(
        (sum,item)=>

            sum + item.price,

        0
    ),

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

         updateDashboard();

    });

}

function renderRepairs(){

    
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
function updateDashboard(){

    const openCount =
        repairs.filter(
            repair =>

                !repair.archiv
                &&
                repair.stav === "Otevřeno"
        ).length;

    const waitingCount =
        repairs.filter(
            repair =>

                !repair.archiv
                &&
                repair.stav === "Čeká na díly"
        ).length;

    const doneCount =
        repairs.filter(
            repair =>

                !repair.archiv
                &&
                repair.stav === "Hotovo"
        ).length;

    $("openCount").textContent =
        openCount;

    $("waitingCount").textContent =
        waitingCount;

    $("doneTodayCount").textContent =
        doneCount;

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

    $("detailPhone").innerHTML = `

<a href="tel:${repair.telefon || ""}">

${repair.telefon || ""}

</a>

`;

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

$("detailCosts").innerHTML = "";

(repair.costs || [])
.forEach(item=>{

    const row =
    document.createElement(
        "div"
    );

    row.className =
        "cost-row";

    row.innerHTML = `

<div>

${item.name || "-"}

</div>

<div>

${item.price || 0} Kč

</div>

`;

    $("detailCosts")
    .appendChild(
        row
    );

});

$("detailTotalCost").textContent =

    (repair.totalCost || 0)
    .toLocaleString(
        "cs-CZ"
    )

    + " Kč";
    
    showPage(
        "repairDetailPage"
    );

}

function initVehicleHistory(){

    $("vehicleHistoryBtn")
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

            const history =
                await getVehicleHistory(
                    repair.spz
                );
history.sort(
    (a,b)=>

        (b.datum || "")
        .localeCompare(
            a.datum || ""
        )

);
            
            $("vehicleSpz").textContent =
                repair.spz || "";

            $("vehicleBrand").textContent =
                repair.znacka || "";

            $("vehicleOwner").textContent =
                repair.majitel || "";

            $("vehiclePhone").textContent =
                repair.telefon || "";

            $("vehicleHistory").innerHTML =
                "";

            history.forEach(item=>{

                const card =
                document.createElement(
                    "div"
                );

                card.className =
                "repair-card card";

                card.innerHTML = `

<div>

<strong>
${item.datum || ""}

</strong>

</div>

<div>

${item.provedenaOprava || item.zavada || "-"}

</div>

<div>

Celkem:

${(item.totalCost || 0)
    .toLocaleString(
        "cs-CZ"
    )} Kč

</div>

`;

                $("vehicleHistory")
                .appendChild(
                    card
                );

            });

            showPage(
                "vehiclePage"
            );

        }
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

    initVehicleHistory();
        
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
$("backToDetailBtn")
?.addEventListener(
    "click",
    ()=>{

        showPage(
            "repairDetailPage"
        );

    }
);
        
        initAuth();

    }
);
