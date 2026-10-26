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
let currentFilter = "open";

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
               
