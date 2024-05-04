

// *************************************
// TWO-AXIS CHART
// *************************************
function chartWithTwoDataSets(data, unit) {
    let options = {
        chart: {
            height: 250,
            parentHeightOffset: 0,
            toolbar: {
                show: false,
            },
        },
        colors: [cssVar("color-blue"), cssVar("color-red")],
        stroke: {
            curve: 'smooth',
            width: 1.5,
        },
        fill: {
            type: "gradient",
            gradient: {
                type: "vertical",
                inverseColors: false,
                gradientToColors: [cssVar("color-white"), cssVar("color-blue")],
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
                datetimeUTC: false,
                format: 'HH:mm',
                style: {
                    colors: [cssVar("color-disabled")],
                    fontSize: 12,
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: [cssVar("color-disabled")],
                    fontSize: 12,
                },
                formatter: function (value) {
                    return parseInt(value) + unit;
                },
            },
        },
        series: data,
        title: {
            text: undefined,
            margin: 0,
        },
        tooltip: {
            x: {
                format: 'HH:mm',
            }
        },
        noData: {
            text: 'Henter data...'
        }
    }
    return options;
}