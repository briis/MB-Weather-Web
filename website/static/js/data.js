
// *************************************
// GLOBAL CONSTANTS AND VARIABLES
// *************************************
const degrees = `<span class="text-secondary">` + String.fromCharCode(176) + `</span>`;
const pressureUnit = `<sup class="text-secondary">hPa</sup>`;
const rainUnit = `<sup class="text-secondary">mm</sup>`;
const rainRateUnit = `<sup class="text-secondary">mm/t</sup>`;
const SolarRadUnit = `<sup class="text-secondary">W/m²</sup>`;
const visibilityUnit = `<sup class="text-secondary">km</sup>`;
const windspeedUnit = `<sup class="text-secondary">m/s</sup>`;
const uviMax = 12;

let windirGauge;
let pressureGauge;
let owl;


// *************************************
// STARTUP FUNCTIONS
// *************************************
$('document').ready(function () {
    moment.locale('da');
    windirGauge = createWindDirGauge();
    pressureGauge = createPressureGauge();
    getWeatherData();
    getDailyForecastData();
    getHourlyForecastData();


    setInterval(function () {
        getWeatherData();
    }, 30000);

    setInterval(function () {
        getDailyForecastData();
        getHourlyForecastData();
    }, 150000);

});

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
            // ** Temperature Widget **
            document.getElementById("valTemperature").innerHTML = data.temperature + degrees;
            document.getElementById("valFeelsLike").innerHTML = data.feels_like_temperature + degrees;
            document.getElementById("valTempMax").innerHTML = data.tempmax + degrees;
            document.getElementById("valTempMin").innerHTML = data.tempmin + degrees;
            document.getElementById("valWindgust").innerHTML = data.windgust + windspeedUnit;
            // ** Wind Widget **
            windirGauge.value = data.windbearing;
            windirGauge.update({
                units: `${data.windspeedavg.toFixed(1)} m/s`,
                title: `${data.windbearing}${String.fromCharCode(176)}`,
            });
            document.getElementById("valWinddir").innerHTML = `${windDegreeToCardinal(data.windbearing)}`;
            // ** Rain Widget **
            document.getElementById("valRainToday").innerHTML = data.raintoday.toFixed(1) + rainUnit;
            // document.getElementById("valRainForecastToday").innerHTML = '';
            document.getElementById("valRainRate").innerHTML = data.rainrate.toFixed(1) + rainRateUnit;
            // ** UV Index Widget **
            document.getElementById("valUvIndex").innerHTML = data.uv.toFixed(0);
            document.getElementById("valUvDescription").innerHTML = uvindexToText(data.uv);
            document.getElementById('valUvDot').style.left = `${uviDotPosition(data.uv)}%`;
            document.getElementById("valSolarRad").innerHTML = data.solarrad + SolarRadUnit;
            // ** Air Quality Widget **
            document.getElementById("valAqi").innerHTML = data.aqi.toFixed(0);
            document.getElementById("valAqiDescription").innerHTML = aqiValueToText(data.aqi);
            document.getElementById('valAqiDot').style.left = `${aqiDotPosition(data.aqi)}%`;
            // ** Humidity Widget **
            document.getElementById("valHumidity").innerHTML = data.humidity.toFixed(0) + '%';
            document.getElementById("valDewPointText").innerHTML = `Dugpunktet er ${data.dewpoint.toFixed(0)}${degrees} lige nu.`;
            // ** Pressure Widget **
            pressureGauge.value = data.sealevelpressure;
            pressureGauge.update();
            pressure_values = pressureTrend(data.pressuretrend);
            document.getElementById('valPressureTrend').innerHTML = `<span class="material-icons material-font fs-8 ${pressure_values[2]}">${pressure_values[1]}</span> ${pressure_values[0]}`;
            document.getElementById("valPressure").innerHTML = data.sealevelpressure.toFixed(0) + pressureUnit;
            // ** Visibility Widget **
            document.getElementById("valVisibility").innerHTML = data.visibility.toFixed(0) + visibilityUnit;
            document.getElementById("valVisibilityText").innerHTML = visibilityText(data.visibility);

        },
        error: function (error) {
            console.log('Data load error: ' + error);
        }
    });
}


