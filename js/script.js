const colorPicker =
    document.getElementById("colorPicker");

const colorPreview =
    document.getElementById("colorPreview");

const previewHex =
    document.getElementById("previewHex");

const hexValue =
    document.getElementById("hexValue");

const rgbValue =
    document.getElementById("rgbValue");

const hslValue =
    document.getElementById("hslValue");

const palette =
    document.getElementById("palette");

const randomButton =
    document.getElementById("randomColor");

const saveButton =
    document.getElementById("saveColor");

const savedColorsContainer =
    document.getElementById("savedColors");

const clearButton =
    document.getElementById("clearColors");

const toast =
    document.getElementById("toast");


let currentColor = "#74C69D";


let savedColors =
    JSON.parse(
        localStorage.getItem("ingfoWarnaColors")
    ) || [];


/* =========================
   HEX TO RGB
========================= */

function hexToRgb(hex) {

    hex =
        hex.replace("#", "");


    const r =
        parseInt(
            hex.substring(0, 2),
            16
        );


    const g =
        parseInt(
            hex.substring(2, 4),
            16
        );


    const b =
        parseInt(
            hex.substring(4, 6),
            16
        );


    return {
        r,
        g,
        b
    };
}


/* =========================
   RGB TO HSL
========================= */

function rgbToHsl(r, g, b) {

    r /= 255;
    g /= 255;
    b /= 255;


    const max =
        Math.max(r, g, b);


    const min =
        Math.min(r, g, b);


    let h;
    let s;


    const l =
        (max + min) / 2;


    if (max === min) {

        h = 0;
        s = 0;

    } else {

        const d =
            max - min;


        s =
            l > 0.5
                ? d / (2 - max - min)
                : d / (max + min);


        switch (max) {

            case r:

                h =
                    (g - b) / d +
                    (g < b ? 6 : 0);

                break;


            case g:

                h =
                    (b - r) / d + 2;

                break;


            case b:

                h =
                    (r - g) / d + 4;

                break;

        }


        h /= 6;
    }


    return {

        h:
            Math.round(
                h * 360
            ),

        s:
            Math.round(
                s * 100
            ),

        l:
            Math.round(
                l * 100
            )

    };
}


/* =========================
   RGB TO HEX
========================= */

function rgbToHex(r, g, b) {

    return (
        "#" +

        [r, g, b]

            .map(value =>

                value
                    .toString(16)
                    .padStart(2, "0")

            )

            .join("")

            .toUpperCase()
    );
}


/* =========================
   UPDATE COLOR
========================= */

function updateColor(hex) {

    currentColor =
        hex.toUpperCase();


    colorPicker.value =
        currentColor;


    colorPreview.style.background =
        currentColor;


    previewHex.textContent =
        currentColor;


    hexValue.textContent =
        currentColor;


    const {
        r,
        g,
        b
    } = hexToRgb(currentColor);


    rgbValue.textContent =
        `rgb(${r}, ${g}, ${b})`;


    const {
        h,
        s,
        l
    } = rgbToHsl(r, g, b);


    hslValue.textContent =
        `hsl(${h}, ${s}%, ${l}%)`;


    updatePreviewText(
        r,
        g,
        b
    );


    generatePalette(
        r,
        g,
        b
    );
}


/* =========================
   PREVIEW TEXT CONTRAST
========================= */

function updatePreviewText(r, g, b) {

    const brightness =
        (
            r * 299 +
            g * 587 +
            b * 114
        ) / 1000;


    const previewContent =
        document.querySelector(
            ".preview-content"
        );


    if (brightness > 170) {

        previewContent.style.color =
            "#203127";

    } else {

        previewContent.style.color =
            "#ffffff";

    }
}


/* =========================
   GENERATE PALETTE
========================= */

function generatePalette(r, g, b) {

    palette.innerHTML = "";


    const mixes = [
        0.75,
        0.5,
        0,
        -0.25,
        -0.5
    ];


    mixes.forEach(amount => {

        let newR;
        let newG;
        let newB;


        if (amount >= 0) {

            newR =
                Math.round(
                    r +
                    (255 - r) * amount
                );


            newG =
                Math.round(
                    g +
                    (255 - g) * amount
                );


            newB =
                Math.round(
                    b +
                    (255 - b) * amount
                );

        } else {

            const factor =
                1 + amount;


            newR =
                Math.round(
                    r * factor
                );


            newG =
                Math.round(
                    g * factor
                );


            newB =
                Math.round(
                    b * factor
                );

        }


        const hex =
            rgbToHex(
                newR,
                newG,
                newB
            );


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "palette-color";


        item.style.background =
            hex;


        item.innerHTML =
            `<span>${hex}</span>`;


        item.title =
            `Salin ${hex}`;


        item.addEventListener(
            "click",
            () => {

                copyText(hex);

            }
        );


        palette.appendChild(
            item
        );

    });

}


/* =========================
   RANDOM COLOR
========================= */

