/* ========================= */
/* ELEMENTS */
/* ========================= */

const links =
    document.querySelectorAll(".nav-link");

const indicator =
    document.querySelector(".indicator");

const navbar =
    document.querySelector(".navbar");

/* ========================= */
/* PAGE PROTECTION */
/* ========================= */

const protectedPages = [
    "dashboard.html",
    "projects.html"
];

/* ========================= */
/* CURRENT PAGE */
/* ========================= */

const currentPage =
    window.location.pathname
    .split("/")
    .pop();

/* ========================= */
/* PAGE NAME */
/* ========================= */

const pageName =
    currentPage.replace(".html", "");

/* ========================= */
/* VISIT COUNTER */
/* ========================= */

const visitCounter =
    document.getElementById("visitCount");

const visitStorageKey =
    "fallqyunWebsiteVisits";

function updateVisitCounter(value){

    if(!visitCounter) return;

    visitCounter.innerText =
        Number(value || 0).toLocaleString("id-ID");
}

if(visitCounter){

    const currentVisits =
        Number(
            localStorage.getItem(visitStorageKey)
            ||
            0
        );

    const nextVisits =
        currentVisits + 1;

    localStorage.setItem(
        visitStorageKey,
        nextVisits
    );

    updateVisitCounter(nextVisits);

    window.addEventListener(
        "storage",
        (event) => {

            if(
                event.key === visitStorageKey
            ){
                updateVisitCounter(
                    event.newValue
                );
            }
        }
    );
}

/* ========================= */
/* AMBIENT BACKGROUND */
/* ========================= */

const ambientCanvas =
    document.getElementById("ambientCanvas");

if(ambientCanvas){

    const ctx =
        ambientCanvas.getContext("2d");

    const pointer = {
        x:0,
        y:0,
        active:false
    };

    let width = 0;
    let height = 0;
    let particles = [];
    let ambientFrame = null;
    let ambientVisible = true;

    function resizeAmbient(){

        const ratio =
            Math.min(
                window.devicePixelRatio || 1,
                1.25
            );

        const stage =
            ambientCanvas.parentElement;

        width =
            stage.offsetWidth;

        height =
            stage.offsetHeight;

        ambientCanvas.width =
            width * ratio;

        ambientCanvas.height =
            height * ratio;

        ambientCanvas.style.width =
            width + "px";

        ambientCanvas.style.height =
            height + "px";

        ctx.setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );

        const total =
            Math.min(
                Math.floor(width * height / 32000),
                42
            );

        particles =
            Array.from({ length:total }, () => ({
                x:Math.random() * width,
                y:Math.random() * height,
                vx:(Math.random() - 0.5) * 0.12,
                vy:(Math.random() - 0.5) * 0.12,
                size:Math.random() * 1.15 + 0.5
            }));
    }

    function drawAmbient(){

        if(!ambientVisible){
            ambientFrame = null;
            return;
        }

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        particles.forEach((particle, index) => {

            particle.x +=
                particle.vx;

            particle.y +=
                particle.vy;

            if(particle.x < 0 || particle.x > width){
                particle.vx *= -1;
            }

            if(particle.y < 0 || particle.y > height){
                particle.vy *= -1;
            }

            if(pointer.active){

                const dx =
                    particle.x - pointer.x;

                const dy =
                    particle.y - pointer.y;

                const distance =
                    Math.sqrt(dx * dx + dy * dy);

                if(distance < 170 && distance > 0){

                    particle.x +=
                        dx / distance * 0.34;

                    particle.y +=
                        dy / distance * 0.34;
                }
            }

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "rgba(255,255,255,0.32)";

            ctx.fill();

            for(
                let next = index + 1;
                next < particles.length;
                next++
            ){

                const other =
                    particles[next];

                const dx =
                    particle.x - other.x;

                const dy =
                    particle.y - other.y;

                const distance =
                    Math.sqrt(dx * dx + dy * dy);

                if(distance < 120){

                    ctx.beginPath();

                    ctx.moveTo(
                        particle.x,
                        particle.y
                    );

                    ctx.lineTo(
                        other.x,
                        other.y
                    );

                    ctx.strokeStyle =
                        `rgba(0,255,159,${0.15 * (1 - distance / 120)})`;

                    ctx.lineWidth =
                        1;

                    ctx.stroke();
                }
            }
        });

        ambientFrame =
            requestAnimationFrame(
            drawAmbient
        );
    }

    function startAmbient(){

        if(ambientFrame) return;

        ambientVisible =
            true;

        drawAmbient();
    }

    function stopAmbient(){

        ambientVisible =
            false;

        if(ambientFrame){
            cancelAnimationFrame(
                ambientFrame
            );

            ambientFrame =
                null;
        }
    }

    window.addEventListener(
        "resize",
        resizeAmbient
    );

    window.addEventListener(
        "load",
        resizeAmbient
    );

    window.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                ambientCanvas.getBoundingClientRect();

            pointer.x =
                event.clientX - rect.left;

            pointer.y =
                event.clientY - rect.top;

            pointer.active =
                pointer.x >= 0
                &&
                pointer.x <= rect.width
                &&
                pointer.y >= 0
                &&
                pointer.y <= rect.height;
        }
    );

    window.addEventListener(
        "mouseleave",
        () => {

            pointer.active =
                false;
        }
    );

    if("IntersectionObserver" in window){

        const ambientObserver =
            new IntersectionObserver(
                (entries) => {

                    if(entries[0].isIntersecting){
                        startAmbient();
                    }
                    else{
                        stopAmbient();
                    }
                },
                {
                    threshold:0.08
                }
            );

        ambientObserver.observe(
            ambientCanvas.parentElement
        );
    }

    resizeAmbient();
    startAmbient();
}