// *************************************
// DAILY FORECAST FUNCTIONS
// *************************************
function getDailyForecastData() {
    $.ajax({
        url: "/api/daily",
        type: "GET",
        async: true,
        data: {
            format: 'json'
        },
        dataType: 'json',
        success: function (data) {
            // ** Sun Time Widget **
            if (moment().isBefore(moment(moment.unix(data[0].sunriseepoch)))) {
                document.getElementById("valSunHeader").innerHTML = 'Solopgang';
                document.getElementById('valSunIcon').innerHTML = `<img src="/static/images/weather/sunrise.svg" height="60px" width="60px">`;
                document.getElementById("valSunTime").innerHTML = moment.unix(data[0].sunriseepoch).format('HH:mm');
                document.getElementById('valSunNextChange').innerHTML = `Sol ned: ${moment(moment.unix(data[0].sunsetepoch)).format('HH:mm')}`;
            } else if (moment().isAfter(moment(moment.unix(data[0].sunriseepoch))) && moment().isBefore(moment(moment.unix(data[0].sunsetepoch)))) {
                document.getElementById("valSunHeader").innerHTML = 'Solnedgang';
                document.getElementById('valSunIcon').innerHTML = `<img src="/static/images/weather/sunset.svg" height="60px" width="60px">`;
                document.getElementById("valSunTime").innerHTML = moment.unix(data[0].sunsetepoch).format('HH:mm');
                document.getElementById('valSunNextChange').innerHTML = `Sol op: ${moment(moment.unix(data[1].sunriseepoch)).format('HH:mm')} i morgen`;
            } else {
                let prefix = '';
                if (moment().hour() <= 23) { prefix = 'i morgen'; }
                document.getElementById("valSunHeader").innerHTML = 'Solopgang';
                document.getElementById('valSunIcon').innerHTML = `<img src="/static/images/weather/sunrise.svg" height="60px" width="60px">`;
                document.getElementById("valSunTime").innerHTML = moment.unix(data[1].sunriseepoch).format('HH:mm');
                document.getElementById('valSunNextChange').innerHTML = `Sol ned: ${moment(moment.unix(data[1].sunsetepoch)).format('HH:mm')} ${prefix}`;
            }

            if (owl) { $(".owl-carousel").owlCarousel('destroy'); }
            document.getElementById("elemForecastSlider").innerHTML = '';
            html_data = ``;
            data.forEach(element => {
                html_data += `<div class="card slider">`;
                html_data += `<div class="img-wrapper">`;
                html_data += `<img src="/static/images/weather/${element.icon}.svg" class="d-block w-100" alt="...">`;
                html_data += `</div>`;
                html_data += `<div class="card-body p-1">`;
                html_data += `<div class="row">`;
                html_data += `<div class="col d-flex justify-content-center fs-6">`;
                html_data += `<div class="fw-bold">${moment(element.datetime).format("D. MMM")}</div>`;
                html_data += `</div>`;
                html_data += `</div>`;
                html_data += `<div class="row">`;
                html_data += `<div class="col d-flex justify-content-center fs-7">`;
                html_data += `<div><span class="fg-red">${element.temperature.toFixed(0)}</span>&deg; | <span class="fg-blue">${element.temp_low.toFixed(0)}</span>&deg;</div>`;
                html_data += `</div>`;
                html_data += `</div>`;
                html_data += `<div class="row">`;
                html_data += `<div class="col d-flex justify-content-center fs-7">`;
                html_data += `<div>${element.precipitation.toFixed(1)} mm</div>`;
                html_data += `</div>`;
                html_data += `</div>`;
                html_data += `</div>`;
                html_data += `</div>`;
            });

            document.getElementById("elemForecastSlider").innerHTML = html_data;
            owl = $(".owl-carousel");
            owl.owlCarousel({
                loop: false,
                margin: 10,
                nav: false,
                dots: false,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 3,
                    },
                    600: {
                        items: 5,
                    },
                    1000: {
                        items: 7,
                        nav: true,
                    }
                }
            });

        },
        error: function (error) {
            console.log('Daily Forecast Data load error: ' + error);
        }
    });
}


