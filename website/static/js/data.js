
// *************************************
// GLOBAL CONSTANTS AND VARIABLES
// *************************************
const degrees = `<span class="text-secondary">` + String.fromCharCode(176) + `</span>`;
const windspeedUnit = `<sup class="text-secondary">m/s</sup>`;

let windirGauge;

// *************************************
// MAIN FUNCTIONS
// *************************************
$('document').ready(function () {
    windirGauge = createWindDirGauge();
    getWeatherData();
});

setTimeout(function () {
    getWeatherData();
}, 30000);

// *************************************
// REALTIME DATA FUNCTIONS
// *************************************
function getWeatherData() {
    $.ajax({
        url: "/api/data",
        type: "GET",
        async: true,
        data: {
            format: 'json'
        },
        dataType: 'json',
        success: function (data) {
            document.getElementById("valTemperature").innerHTML = data.temperature + degrees;
            document.getElementById("valFeelsLike").innerHTML = data.feels_like_temperature + degrees;
            document.getElementById("valWindgust").innerHTML = data.windgust + windspeedUnit;
            windirGauge.value = data.windbearing;
            windirGauge.update({
                units: `${data.windspeedavg} m/s`,
                title: `${data.windbearing}${String.fromCharCode(176)}`,
            });
            // windirGauge.update({
            //     units: `${data.windspeedavg} ${windspeedUnit}`,
            //     title: `${data.windbearing}${degrees}`,
            // });
            document.getElementById("valWinddir").innerHTML = `${windDegreeToCardinal(data.windbearing)}`;
        },
        error: function (error) {
            console.log(error);
        }
    });
}

// *************************************
// GAUGES
// *************************************
function createWindDirGauge() {
    var gauge = new RadialGauge({
        renderTo: 'valWindbearing',
        useMinPath: true,
        width: 130,
        height: 130,
        minValue: 0,
        maxValue: 360,
        majorTicks: [
            "N",
            "NØ",
            "Ø",
            "SØ",
            "S",
            "SV",
            "V",
            "NV",
            "N"
        ],
        minorTicks: 22,
        ticksAngle: 360,
        startAngle: 180,
        strokeTicks: false,
        highlights: false,
        colorPlate: cssVar("color-white"),
        colorMajorTicks: cssVar("color-grey"),
        colorMinorTicks: cssVar("color-grey-light"),
        colorNumbers: cssVar("color-grey"),
        colorNeedle: cssVar("color-red"),
        colorNeedleEnd: cssVar("color-red"),
        colorTitle: cssVar("color-blue"),
        colorUnits: cssVar("color-blue"),
        fontTitleSize: 35,
        fontTitleStyle: "normal",
        fontUnitsSize: 35,
        fontUnitsStyle: "normal",
        fontNumbersSize: 25,
        valueBox: false,
        needleCircleSize: 12,
        needleCircleOuter: false,
        needleCircleInner: true,
        colorNeedleCircleInner: cssVar("color-disabled"),
        colorNeedleCircleInnerEnd: cssVar("color-disabled"),
        animationRule: "linear",
        needleType: "arrow",
        needleStart: 30,
        needleEnd: 95,
        needleWidth: 4,
        borders: true,
        borderInnerWidth: 0,
        borderMiddleWidth: 0,
        borderOuterWidth: 0,
        colorNeedleShadowDown: cssVar("color-transparent"),
        borderShadowWidth: 0,
        animationDuration: 1500

    }).draw();
    return gauge;
}

// *************************************
// HELPER FUNCTIONS
// *************************************

// Read CSS Variable
function cssVar(name, value) {
    if (name[0] != '-') name = '--' + name //allow passing with or without --
    if (value) document.documentElement.style.setProperty(name, value)
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Convert Wind Bearing degrees to Wind Cardinal
function windDegreeToCardinal(bearing) {
    directions = ["N", "NNØ", "NØ", "ØNØ", "Ø", "ØSØ", "SØ", "SSØ", "S", "SSV", "SV", "VSV", "V", "VNV", "NV", "NNV", "N"];
    return directions[Math.round((bearing + 11.25) / 22.5)];
}

