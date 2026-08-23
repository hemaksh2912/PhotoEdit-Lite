/* =========================================================
   PHOTOEDIT LITE
   Image Editor Logic
   ========================================================= */


/* =========================
   DOM ELEMENTS
   ========================= */

const imageInput =
    document.getElementById("imageInput");

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");

const placeholder =
    document.getElementById("placeholder");

const brightness =
    document.getElementById("brightness");

const contrast =
    document.getElementById("contrast");

const grayscale =
    document.getElementById("grayscale");

const blur =
    document.getElementById("blur");

const brightnessValue =
    document.getElementById("brightnessValue");

const contrastValue =
    document.getElementById("contrastValue");

const grayscaleValue =
    document.getElementById("grayscaleValue");

const blurValue =
    document.getElementById("blurValue");

const rotateButton =
    document.getElementById("rotateButton");

const flipHorizontalButton =
    document.getElementById("flipHorizontalButton");

const flipVerticalButton =
    document.getElementById("flipVerticalButton");

const resetButton =
    document.getElementById("resetButton");

const downloadButton =
    document.getElementById("downloadButton");

const zoomIn =
    document.getElementById("zoomIn");

const zoomOut =
    document.getElementById("zoomOut");

const zoomValue =
    document.getElementById("zoomValue");

const fullscreenButton =
    document.getElementById("fullscreenButton");

const canvasWrapper =
    document.getElementById("canvasWrapper");


/* =========================
   VARIABLES
   ========================= */

let image = new Image();

let rotation = 0;

let flipHorizontal = 1;

let flipVertical = 1;

let zoom = 1;


/* =========================
   IMAGE UPLOAD
   ========================= */

imageInput.addEventListener(
    "change",
    function (event) {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }


        /*
            Prevent very large images
            from causing browser problems.
        */

        if (file.size > 10 * 1024 * 1024) {

            alert(
                "Please select an image smaller than 10MB."
            );

            imageInput.value = "";

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                image.onload =
                    function () {

                        rotation = 0;

                        flipHorizontal = 1;

                        flipVertical = 1;

                        zoom = 1;

                        zoomValue.textContent =
                            "100%";


                        canvas.style.display =
                            "block";

                        placeholder.style.display =
                            "none";


                        resetControls();

                        drawImage();

                    };


                image.src =
                    event.target.result;

            };


        reader.readAsDataURL(file);

    }
);


/* =========================
   DRAW IMAGE
   ========================= */

function drawImage() {

    if (!image.src) {
        return;
    }


    const brightnessAmount =
        brightness.value;

    const contrastAmount =
        contrast.value;

    const grayscaleAmount =
        grayscale.value;

    const blurAmount =
        blur.value;


    /*
        Keep preview inside
        reasonable dimensions.
    */

    const maxWidth = 850;

    const maxHeight = 520;


    let scale =
        Math.min(
            1,
            maxWidth / image.width,
            maxHeight / image.height
        );


    scale *= zoom;


    const width =
        image.width * scale;

    const height =
        image.height * scale;


    /*
        Rotated images need
        swapped canvas dimensions.
    */

    if (
        rotation === 90 ||
        rotation === 270
    ) {

        canvas.width =
            height;

        canvas.height =
            width;

    } else {

        canvas.width =
            width;

        canvas.height =
            height;

    }


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.save();


    /*
        Move origin to center.
    */

    ctx.translate(
        canvas.width / 2,
        canvas.height / 2
    );


    /*
        Rotate image.
    */

    ctx.rotate(
        rotation *
        Math.PI /
        180
    );


    /*
        Flip image.
    */

    ctx.scale(
        flipHorizontal,
        flipVertical
    );


    /*
        Apply filters.
    */

    ctx.filter =
        `
        brightness(${brightnessAmount}%)
        contrast(${contrastAmount}%)
        grayscale(${grayscaleAmount}%)
        blur(${blurAmount}px)
        `;


    ctx.drawImage(
        image,
        -width / 2,
        -height / 2,
        width,
        height
    );


    ctx.restore();

}


