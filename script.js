const canvas = document.getElementById("painting");
const ctx = canvas.getContext("2d");

const intro = document.getElementById("intro");
const start = document.getElementById("start");
const label = document.getElementById("label");
const finalBox = document.getElementById("final");
const replay = document.getElementById("replay");
const loading = document.getElementById("loading");

let W = 0;
let H = 0;
let S = 1;

let raf = null;
let running = false;

let paintParticles = [];

const TAU = Math.PI * 2;

const flowers = [
    {
        x: -250,
        y: -110,
        r: 58,
        petals: 20,
        curve: -24
    },

    {
        x: -105,
        y: -220,
        r: 72,
        petals: 23,
        curve: -8
    },

    {
        x: 95,
        y: -180,
        r: 65,
        petals: 22,
        curve: 12
    },

    {
        x: 245,
        y: -115,
        r: 58,
        petals: 20,
        curve: 29
    },

    {
        x: 5,
        y: -62,
        r: 51,
        petals: 19,
        curve: 2
    }
];


const random = (min, max) => {
    return min + Math.random() * (max - min);
};

const randomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};


function resizeCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    S = Math.min(
        W / 1000,
        H / 750
    );

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();


function point(px, py) {

    return {
        x: W / 2 + px * S,
        y: H / 2 + py * S
    };
}



function drawBackground() {

    ctx.fillStyle = "#071b35";

    ctx.fillRect(
        0,
        0,
        W,
        H
    );



    for (let i = 0; i < 260; i++) {

        const px = random(0, W);
        const py = random(0, H * 0.75);

        const radius = random(25, 90);
        const angle = random(0, TAU);

        ctx.save();

        ctx.translate(
            px,
            py
        );

        ctx.rotate(angle);

        ctx.strokeStyle = randomItem([
            "#1f538f88",
            "#174077aa",
            "#4070a166",
            "#123160aa"
        ]);

        ctx.lineWidth = random(
            4,
            10
        );

        ctx.lineCap = "round";

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            radius,
            -0.5,
            -0.5 + random(
                0.25,
                1
            )
        );

        ctx.stroke();

        ctx.restore();
    }
}



function drawTable() {

    const y = H * 0.76;

    ctx.fillStyle = "#925720";

    ctx.fillRect(
        0,
        y,
        W,
        H - y
    );


    
    for (let i = 0; i < 80; i++) {

        const px = random(
            0,
            W
        );

        const py = random(
            y,
            H
        );

        ctx.strokeStyle = randomItem([
            "#e89a37aa",
            "#43271666",
            "#ca6f1f99"
        ]);

        ctx.lineWidth = random(
            3,
            8
        );

        ctx.beginPath();

        ctx.moveTo(
            px,
            py
        );

        ctx.lineTo(
            px + random(15, 80),
            py + random(-5, 5)
        );

        ctx.stroke();
    }
}



function brushStroke(
    x1,
    y1,
    x2,
    y2,
    color,
    width,
    opacity = 1
) {

    ctx.save();

    ctx.globalAlpha = opacity;

    ctx.strokeStyle = color;

    ctx.lineWidth = width;

    ctx.lineCap = "round";

    ctx.beginPath();

    ctx.moveTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.stroke();

    ctx.restore();
}



function drawVase(
    centerX,
    base,
    width,
    height
) {

    const top = base - height;

    const gradient =
        ctx.createLinearGradient(
            centerX - width,
            0,
            centerX + width,
            0
        );

    gradient.addColorStop(
        0,
        "#70834b"
    );

    gradient.addColorStop(
        0.25,
        "#d6a53d"
    );

    gradient.addColorStop(
        0.5,
        "#899650"
    );

    gradient.addColorStop(
        0.75,
        "#e0ad3c"
    );

    gradient.addColorStop(
        1,
        "#60783f"
    );




    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.moveTo(
        centerX - width * 0.45,
        top
    );

    ctx.quadraticCurveTo(
        centerX - width * 0.65,
        top + height * 0.45,
        centerX - width * 0.42,
        base
    );

    ctx.quadraticCurveTo(
        centerX,
        base + 15,
        centerX + width * 0.42,
        base
    );

    ctx.quadraticCurveTo(
        centerX + width * 0.65,
        top + height * 0.45,
        centerX + width * 0.45,
        top
    );

    ctx.closePath();

    ctx.fill();



    ctx.strokeStyle = "#435d38";

    ctx.lineWidth = 5;

    ctx.stroke();


    for (let i = 0; i < 55; i++) {

        const px =
            centerX +
            random(
                -width * 0.42,
                width * 0.42
            );

        const py =
            random(
                top + 8,
                base - 5
            );

        brushStroke(
            px,
            py,
            px + random(-8, 8),
            py + random(6, 18),
            randomItem([
                "#e4b443",
                "#71864a",
                "#b9872d"
            ]),
            random(3, 7),
            0.8
        );
    }



    ctx.fillStyle = "#8b8b4e";

    ctx.beginPath();

    ctx.ellipse(
        centerX,
        top,
        width * 0.47,
        height * 0.07,
        0,
        0,
        TAU
    );

    ctx.fill();
}