randomButton.addEventListener(
    "click",
    () => {

        const random =
            Math.floor(
                Math.random() * 16777215
            )

                .toString(16)

                .padStart(6, "0");


        updateColor(
            "#" + random
        );

    }
);


/* =========================
   COLOR PICKER
========================= */

colorPicker.addEventListener(
    "input",
    event => {

        updateColor(
            event.target.value
        );

    }
);


/* =========================
   COPY VALUES
========================= */

document
    .querySelectorAll(
        ".value-row"
    )
    .forEach(row => {

        const button =
            row.querySelector(
                ".copy-btn"
            );


        button.addEventListener(
            "click",
            () => {

                const type =
                    row.dataset.copy;


                let text = "";


                if (type === "hex") {

                    text =
                        hexValue.textContent;

                }


                if (type === "rgb") {

                    text =
                        rgbValue.textContent;

                }


                if (type === "hsl") {

                    text =
                        hslValue.textContent;

                }


                copyText(text);

            }
        );

    });


/* =========================
   COPY FUNCTION
========================= */

function copyText(text) {

    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(text)
            .then(() => {

                showToast(
                    `${text} tersalin`
                );

            })

            .catch(() => {

                fallbackCopy(text);

            });

    } else {

        fallbackCopy(text);

    }

}


/* =========================
   FALLBACK COPY
========================= */

function fallbackCopy(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.value =
        text;


    textarea.style.position =
        "fixed";


    textarea.style.opacity =
        "0";


    document.body.appendChild(
        textarea
    );


    textarea.focus();

    textarea.select();


    try {

        document.execCommand(
            "copy"
        );


        showToast(
            `${text} tersalin`
        );

    } catch {

        showToast(
            "Gagal menyalin"
        );

    }


    textarea.remove();
}


/* =========================
   SAVE COLOR
========================= */

saveButton.addEventListener(
    "click",
    () => {

        if (
            savedColors.includes(
                currentColor
            )
        ) {

            showToast(
                "Warna sudah tersimpan"
            );

            return;
        }


        savedColors.unshift(
            currentColor
        );


        localStorage.setItem(
            "ingfoWarnaColors",
            JSON.stringify(
                savedColors
            )
        );


        renderSavedColors();


        showToast(
            `${currentColor} disimpan`
        );

    }
);


/* =========================
   RENDER SAVED COLORS
========================= */

function renderSavedColors() {

    savedColorsContainer.innerHTML =
        "";


    if (
        savedColors.length === 0
    ) {

        savedColorsContainer.innerHTML = `

            <div class="empty-state">

                <span>♡</span>

                <p>
                    Belum ada warna tersimpan.
                </p>

            </div>

        `;


        return;
    }


    savedColors.forEach(
        (color, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "saved-item";


            item.innerHTML = `

                <div
                    class="saved-preview"
                    style="background:${color}"
                    title="Gunakan ${color}"
                ></div>


                <div class="saved-info">

                    <span title="Salin ${color}">
                        ${color}
                    </span>

                    <button
                        class="delete-color"
                        type="button"
                        title="Hapus warna"
                    >
                        ×
                    </button>

                </div>

            `;


            const preview =
                item.querySelector(
                    ".saved-preview"
                );


            const colorText =
                item.querySelector(
                    ".saved-info span"
                );


            const deleteButton =
                item.querySelector(
                    ".delete-color"
                );


            /* USE COLOR */

            preview.addEventListener(
                "click",
                () => {

                    updateColor(
                        color
                    );


                    window.scrollTo({

                        top: 0,

                        behavior:
                            "smooth"

                    });

                }
            );


            /* COPY SAVED COLOR */

            colorText.addEventListener(
                "click",
                () => {

                    copyText(
                        color
                    );

                }
            );


            /* DELETE */

            deleteButton.addEventListener(
                "click",
                () => {

                    deleteColor(
                        index
                    );

                }
            );


            savedColorsContainer
                .appendChild(
                    item
                );

        }
    );

}


/* =========================
   DELETE COLOR
========================= */

function deleteColor(index) {

    const deletedColor =
        savedColors[index];


    savedColors.splice(
        index,
        1
    );


    localStorage.setItem(
        "ingfoWarnaColors",
        JSON.stringify(
            savedColors
        )
    );


    renderSavedColors();


    showToast(
        `${deletedColor} dihapus`
    );

}


/* =========================
   CLEAR ALL
========================= */

clearButton.addEventListener(
    "click",
    () => {

        if (
            savedColors.length === 0
        ) {

            showToast(
                "Belum ada warna tersimpan"
            );

            return;
        }


        const confirmClear =
            confirm(
                "Hapus semua warna tersimpan?"
            );


        if (!confirmClear) {

            return;

        }


        savedColors = [];


        localStorage.removeItem(
            "ingfoWarnaColors"
        );


        renderSavedColors();


        showToast(
            "Semua warna dihapus"
        );

    }
);


/* =========================
   TOAST
========================= */

let toastTimer;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            1800
        );

}


/* =========================
   START APP
========================= */

updateColor(
    currentColor
);


renderSavedColors();
