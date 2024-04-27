
// *************************************
// GLOBAL CONSTANTS AND VARIABLES
// *************************************
const degrees = `<span class="text-secondary">` + String.fromCharCode(176) + `</span>`;
const windspeedUnit = `<sup class="text-secondary">m/s</sup>`;
const rainUnit = `<sup class="text-secondary">mm</sup>`;
const rainRateUnit = `<sup class="text-secondary">mm/t</sup>`;
const SolarRadUnit = `<sup class="text-secondary">W/m²</sup>`;
const uviMax = 12;

let windirGauge;

// *************************************
// MAIN FUNCTIONS
// *************************************
$('document').ready(function () {
    windirGauge = createWindDirGauge();
    getWeatherData();
    getDailyForecastData();
    getHourlyForecastData();
});

setTimeout(function () {
    getWeatherData();
}, 30000);

setTimeout(function () {
    getDailyForecastData();
    getHourlyForecastData();
}, 300000);

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
            document.getElementById("valRainForecastToday").innerHTML = '';
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
            console.log(data);
            // ** Sun Time Widget **
            if (moment().isBefore(moment(moment.unix(data[0].sunriseepoch)))) {
                document.getElementById("valSunHeader").innerHTML = 'Solopgang';
                document.getElementById('valSunIcon').innerHTML = `<img src="/static/images/weather/sunrise-light.svg" height="60px" width="60px">`;
                document.getElementById("valSunTime").innerHTML = moment.unix(data[0].sunriseepoch).format('HH:mm');
                document.getElementById('valSunNextChange').innerHTML = `Sol ned: ${moment(moment.unix(data[0].sunsetepoch)).format('HH:mm')}`;
            } else if (moment().isAfter(moment(moment.unix(data[0].sunriseepoch))) && moment().isBefore(moment(moment.unix(data[0].sunsetepoch)))) {
                document.getElementById("valSunHeader").innerHTML = 'Solnedgang';
                document.getElementById('valSunIcon').innerHTML = `<img src="/static/images/weather/sunset-light.svg" height="60px" width="60px">`;
                document.getElementById("valSunTime").innerHTML = moment.unix(data[0].sunsetepoch).format('HH:mm');
                document.getElementById('valSunNextChange').innerHTML = `Sol op: ${moment(moment.unix(data[1].sunriseepoch)).format('HH:mm')} i morgen`;
            } else {
                let prefix = '';
                if (moment().hour() <= 23) { prefix = 'i morgen'; }
                document.getElementById("valSunHeader").innerHTML = 'Solopgang';
                document.getElementById('valSunIcon').innerHTML = `<img src="/static/images/weather/sunrise-light.svg" height="60px" width="60px">`;
                document.getElementById("valSunTime").innerHTML = moment.unix(data[1].sunriseepoch).format('HH:mm');
                document.getElementById('valSunNextChange').innerHTML = `Sol ned: ${moment(moment.unix(data[1].sunsetepoch)).format('HH:mm')} ${prefix}`;
            }
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
            console.log(data);
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