function drawStem(
    centerX,
    flowerY,
    top,
    curve
) {

    ctx.strokeStyle = "#54733c";

    ctx.lineWidth = random(
        7,
        12
    );

    ctx.lineCap = "round";

    ctx.beginPath();

    ctx.moveTo(
        centerX,
        top
    );

    ctx.quadraticCurveTo(
        centerX + curve * 0.35,
        (top + flowerY) / 2,
        centerX + curve,
        flowerY
    );

    ctx.stroke();
}

function drawLeaf(
    px,
    py,
    angle,
    scale = 0.7
) {

    ctx.save();

    ctx.translate(
        px,
        py
    );

    ctx.rotate(angle);

    ctx.fillStyle = randomItem([
        "#66853c",
        "#7e9140",
        "#4b7138",
        "#a0a047"
    ]);

    ctx.beginPath();

    ctx.moveTo(
        0,
        0
    );

    ctx.bezierCurveTo(
        30 * scale,
        -25 * scale,
        65 * scale,
        -17 * scale,
        72 * scale,
        0
    );

    ctx.bezierCurveTo(
        48 * scale,
        19 * scale,
        20 * scale,
        22 * scale,
        0,
        0
    );

    ctx.fill();


    brushStroke(
        4 * scale,
        0,
        65 * scale,
        0,
        "#c1a943",
        2.5,
        0.75
    );

    ctx.restore();
}


function drawSunflower(
    centerX,
    centerY,
    radius,
    petals,
    progress
) {

    const count = Math.floor(
        petals * progress
    );


    ctx.save();

    ctx.globalAlpha = 0.13;

    ctx.fillStyle = "#ffbf22";

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        radius * 1.35,
        0,
        TAU
    );

    ctx.fill();

    ctx.restore();



    for (let i = 0; i < count; i++) {

        const angle =
            (i / petals) * TAU -
            Math.PI / 2;

        const length =
            radius *
            random(
                0.75,
                1.05
            );

        const width =
            radius *
            random(
                0.25,
                0.38
            );


        ctx.save();

        ctx.translate(
            centerX,
            centerY
        );

        ctx.rotate(angle);

        ctx.beginPath();

        ctx.moveTo(
            0,
            0
        );

        ctx.bezierCurveTo(
            -width,
            -length * 0.25,

            -width * 0.8,
            -length * 0.78,

            0,
            -length
        );

        ctx.bezierCurveTo(
            width * 0.8,
            -length * 0.78,

            width,
            -length * 0.25,

            0,
            0
        );

        ctx.closePath();


        ctx.fillStyle = randomItem([
            "#f7bd20",
            "#ffc928",
            "#e9a914",
            "#ffd34a",
            "#f3c02e",
            "#d9910d"
        ]);

        ctx.fill();


        brushStroke(
            0,
            -radius * 0.18,

            random(
                -width * 0.15,
                width * 0.15
            ),

            -length * 0.72,

            randomItem([
                "#ffe16a",
                "#c9820d",
                "#f5d34b"
            ]),

            random(2, 5),
            0.8
        );

        ctx.restore();
    }


    if (progress >= 1) {

        const gradient =
            ctx.createRadialGradient(
                centerX - radius * 0.15,
                centerY - radius * 0.15,
                2,

                centerX,
                centerY,
                radius * 0.48
            );

        gradient.addColorStop(
            0,
            "#a66a16"
        );

        gradient.addColorStop(
            0.45,
            "#633b0a"
        );

        gradient.addColorStop(
            1,
            "#2e230a"
        );


        ctx.fillStyle = gradient;

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            radius * 0.43,
            0,
            TAU
        );

        ctx.fill();


        for (let i = 0; i < 65; i++) {

            const angle =
                random(
                    0,
                    TAU
                );

            const distance =
                Math.sqrt(
                    Math.random()
                ) *
                radius *
                0.37;

            const px =
                centerX +
                Math.cos(angle) *
                distance;

            const py =
                centerY +
                Math.sin(angle) *
                distance;


            ctx.fillStyle = randomItem([
                "#d08a18",
                "#8d5511",
                "#4a3109",
                "#b56d13"
            ]);

            ctx.beginPath();

            ctx.arc(
                px,
                py,
                random(1.5, 3.5),
                0,
                TAU
            );

            ctx.fill();
        }
    }
}



