// *************************************
// CHART GLOBALS
// *************************************
Apex.chart = {
    locales: [
        {
            "name": "da",
            "options": {
                "months": [
                    "januar",
                    "februar",
                    "marts",
                    "april",
                    "maj",
                    "juni",
                    "juli",
                    "august",
                    "september",
                    "oktober",
                    "november",
                    "december"
                ],
                "shortMonths": [
                    "jan",
                    "feb",
                    "mar",
                    "apr",
                    "maj",
                    "jun",
                    "jul",
                    "aug",
                    "sep",
                    "okt",
                    "nov",
                    "dec"
                ],
                "days": [
                    "Søndag",
                    "Mandag",
                    "Tirsdag",
                    "Onsdag",
                    "Torsdag",
                    "Fredag",
                    "Lørdag"
                ],
                "shortDays": ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
                "toolbar": {
                    "exportToSVG": "Download SVG",
                    "exportToPNG": "Download PNG",
                    "exportToCSV": "Download CSV",
                    "menu": "Menu",
                    "selection": "Valg",
                    "selectionZoom": "Zoom til valg",
                    "zoomIn": "Zoom ind",
                    "zoomOut": "Zoom ud",
                    "pan": "Panorér",
                    "reset": "Nulstil zoom"
                }
            }
        },
        {
            "name": "en",
            "options": {
                "months": [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                ],
                "shortMonths": [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ],
                "days": [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                "toolbar": {
                    "exportToSVG": "Download SVG",
                    "exportToPNG": "Download PNG",
                    "exportToCSV": "Download CSV",
                    "menu": "Menu",
                    "selection": "Selection",
                    "selectionZoom": "Selection Zoom",
                    "zoomIn": "Zoom In",
                    "zoomOut": "Zoom Out",
                    "pan": "Panning",
                    "reset": "Reset Zoom"
                }
            }
        }],
    defaultLocale: "da"
};

// *************************************
// ONE-AXIS CHART
// *************************************

function chartWithOneDataSet(data, unit, xFormat, tFormat, chart1Color, fillType = "gradient", decimals1 = 1) {
    let options = {
        chart: {
            height: 250,
            parentHeightOffset: 0,
            offsetX: 0,
            offsetY: 0,
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        colors: [chart1Color],
        fill: {
            type: fillType,
            gradient: {
                type: "vertical",
                inverseColors: false,
                gradientToColors: [cssVar("color-white"), chart1Color],
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.95,
                stops: [0, 90, 100]
            }
        },
        stroke: {
            curve: 'smooth',
            width: 1,
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: true,
                format: xFormat,
                style: {
                    colors: [cssVar("color-disabled")],
                    fontSize: 12,
                },
            },
        },
        yaxis: {
            tickAmount: 2,
            labels: {
                offsetX: -15,
                style: {
                    colors: [cssVar("color-disabled")],
                    fontSize: 12,
                },
                formatter: function (value) {
                    if (value != null) {
                        return parseFloat(value.toFixed(decimals1)) + unit;
                    } else {
                        return 'Ingen data';
                    }
                },
            },
        },
        grid: {
            padding: {
                left: 5,
            },
        },
        series: data,
        title: {
            text: undefined,
            margin: 0,
        },
        tooltip: {
            x: {
                format: tFormat,
            }
        },
        noData: {
            text: 'Henter data...'
        }
    }
    return options;
}

// *************************************
// TWO-AXIS CHART
// *************************************
function chartWithTwoDataSets(data, unit, xFormat, tFormat, chart1Color, chart2Color, fillType = "gradient", decimals1 = 0) {
    let options = {
        chart: {
            height: 250,
            parentHeightOffset: 0,
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        colors: [chart1Color, chart2Color],
        stroke: {
            curve: 'smooth',
            width: 1.5,
        },
        fill: {
            type: [fillType, 'solid'],
            gradient: {
                type: "vertical",
                inverseColors: false,
                gradientToColors: [cssVar("color-white"), chart1Color],
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.95,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: true,
                format: xFormat,
                style: {
                    colors: [cssVar("color-disabled")],
                    fontSize: 12,
                },
            },
        },
        yaxis: {
            tickAmount: 2,
            labels: {
                offsetX: -15,
                style: {
                    colors: [cssVar("color-disabled")],
                    fontSize: 12,
                },
                formatter: function (value) {
                    if (value != null) {
                        return parseFloat(value.toFixed(decimals1)) + unit;
                    } else {
                        return 'Ingen data';
                    }
                },
            },
        },
        grid: {
            padding: {
                left: 5,
            },
        },
        series: data,
        title: {
            text: undefined,
            margin: 0,
        },
        tooltip: {
            x: {
                format: tFormat,
            }
        },
        noData: {
            text: 'Ingen data...'
        }
    }
    return options;
}


// *************************************
// TWO-AXIS CHART WITH TWO Y-AXIS SCALES
// *************************************
function chartWithTwoDataSetsScales(data, unit, unit2, xFormat, tFormat, chart1Color, chart2Color, fillType = "gradient", decimals1 = 0, decimals2 = 0) {
    let options = {
        chart: {
            height: 250,
            parentHeightOffset: 0,
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        colors: [chart1Color, chart2Color],
        stroke: {
            curve: 'smooth',
            width: 1.5,
        },
        fill: {
            type: [fillType, 'solid'],
            gradient: {
                type: "vertical",
                inverseColors: false,
                gradientToColors: [cssVar("color-white"), chart1Color],
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.95,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: true,
                format: xFormat,
                style: {
                    colors: [cssVar("color-disabled")],
                    fontSize: 12,
                },
            },
        },
        yaxis: [
            {
                tickAmount: 2,
                min: 0,
                labels: {
                    offsetX: -15,
                    style: {
                        colors: [cssVar("color-disabled")],
                        fontSize: 12,
                    },
                    formatter: function (value) {
                        if (value != null) {
                            return parseFloat(value.toFixed(decimals1)) + unit;
                        } else {
                            return 'Ingen data';
                        }
                    },
                },
            },
            {
                tickAmount: 2,
                min: 0,
                opposite: true,
                labels: {
                    offsetX: -15,
                    style: {
                        colors: [cssVar("color-disabled")],
                        fontSize: 12,
                    },
                    formatter: function (value) {
                        if (value != null) {
                            return parseFloat(value.toFixed(decimals2)) + unit;
                        } else {
                            return 'Ingen data';
                        }
                    },
                },
            },
        ],
        grid: {
            padding: {
                left: 5,
            },
        },
        series: data,
        title: {
            text: undefined,
            margin: 0,
        },
        tooltip: {
            x: {
                format: tFormat,
            }
        },
        noData: {
            text: 'Ingen data...'
        }
    }
    return options;
}


// *************************************
// SUN ARC
// *************************************
function drawSunArc(sunRise, sunSet) {
    var ctx = document.getElementById("sunCanvas").getContext("2d"),
        gr = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height),
        sky = new Image();

    sky.onload = go;
    sky.src = "https://i.stack.imgur.com/qhQhQ.jpg";

    function go() {

        // some style setup
        ctx.font = "bold 16px sans-serif";
        gr.addColorStop(0, "#ffc");
        gr.addColorStop(0.75, "gold");
        gr.addColorStop(1, "orange");

        ctx.shadowColor = "#ffa";

        var centerX = ctx.canvas.width * 0.5,   // center of arc
            bottomY = ctx.canvas.height + 16,   // let center be a bit below horizon
            radiusX = ctx.canvas.width * 0.52, // radius, 80% of width in this example
            radiusY = ctx.canvas.height * 0.8;  // radius, 90% of height in this example

        // define sunrise and sunset times (in 24-hour clock, can be fractional)
        sunRise = 5.1;
        sunSet = 20.5;
        let time = parseFloat(moment().hour()), sunrise = sunRise, sunset = sunSet;

        (function loop() {
            var normTime = getTime();                                  // get normalized time
            var angle = getAngle(normTime);                            // get angle in radians
            var x = centerX + radiusX * Math.cos(angle);               // calcuate point
            var y = bottomY + radiusY * Math.sin(angle);
            drawSky(normTime);                                         // draw sky gradient
            drawSun(x, y);                                             // draw sun at point
            // drawTime();                                                // render time
            // requestAnimationFrame(loop)                                // loop
        })();

        // var normTime = getTime();                                  // get normalized time
        // var angle = getAngle(normTime);                            // get angle in radians
        // var x = centerX + radiusX * Math.cos(angle);               // calcuate point
        // var y = bottomY + radiusY * Math.sin(angle);
        // drawSky(normTime);                                         // draw sky gradient
        // drawSun(x, y);                                             // draw sun at point
        // drawTime();                                                // render time

        function getTime() {
            // produces a normalized pseduo-time
            time += 0.033;
            if (time > 23) time = 0;
            return (time - sunrise) / (sunset - sunrise);
        }

        function getAngle(normTime) {
            return Math.PI + Math.PI * normTime
        }

        function drawSun(x, y) {
            ctx.beginPath();
            ctx.moveTo(x + 16, y);
            ctx.arc(x, y, 16, 0, 6.28);
            ctx.fillStyle = gr;
            ctx.shadowBlur = 20;
            ctx.fill();
        }

        function drawTime() {
            ctx.fillStyle = "#fff";
            ctx.shadowBlur = 0;
            ctx.fillText("Time: " + time.toFixed(1) + "h", 10, 20);
        }

        function drawSky(t) {
            t = Math.max(0, Math.min(1, t));
            var iw = sky.width,
                w = ctx.canvas.width,
                x = 60 + (iw - 120) * t;
            ctx.filter = "blur(" + (1 + 4 * t) + "px)";
            ctx.drawImage(sky, x, 0, 1, sky.height, 0, 0, w, ctx.canvas.height);
            ctx.filter = "none";
        }
    }
}