/* =========================
   SLIDER CONTROLS
   ========================= */

brightness.addEventListener(
    "input",
    function () {

        brightnessValue.textContent =
            `${brightness.value}%`;

        drawImage();

    }
);


contrast.addEventListener(
    "input",
    function () {

        contrastValue.textContent =
            `${contrast.value}%`;

        drawImage();

    }
);


grayscale.addEventListener(
    "input",
    function () {

        grayscaleValue.textContent =
            `${grayscale.value}%`;

        drawImage();

    }
);


blur.addEventListener(
    "input",
    function () {

        blurValue.textContent =
            `${blur.value}px`;

        drawImage();

    }
);


/* =========================
   ROTATE
   ========================= */

rotateButton.addEventListener(
    "click",
    function () {

        if (!image.src) {

            alert(
                "Please upload an image first."
            );

            return;
        }


        rotation += 90;


        if (rotation >= 360) {
            rotation = 0;
        }


        drawImage();

    }
);


/* =========================
   FLIP HORIZONTAL
   ========================= */

flipHorizontalButton.addEventListener(
    "click",
    function () {

        if (!image.src) {

            alert(
                "Please upload an image first."
            );

            return;
        }


        flipHorizontal *= -1;

        drawImage();

    }
);


/* =========================
   FLIP VERTICAL
   ========================= */

flipVerticalButton.addEventListener(
    "click",
    function () {

        if (!image.src) {

            alert(
                "Please upload an image first."
            );

            return;
        }


        flipVertical *= -1;

        drawImage();

    }
);


/* =========================
   RESET
   ========================= */

resetButton.addEventListener(
    "click",
    function () {

        if (!image.src) {
            return;
        }


        resetControls();


        rotation = 0;

        flipHorizontal = 1;

        flipVertical = 1;

        zoom = 1;


        zoomValue.textContent =
            "100%";


        drawImage();

    }
);


function resetControls() {

    brightness.value = 100;

    contrast.value = 100;

    grayscale.value = 0;

    blur.value = 0;


    brightnessValue.textContent =
        "100%";

    contrastValue.textContent =
        "100%";

    grayscaleValue.textContent =
        "0%";

    blurValue.textContent =
        "0px";

}


/* =========================
   DOWNLOAD
   ========================= */

downloadButton.addEventListener(
    "click",
    function () {

        if (!image.src) {

            alert(
                "Please upload an image first."
            );

            return;
        }


        const link =
            document.createElement("a");


        link.download =
            "photoedit-lite-edited.png";


        link.href =
            canvas.toDataURL(
                "image/png"
            );


        link.click();

    }
);


/* =========================
   ZOOM
   ========================= */

zoomIn.addEventListener(
    "click",
    function () {

        if (!image.src) {
            return;
        }


        zoom += 0.1;


        if (zoom > 2) {
            zoom = 2;
        }


        updateZoom();

        drawImage();

    }
);


zoomOut.addEventListener(
    "click",
    function () {

        if (!image.src) {
            return;
        }


        zoom -= 0.1;


        if (zoom < 0.5) {
            zoom = 0.5;
        }


        updateZoom();

        drawImage();

    }
);


function updateZoom() {

    zoomValue.textContent =
        `${Math.round(zoom * 100)}%`;

}


/* =========================
   FULLSCREEN
   ========================= */

fullscreenButton.addEventListener(
    "click",
    function () {

        if (
            document.fullscreenElement
        ) {

            document.exitFullscreen();

        } else {

            canvasWrapper.requestFullscreen();

        }

    }
);


/* =========================
   THEME BUTTONS
   ========================= */

const themeButton =
    document.getElementById(
        "themeButton"
    );

const moonButton =
    document.getElementById(
        "moonButton"
    );


themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "light-highlight"
        );

    }
);


moonButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );

    }
);