function drawBase() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );

    drawBackground();

    drawTable();


    const vaseTop =
        H * 0.77 - 15;

    const vaseBase =
        H * 0.91;



    drawVase(
        W / 2,
        vaseBase,
        95 * S,
        180 * S
    );


    flowers.forEach(
        flower => {

            const p =
                point(
                    flower.x,
                    flower.y
                );


            drawStem(
                p.x,
                p.y,
                vaseTop,
                flower.curve * S
            );


            drawLeaf(
                p.x - 18 * S,
                p.y + 95 * S,
                2.8,
                0.65 * S
            );


            drawLeaf(
                p.x + 8 * S,
                p.y + 135 * S,
                3.65,
                0.55 * S
            );
        }
    );
}



function createSplash(
    px,
    py
) {

    for (let i = 0; i < 5; i++) {

        paintParticles.push({
            x: px + random(-5, 5),
            y: py + random(-5, 5),

            vx: random(
                -1.5,
                1.5
            ),

            vy: random(
                -1.5,
                1.5
            ),

            life: 1,

            color: randomItem([
                "#ffd33e",
                "#ffea7b",
                "#e9a914"
            ])
        });
    }
}


function updatePaintParticles() {

    for (
        let i = paintParticles.length - 1;
        i >= 0;
        i--
    ) {

        const particle =
            paintParticles[i];


        particle.x += particle.vx;

        particle.y += particle.vy;

        particle.life -= 0.04;


        ctx.globalAlpha =
            Math.max(
                0,
                particle.life
            );

        ctx.fillStyle =
            particle.color;


        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            random(1, 3),
            0,
            TAU
        );

        ctx.fill();

        ctx.globalAlpha = 1;


        if (
            particle.life <= 0
        ) {

            paintParticles.splice(
                i,
                1
            );
        }
    }
}



function animatePainting() {

    running = true;

    let flowerIndex = 0;

    let petalIndex = 0;

    let lastFrame = 0;


    function loop(timestamp) {

        if (!running) {
            return;
        }



        if (
            timestamp - lastFrame > 75
        ) {

            lastFrame = timestamp;


            drawBase();



            for (
                let i = 0;
                i < flowerIndex;
                i++
            ) {

                const flower =
                    flowers[i];

                const p =
                    point(
                        flower.x,
                        flower.y
                    );


                drawSunflower(
                    p.x,
                    p.y,
                    flower.r * S,
                    flower.petals,
                    1
                );
            }



            if (
                flowerIndex <
                flowers.length
            ) {

                const flower =
                    flowers[flowerIndex];

                const p =
                    point(
                        flower.x,
                        flower.y
                    );


                const progress =
                    petalIndex /
                    flower.petals;


                drawSunflower(
                    p.x,
                    p.y,
                    flower.r * S,
                    flower.petals,
                    progress
                );



                const angle =
                    progress *
                    TAU -
                    Math.PI / 2;


                createSplash(
                    p.x +
                    Math.cos(angle) *
                    flower.r *
                    S *
                    0.7,

                    p.y +
                    Math.sin(angle) *
                    flower.r *
                    S *
                    0.7
                );


                petalIndex++;



                if (
                    petalIndex >
                    flower.petals + 2
                ) {

                    flowerIndex++;

                    petalIndex = 0;
                }


                label.textContent =
                    `Pintando girasol ${
                        Math.min(
                            flowerIndex + 1,
                            flowers.length
                        )
                    } de ${
                        flowers.length
                    }...`;

            } else {



                running = false;

                label.textContent =
                    "La obra está terminada...";


                setTimeout(() => {

                    finalBox.classList.add(
                        "show"
                    );

                    replay.classList.add(
                        "show"
                    );

                    label.classList.remove(
                        "show"
                    );

                }, 1200);
            }


            updatePaintParticles();
        }




        updatePaintParticles();


        raf =
            requestAnimationFrame(loop);
    }


    raf =
        requestAnimationFrame(loop);
}


start.addEventListener(
    "click",
    () => {

        intro.classList.add(
            "hide"
        );

        label.classList.add(
            "show"
        );


        setTimeout(() => {

            animatePainting();

        }, 650);
    }
);


replay.addEventListener(
    "click",
    () => {

        cancelAnimationFrame(
            raf
        );

        running = false;

        paintParticles = [];


        finalBox.classList.remove(
            "show"
        );

        replay.classList.remove(
            "show"
        );

        intro.classList.remove(
            "hide"
        );

        label.classList.remove(
            "show"
        );


        drawBase();
    }
);



canvas.addEventListener(
    "pointerdown",
    event => {

        if (!running) {
            return;
        }


        const rect =
            canvas.getBoundingClientRect();


        for (let i = 0; i < 12; i++) {

            paintParticles.push({

                x:
                    event.clientX -
                    rect.left,

                y:
                    event.clientY -
                    rect.top,

                vx: random(
                    -2,
                    2
                ),

                vy: random(
                    -2,
                    2
                ),

                life: 1,

                color: randomItem([
                    "#ffd33e",
                    "#ffea7b",
                    "#3d78a8"
                ])
            });
        }
    }
);



drawBase();


setTimeout(() => {

    loading.classList.add(
        "done"
    );

}, 600);