// *************************************
// HOURLYD FORECAST FUNCTIONS
// *************************************
function getHourlyForecastData() {
    $.ajax({
        url: "/api/hourly",
        type: "GET",
        async: true,
        data: {
            format: 'json'
        },
        dataType: 'json',
        success: function (data) {
            // console.log(data);
        },
        error: function (error) {
            console.log('Hourly Forecast Data load error: ' + error);
        }
    });
}

// *************************************
// GAUGES
// *************************************
function createWindDirGauge() {
    let gauge = new RadialGauge({
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

function createPressureGauge() {
    let gauge = new RadialGauge({
        renderTo: 'valPressureGauge',
        useMinPath: true,
        width: 130,
        height: 130,
        minValue: 960,
        maxValue: 1060,
        majorTicks: [
            "960",
            "980",
            "1000",
            "1020",
            "1040",
            "1060"
        ],
        minorTicks: 22,
        ticksAngle: 270,
        startAngle: 45,
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
        fontNumbersSize: 30,
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


// Get AQI Dot position
function aqiDotPosition(aqi) {
    if (aqi == 0) { return 0; }
    if (aqi > 200) { aqiMax = 400; } else { aqiMax = 300; }
    return parseInt(aqi * 100 / aqiMax);
}

// Translate AQI value to Text
function aqiValueToText(aqi) {
    if (aqi <= 50) { return 'God'; }
    if (aqi > 50 && aqi <= 100) { return 'Moderat'; }
    if (aqi > 100 && aqi <= 150) { return 'Usund for sensitive grupper'; }
    if (aqi > 150 && aqi <= 200) { return 'Usund'; }
    if (aqi > 200 && aqi <= 300) { return 'Meget usund'; }
    return 'Farlig';
}

// Read CSS Variable
function cssVar(name, value) {
    if (name[0] != '-') name = '--' + name //allow passing with or without --
    if (value) document.documentElement.style.setProperty(name, value)
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Translate Feels Like Temperature to Text
function feelsLikeToText(temp) {
    if (temp <= 10) {
        return `Vind får det til at føles koldere`;
    }
    if (temp >= 26) {
        return `Høj luftfugtighed får det til at føles varmere`;
    }
    return ``;
}

// Calculate Pressure Trend
function pressureTrend(value) {
    value = parseFloat(value);
    if (value > 0) {
        return ["Stiger", "trending_up", "fg-green"];
    } else if (value < 0) {
        return ["Falder", "trending_down", "fg-red"];
    }

    return ["Stabil", "trending_flat", "text-secondary"];
}

// Get Visibility Text
function visibilityText(value) {
    value = parseFloat(value);
    if (value < 1) { return 'Det er tåget tåget'; }
    if (value >= 1 && value < 5) { return 'Der er dårlig sigtbarhed'; }
    if (value >= 5 && value < 10) { return 'Sigtbarheden er moderat'; }
    return 'Det er helt klart lige nu';
}
// Get Uvi Dot position
function uviDotPosition(uvi) {
    if (uvi == 0) { return 0; }
    return parseInt(uvi * 100 / uviMax);
}

// Translate UV index to Text
function uvindexToText(uvi) {
    if (uvi < 3) { return 'Lav'; }
    if (uvi >= 3 && uvi < 6) { return 'Moderat'; }
    if (uvi >= 6 && uvi < 8) { return 'Høj'; }
    if (uvi >= 8 && uvi < 10) { return 'Meget høj'; }
    return 'Ekstrem';
}

// Convert Wind Bearing degrees to Wind Cardinal
function windDegreeToCardinal(bearing) {
    directions = ["N", "NNØ", "NØ", "ØNØ", "Ø", "ØSØ", "SØ", "SSØ", "S", "SSV", "SV", "VSV", "V", "VNV", "NV", "NNV", "N"];
    return directions[Math.round((bearing + 11.25) / 22.5)];
}

