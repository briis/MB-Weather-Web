
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

let owl;
let pressureGauge;
let sunHeader, sunTime;
let windirGauge;

let forecastDailyData = [];
let forecastHourlyData = [];
let liveData = [];
let minuteData = [];
let monthData = [];

// *************************************
// STARTUP FUNCTIONS
// *************************************
$('document').ready(function () {
    moment.locale('da');
    // windirGauge = createWindDirGauge();
    pressureGauge = createPressureGauge();
    getWeatherData();
    getDailyForecastData();
    getHourlyForecastData();
    loadChartData();

    // Update data every 30 seconds
    setInterval(function () {
        getWeatherData();
    }, 15000);
    // Update daily forecast every 15 minutes
    setInterval(function () {
        getDailyForecastData();
        getHourlyForecastData();
    }, 900000);
    // Update Chart data every 10 minutes
    setInterval(function () {
        loadChartData();
    }, 600000);

    // Add Modal Eventlisteners
    const modalDefinition = document.getElementById("modalDefinition");
    if (modalDefinition) {
        modalDefinition.addEventListener('show.bs.modal', function (event) {
            const triggerLink = event.relatedTarget;
            const caller = triggerLink.getAttribute('data-bs-caller');
            displayModal(caller);
        });
        modalDefinition.addEventListener('hidden.bs.modal', function () {
            const modalTitle = document.querySelector('.modal-title');
            const modalIcon = document.querySelector('.modal-icon');
            const modalBody = document.querySelector('.modal-body');
            modalTitle.innerHTML = 'Funktion ikke udviklet';
            modalBody.innerHTML = 'Denne funktion er under udvikling. Kom tilbage senere.';
            modalIcon.innerHTML = `<span class="material-icons circle-font bg-grey">info</span>`;
        });
    }
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
            liveData = data;
            // ** Temperature Widget **
            document.getElementById("valTemperature").innerHTML = data.temperature + degrees;
            document.getElementById("valFeelsLike").innerHTML = data.feels_like_temperature + degrees;
            document.getElementById("valTempMax").innerHTML = data.tempmax + degrees;
            document.getElementById("valTempMin").innerHTML = data.tempmin + degrees;
            document.getElementById("valWindgust").innerHTML = data.windgust.toFixed(1) + `<span class="text-secondary"> m/s</span>`;
            // ** Wind Widget **
            drawWindCompass(data.windbearing, data.windspeedavg.toFixed(1));
            // ** Rain Widget **
            document.getElementById("valRainToday").innerHTML = data.raintoday.toFixed(1) + rainUnit;
            // document.getElementById("valRainForecastToday").innerHTML = '';
            document.getElementById("valRainRate").innerHTML = data.rainrate.toFixed(1) + rainRateUnit;
            // ** UV Index Widget **
            document.getElementById("valUvIndex").innerHTML = data.uv.toFixed(1);
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
            forecastDailyData = data;
            // ** Sun Time Widget **
            if (moment().isBefore(moment(moment.unix(data[0].sunriseepoch)))) {
                sunHeader = 'Solopgang';
                sunTime = moment.unix(data[0].sunriseepoch);
                document.getElementById("valSunHeader").innerHTML = sunHeader;
                document.getElementById('valSunIcon').innerHTML = `<img src="/static/images/weather/sunrise.svg" height="60px" width="60px">`;
                document.getElementById("valSunTime").innerHTML = sunTime.format('HH:mm');
                document.getElementById('valSunNextChange').innerHTML = `Sol ned: ${moment(moment.unix(data[0].sunsetepoch)).format('HH:mm')}`;
            } else if (moment().isAfter(moment(moment.unix(data[0].sunriseepoch))) && moment().isBefore(moment(moment.unix(data[0].sunsetepoch)))) {
                sunHeader = 'Solnedgang';
                sunTime = moment.unix(data[0].sunsetepoch);
                document.getElementById("valSunHeader").innerHTML = 'Solnedgang';
                document.getElementById('valSunIcon').innerHTML = `<img src="/static/images/weather/sunset.svg" height="60px" width="60px">`;
                document.getElementById("valSunTime").innerHTML = sunTime.format('HH:mm');
                document.getElementById('valSunNextChange').innerHTML = `Sol op: ${moment(moment.unix(data[1].sunriseepoch)).format('HH:mm')} i morgen`;
            } else {
                sunHeader = 'Solopgang';
                sunTime = moment.unix(data[1].sunriseepoch);
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
                html_data += `<div class="fw-bold">${moment.utc(element.datetime).format("D. MMM")}</div>`;
                html_data += `</div>`;
                html_data += `</div>`;
                html_data += `<div class="row">`;
                html_data += `<div class="col d-flex justify-content-center fs-7">`;
                html_data += `<div><span class="fg-red">${element.temperature.toFixed(0)}</span>&deg; | <span class="fg-blue">${element.temp_low.toFixed(0)}</span>&deg;</div>`;
                html_data += `</div>`;
                html_data += `</div>`;

                html_data += `<div class="row">`;
                html_data += `<div class="col d-flex justify-content-center fs-7">`;
                html_data += `<div><span class="material-icons fg-blue fs-7">water_drop</span> <span>${element.precipitation.toFixed(1)}<sup>mm</sup></span></div>`;
                html_data += `</div>`;
                html_data += `</div>`;

                html_data += `<div class="row">`;
                html_data += `<div class="col d-flex justify-content-center fs-7">`;
                html_data += `<div><span class="wi wi-direction-${windDegreeToWindSymbol(element.wind_bearing)} fs-6 fw-bold"></span> ${element.wind_speed.toFixed(1)}<sup>m/s</sup></div>`;
                // html_data += `<div><span class="wi wi-wind from-${windDegreeToSymbol(element.wind_bearing)}-deg fs-6 fw-semibold"></span> ${element.wind_speed.toFixed(1)}<sup>m/s</sup></div>`;
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
            forecastHourlyData = data;
        },
        error: function (error) {
            console.log('Hourly Forecast Data load error: ' + error);
        }
    });
}