/* ========================= */
/* CHECK LOGIN */
/* ========================= */

if(
    protectedPages.includes(currentPage)
){

    if(
        localStorage.getItem("loggedIn")
        !==
        "true"
    ){

        alert(
            `Access to ${
                pageName.charAt(0)
                .toUpperCase()
                +
                pageName.slice(1)
            } is restricted.\n\nPlease sign in first to continue your journey.`
        );

        window.location.href =
            "login.html";
    }
}

/* ========================= */
/* AUTH NAVBAR SYSTEM */
/* ========================= */

const authButton =
    document.getElementById("authButton");

/* CHECK AUTH */

if(authButton){

    /* ========================= */
    /* USER LOGGED IN */
    /* ========================= */

    if(
        localStorage.getItem("loggedIn")
        ===
        "true"
    ){

        /* CHANGE BUTTON */

        authButton.innerText =
            "Logout";

        /* REMOVE LOGIN LINK */

        authButton.removeAttribute(
            "href"
        );

        authButton.style.cursor =
            "pointer";

        /* LOGOUT FUNCTION */

        authButton.onclick =
            function(e){

                e.preventDefault();

                localStorage.removeItem(
                    "loggedIn"
                );

                alert(
                    "You have been logged out successfully."
                );

                /* PAGE TRANSITION */

                document.body.classList.remove(
                    "loaded"
                );

                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 300);

            };

    }

    /* ========================= */
    /* USER NOT LOGGED IN */
    /* ========================= */

    else{

        authButton.innerText =
            "Login";

        authButton.href =
            "login.html";

    }

}

/* ========================= */
/* MOVE INDICATOR */
/* ========================= */

function moveIndicator(el){

    if(!el) return;

    const linkRect =
        el.getBoundingClientRect();

    const navRect =
        navbar.getBoundingClientRect();

    indicator.style.width =
        linkRect.width + "px";

    indicator.style.left =
        (
            linkRect.left
            -
            navRect.left
        ) + "px";
}

/* ========================= */
/* CLICK NAV */
/* ========================= */

links.forEach(link => {

    link.addEventListener(
        "click",
        (e) => {

            /* SKIP LOGOUT BUTTON */

            if(
                link.id === "authButton"
                &&
                localStorage.getItem("loggedIn")
                ===
                "true"
            ){
                return;
            }

            /* SAME PAGE */

            if(
                link.href ===
                window.location.href
            ) return;

            /* PAGE TRANSITION */

            document.body.classList.remove(
                "loaded"
            );

            e.preventDefault();

            setTimeout(() => {

                window.location.href =
                    link.href;

            }, 300);

        }
    );

});

/* ========================= */
/* LOAD */
/* ========================= */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "loaded"
        );

        const active =
            document.querySelector(
                ".nav-link.active"
            );

        requestAnimationFrame(() => {

            moveIndicator(active);

        });

    }
);