// *************************************
// CHART DATA FUNCTIONS
// *************************************
function loadChartData() {
    $.ajax({
        url: "/api/minute_data",
        type: "GET",
        async: true,
        data: {
            format: 'json'
        },
        dataType: 'json',
        success: function (data) {
            minuteData = data;
        },
        error: function (error) {
            console.log('Minute Chart Data load error: ' + error);
        }
    });
    $.ajax({
        url: "/api/monthly_data",
        type: "GET",
        async: true,
        data: {
            format: 'json'
        },
        dataType: 'json',
        success: function (data) {
            monthData = data;
        },
        error: function (error) {
            console.log('Minute Chart Data load error: ' + error);
        }
    });

}

// *************************************
// MODAL FUNCTIONS
// *************************************

function displayModal(caller) {
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    if (caller == 'forecast') {
        setupForecastModal(modalTitle, modalBody);
    } else if (caller == 'temperature') {
        setupTemperatureModal(modalTitle, modalBody);
    } else if (caller == 'wind') {
        setupWindModal(modalTitle, modalBody);
    } else if (caller == 'rain') {
        setupRainModal(modalTitle, modalBody);
    } else if (caller == 'uv') {
        setupUVModal(modalTitle, modalBody);
    } else if (caller == 'sunriseset') {
        setupSunModal(modalTitle, modalBody);
    } else if (caller == 'humidity') {
        setupHumidityModal(modalTitle, modalBody);
    } else if (caller == 'pressure') {
        setupPressureModal(modalTitle, modalBody);
    } else if (caller == 'aqi') {
        setupAqiModal(modalTitle, modalBody);
    } else if (caller == 'visibility') {
        setupVisibilityModal(modalTitle, modalBody);
    }
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
    if (value < 1) { return 'Det er diset eller tåget'; }
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
    if (uvi == 0) { return 'Solen er nede'; }
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

// Convert Wind Bearing degrees to Wind Font Symbol
function windDegreeToSymbol(bearing) {
    directions = ["0", "23", "45", "68", "90", "113", "135", "158", "180", "203", "225", "248", "270", "293", "313", "336", "0"];
    return directions[Math.round((bearing + 11.25) / 22.5)];
}


// Convert Wind Bearing degrees to Wind Cardinal
function windDegreeToWindSymbol(bearing) {
    const directions = ["down", "down-left", "left", "up-left", "up", "up-right", "right", "down-right"];
    const index = Math.floor((bearing + 22.5) / 45);
    return directions[index % 8];
}

//check if the number is even
function isEvenRow(number) {
    if (number % 2 === 0) {
        return "bg-grey-light text-secondary-emphasis";
    } else {
        return "text-secondary-emphasis";
    }
}

// Translate Feels Like Temperature to Text
function feelsLikeToText(temp) {
    if (temp <= 10) {
        return `Vind får det til at føles koldere.`;
    }
    if (temp >= 26) {
        return `Høj luftfugtighed får det til at føles varmere.`;
    }
    return ``;
}

// Is Dayligt increasing or decreasing
function isDayLengthIncreasing() {
    let summerSun = moment("21-03", "DD-MM");
    let winterSun = moment("22-09", "DD-MM");
    return moment().isBetween(summerSun, winterSun);
}

// Calculate Day Length
function dayLength(startTime, endTime) {
    let start = moment(startTime, "HH:mm");
    let end = moment(endTime, "HH:mm");
    let duration = moment.duration(end.diff(start));
    let hours = parseInt(duration.asHours());
    let minutes = parseInt(duration.asMinutes()) - (hours * 60);
    return `${hours} t. og ${minutes} min.`;
}

// Calculate remaining dayligt
function remainingDayLight(sunset) {
    let start = moment();
    let end = moment(sunset, "HH:mm");
    let duration = moment.duration(end.diff(start));
    let hours = parseInt(duration.asHours());
    let minutes = parseInt(duration.asMinutes()) - (hours * 60);
    return `${hours} t. og ${minutes} min.`;
}
function calculateDayLengthIncrease() {
    const equinox = moment("20-03", "DD-MM"); // Assuming the equinox date is March 20th
    const today = moment();
    const daysSinceEquinox = today.diff(equinox, 'days');
    const increasePerDay = 2; // Assuming the day length increases by 2 minutes per day
    const increaseSinceEquinox = daysSinceEquinox * increasePerDay;
    const hoursIncreased = Math.floor(increaseSinceEquinox / 60);
    const minutesIncreased = increaseSinceEquinox % 60;
    return `${hoursIncreased} t. og ${minutesIncreased} min.`;
}

function calculateDayLengthDecrease() {
    const equinox = moment("22-09", "DD-MM"); // Assuming the equinox date is March 20th
    const today = moment();
    const daysSinceEquinox = today.diff(equinox, 'days');
    const decreasePerDay = 2; // Assuming the day length decreases by 2 minutes per day
    const decreaseSinceEquinox = daysSinceEquinox * decreasePerDay;
    const hoursDecreased = Math.floor(decreaseSinceEquinox / 60);
    const minutesDecreased = decreaseSinceEquinox % 60;
    return `${hoursDecreased} t. og ${minutesDecreased} min.`;
}

function calculateTimeDifference(endTime) {
    let hours = endTime.diff(moment(), "hours");
    let minutes = endTime.diff(moment(), "minutes") % 60;
    return `${hours} t. og ${minutes} min.`;
}

// Translate AQI value to Recommended Description
function aqiValueToRecommend(aqi) {
    if (aqi <= 50) { return 'Luftkvaliteten er god. Udfør dine sædvanlige udendørsaktiviteter.'; }
    if (aqi > 50 && aqi <= 100) { return 'Udfør dine sædvanlige udendørsaktiviteter.'; }
    if (aqi > 100 && aqi <= 150) { return 'For sensitive grupper, overvej at reducere intense udendørsaktiviteter, hvis du oplever symptomer.'; }
    if (aqi > 150 && aqi <= 200) { return 'Overvej at reducere intense udendørsaktiviteter, hvis du oplever symptomer som irriterede øjne, hoste eller ondt i halsen.'; }
    if (aqi > 200 && aqi <= 300) { return 'Reducér fysiske aktiviteter, især udendørs, navnlig hvis du oplever symptomer.'; }
    return 'Undgå fysiske udendørsaktiviteter.';
}

// Convert Degrees to Radians
function degrees_to_radians(degrees) {
    return degrees * Math.PI / 180;
};
