/// <reference path="/Scripts/Custom/Charts/ChartTools.js" />
/// <reference path="/Scripts/Custom/Charts/AreaChart.js" />
/// <reference path="/Scripts/Custom/Charts/DrillDownChartBO.js" />
/// <reference path="/Scripts/Custom/Charts/DrillDownColumnChartBO.js" />
/// <reference path="/Scripts/Custom/Charts/DrillDownLineChartTEMP.js" />
/// <reference path="/Scripts/Custom/Charts/DrillDownPieColumnChartMF.js" />
/// <reference path="/Scripts/Custom/Charts/DrillDownPieColumnChartMP.js" />
/// <reference path="/Scripts/Custom/Charts/DrillDownSingleColumnChart.js" />
/// <reference path="/Scripts/Custom/Charts/HighStocks.js" />
/// <reference path="/Scripts/Custom/Charts/LineChartMP.js" />
/// <reference path="/Scripts/Custom/Charts/ProviderChart.js" />
/// <reference path="/Scripts/Custom/Charts/StackedAreaChart.js" />
/// <reference path="/Scripts/Custom/Charts/StackedColumnChart.js" />
/// <reference path="/Assets/indicators/Scripts/IndicatorControl_v_4.js" />
/// <reference path="/Assets/indicators/Scripts/reportindicator.js" />
/// <reference path="/Assets/indicators/Scripts/indicatorsCore_v2.js" />

// QUAY EDIT 1 29 15
// THis is the Root object for storing the json output after a Web Service request
var WS_RETURN_DATA = null;
// This is the Root object for storing the Inforequest json after parsing
var INFO_REQUEST = null;
// need to figure this one out
var BaseProviders = ["st"]
//
var colorBrewer = {

    "SUR": '#a1dab4',
    "SURL": '#25aae1',
    "GW": '#fcb040',
    "REC": '#9260a9',
    "SAL": '#25aae1',
    "UD": '#00CC00',
    "ID": '#00CC00',
    "AD": '#00CC00',
    "PD": '#00CC00'
    //"SUR": '#8dd3c7',
    //"SURL": '#ffffb3',
    //"GW": '#bebada',
    //"REC": '#80b1d3',
    //"SAL": '#fdb462',
    //"UD": '#Eb8383', // apa 8b2323 QUAY EDIT 4/11/16 '#b3de69',
    //"ID": '#C590FB',  //apa 55008b QUAY EDIT 4/11/16'#fccde5',
    //"AD": '#52BB52', // apa 228b22 QUAY EDIT 4/11/16 '#d9d9d9',
    //"PD": '#B5B5B5' // apa 858585 QUAY EDIT 4/11/16'#bc80bd',

};

function GetCRColor(theFld) {
    aColor = "#e6e6e6";
    switch (theFld) {
        case "SUR", "SWM":
            aColor = colorBrewer.SUR;
            break;
        case "SURL":
            aColor = colorBrewer.SURL;
            break;
        case "GW", "GWM":
            aColor = colorBrewer.GW;
            break;
        case "REC", "RECM":
            aColor = colorBrewer.REC;
            break;
        case "SAL":
            aColor = colorBrewer.SAL;
            break;
        case "UD", "UCON":
            aColor = colorBrewer.UD;
            break;
        case "ID":
            aColor = colorBrewer.ID;
            break;
        case "AD", "AGCON":
            aColor = colorBrewer.AD;
            break;
        case "PD", "PCON":
            aColor = colorBrewer.PD;
            break;
    }
    return aColor;
}
// END QUAY EDIT
//If the page is not a charts page setup the base scenario and
//get list of available providers and their names
if (getWindowType() != 'Charts') {
    var infoRequestJSON = $('input[id$=JSONData]').val();
    INFO_REQUEST = JSON.parse(infoRequestJSON);

    localStorage.clear();
    //setting a default name to active scenario
    if (!localStorage.actvScenario) {
        localStorage.BaseScenario = "Base";
        localStorage.actvScenario = "Base";
        localStorage.scenarioList = "";
    }

    //STEPTOE EDIT BEGIN 11/08/15
    //Remove initial json information from html page 
    remove_hvJSONData();

    var providerInfo = {};
    var providersAdded = false;
    //store all available providers and their codes 
    function setupProviderInfo() {
        var options = $('.chosen-select option');

        for (var i in options) {
            providerInfo[options[i].value] = options[i].text;
        }
    }
    setupProviderInfo();
    //STEPTOE EDIT END 11/08/15
}

//If the page is not Charts.aspx then setup the Chosen-JS Selector
//and the 'Load Selected Providers' button
if (getWindowType() != 'Charts') {
    $(document).ready(function () {
        //Initialize selector to be a Chosen selector
        $('.chosen-select').chosen({
            width: "100%",
            max_selected_options: 6
        });

        //When the selecter's values change enable the 'Load Selected Providers' button
        //if there are providers available.
        $('.chosen-select').chosen().change(function (evt, params) {
            var providers = $(this).chosen().val();

            //Use this code segment to update the provider lists as the selects and deselects
            for (var i in params) {
                if (i == 'selected') {
                }
                else if (providers != null && providers.length > 0) {

                }
                else {
                    $(".ddlflds option[value='" + params[i] + "']").remove();
                    toggleLoadProviders(true);
                }
            }

            //If there are proivders selected and the 'Load Selected Providers' button is disabled
            //then enable the button
            if (providers != null && $('#loadProviders').prop('disabled')) {
                toggleLoadProviders();
            }
        });

        //When 'Load Selected Providers' button is clicked setup each chart's selector,
        //disable the load button, and then run the model
        $('#loadProviders').click(function () {
            var providers = $('.chosen-select').chosen().val();

            //Get the current selected provider for each chart
            var selectedOptions = $(".ddlflds option:selected"),
            valArray = [];
            for (var i = 0; i < selectedOptions.length; i++) {
                valArray.push(selectedOptions[i].value);
            }

            //Remove all providers from each chart and set them to the proivders
            //recieved
            $(".ddlflds").html('');
            for (var i in providers) {
                $('.ddlflds')
                    .append($("<option></option>")
                    .attr("value", providers[i])
                    .text(providerInfo[providers[i]]));
            }

            //Set the selected proivder to the previous selection if available
            //for each chart
            for (var i = 0; i < valArray.length; i++) {
                $('.ddlflds')[i].value = valArray[i];
            }

            //'Load Selected Providers' button and then run the model
            toggleLoadProviders();
            runModel();
        });
    });
}
// STEPTOE EDIT END 11/08/15

// Set up Scenario Buttons

// Save Screnario
$(document).ready(function () {

    //dialog box
    $("#dialog").dialog({
        autoOpen: false,
        height: 175,
        width: 350,
        modal: true,

        buttons: {

            "Save Scenario": function () {

                if (typeof (Storage) !== "undefined") {

                    var name = $("#tbdialogScenarioName").val();
                    $("#tbdialogScenarioName").val("");

                    localStorage.actvScenario = name;
                    localStorage[localStorage.actvScenario] = getJSONData('ALL');

                    localStorage.scenarioList += "," + name;
                    setLoadScenarios();

                    alert("You saved a scenario successfully!!!");
                }

                else {
                    alert("Sorry, your browser does not support web storage...");
                }

                $(this).dialog("close");
            }
        },
        open: function (event) {
            $('.ui-dialog-buttonpane').find('button:contains("Save Scenario")').addClass('button');
        }
    });

    //saving the data in local storage
    $('#savebutton').click(function () {

        if (localStorage.actvScenario == "Base")

            $("#dialog").dialog("open");

        else {

            if (typeof (Storage) !== "undefined") {

                var name = localStorage.actvScenario;

                localStorage[localStorage.actvScenario] = getJSONData('ALL');

                alert("You saved the scenario to " + name + " successfully!!!");
            }

            else {
                alert("Sorry, your browser does not support web storage...");
            }
        }
    });

    //Creating new copy
    $("#createbutton").click(function () {
        $("#dialog").dialog("open");
    });

    //loading Adjusted Scenario from local storage
    $("#loadASbutton").click(function () {

        if ($('input[name="saved-scenario"]:checked').val()) {

            var scenarioName = $('input[name="saved-scenario"]:checked').siblings("label").html();

            if (typeof (Storage) !== "undefined") {

                if (localStorage[scenarioName]) {

                    //loading the scenario and calling the web service
                    setInputControlsFromScenario(localStorage[scenarioName]);
                    localStorage.actvScenario = scenarioName;
                    setProviderCheckBoxes();
                    callWebService(getJSONData('parent'));

                    alert("You loaded a scenario successfully!!!");
                }
                else {
                    alert("Sorry, you don't have any saved scenarios...");
                }
            }
            else {
                alert("Sorry, your browser does not support web storage...");
            }
        }
        else {

            if ($('#adj-scenarios-list').find("input[type=radio]"))
                alert("Sorry, you don't have any saved scenarios...");

            else
                alert("Please select any of the saved scenarios...");
        }

    });


    //loading Base Scenario from local storage
    $("#loadBSbutton").click(function () {

        if (typeof (Storage) !== "undefined") {

            var scenarioName = localStorage.BaseScenario;

            //loading the Base scenario and calling the web service
            setInputControlsFromScenario(localStorage[scenarioName]);
            localStorage.actvScenario = scenarioName;
            setLoadScenarios();
            setProviderCheckBoxes();
            SetFlowRadio("default")
            // QUAY EDIT 6/13/14
            //callWebService(getJSONData('parent'));
            callWebService(getJSONData('empty'));
            //
            setDefaultDrought();
            // STEPTOE EDIT 08/04/15 BEGIN
            //Reset all previous indicator values to '...'
            $('.IndicatorControl_OLD').each(function () {
                this.innerHTML = " ... "
            });
            // STEPTOE EDIT 08/04/15 BEGIN

            //====================================
            alert("You loaded a scenario successfully!!!");
        }

        else {
            alert("Sorry, your browser does not support web storage...");
        }

    });

});

$(document).ready(function () {
    $('div[id*=panelDependents]').dialog({
        modal: true,
        autoOpen: false,
        height: 275,
        width: 360
    });
});

//hiding labels of the user controls used as properties and assigning to their respective div properties
(function () {

    //hiding the keyword property label in input
    $('.InputControl').each(function () {

        //assigning        
        $(this).attr("data-key", $(this).find("span[id*=lblSliderKeyWord]").html());

        //hiding labels
        $(this).find("span[id*=lblSliderKeyWord]").hide();
    });

    //hiding the type property label in output
    $('.OutputControl').each(function () {

        //assigning
        $(this).attr("data-Type", $(this).find("span[id*=lblChartOption]").html());
        $(this).attr("data-fld", $(this).find("span[id*=lblFldName]").html());
        $(this).attr("data-title", $(this).find("span[id*=lblTitle]").html());
        $(this).attr("data-series", $(this).find("span[id*=lblSeries]").html());
        //hiding labels
        $(this).find("span[id*=lblChartOption]").hide();
        $(this).find("span[id*=lblFldName]").hide();
        $(this).find("span[id*=lblTitle]").hide();
        $(this).find("span[id*=lblSeriesColors]").hide();
    });
})();

//Getting the div ID drop down list selected item changed
$(".ddlType").change(function () {
    drawChart($(this).closest('div[id*=OutputControl]').attr('id'));
});

//Getting the div ID drop down list selected item changed
$(".ddlflds").change(function () {
    drawChart($(this).closest('div[id*=OutputControl]').attr('id'));
});


//drwaing charts on temporal slider(years) change
$(document).on('mouseup', '.temporal', function (event) {

    var refresh = false;
    $('input[name="temporal"]:checked').each(function () {

        if (this.value == "point-in-time" && event.currentTarget.id == "point-in-time-slider") {
            refresh = true;
        } else if (this.value == "range-in-time" && event.currentTarget.id == "range-in-time-slider") {
            refresh = true;
        }
    });

    if (!refresh) {
        return;
    }
    setStrtandEndYr();

    //looping through the output controls and getting the required data and populating the charts
    $('.OutputControl').each(function () {
        var controlID = $(this).attr('id');
        drawChart(controlID);
    });

    drawAllIndicators();
});



$(document).on('change', 'input[name="geography"]', function () {

    var provider = $(this).val();

    //looping through the output controls and getting the required data and populating the charts
    $('.OutputControl').each(function () {

        var controlID = $(this).attr('id');
        var type = $("#" + controlID).attr("data-Type");

        if (type == "MFOP") {
            $("#" + controlID).find("select[id*=ddlfld]").val(provider);
            drawChart(controlID);
        }
    });
    //STEPTOE EDIT 07/15/15 BEGIN
    //If Core.js is included and Window is Default.aspx send geography data to tabs
    if (getWindowType() == 'Default')
        sendGeographyRadioChange(provider);
    //STEPTOE EDIT 07/15/15 END
});

//drwaing charts on temporal radio change
$(document).on('change', 'input[name="temporal"]', function () {

    setStrtandEndYr();

    //looping through the output controls and getting the required data and populating the charts
    $('.OutputControl').each(function () {
        var controlID = $(this).attr('id');
        drawChart(controlID);
    });

    drawAllIndicators();
});

//STEPTOE BEGIN EDIT 11/09/15
//Raising "Run Model" button click event and calling web service
$(document).on('click', '.run-model', runModel);

//Toggling the sub controls
$(document).on('click', '.ui-slider-popup-button', function () {

    if ($(this).closest("div[id*=ControlContainer]").attr("data-Subs") != "") {

        var subid = ($(this).closest("div[id*=ControlContainer]").attr("data-Subs")).split(',');

        $.each(subid, function () {
            $('#' + this + "_ControlContainer").attr("style", "display:inline");
        });

        $('div[id*=panelDependents]').dialog("open");
    }
});
//Toggling the sub controls
//$(document).on('click', '.trace-CO', function () {

//    var subControls;
//    var sum = 0;// to hold the sum if the sub controls value
//    var subControlsValid;
//    var inputData = {};

//    var DefaultInputs = [];
//    eyr = {};

//    if ($(this).attr('id') == 'trace-CO-one') {
//        eyr = {};
//        eyr["FLD"] = "COEXTSTYR";
//        // eyr["VAL"] = 1939;
//        eyr["VAL"] = 1938;
//        DefaultInputs.push(eyr);

//        inputData["Inputs"] = DefaultInputs;


//    };


//});
//// 02.29.16 DAS
//// For second button
//// --------------------------------------
//function continueButtonClicked() {
//    console.log("woot got a click");
//   // eyr = {};
//    //        eyr["FLD"] = "COEXTSTYR";
//    //        // eyr["VAL"] = 1939;
//    //        eyr["VAL"] = 1938;
//    //        DefaultInputs.push(eyr);

//    //        inputData["Inputs"] = DefaultInputs;
//}

//$('#Finish_button').on('click', continueButtonClicked);
// -------------------------------------------------------
// Pull in State Level Data of input controls and
// indicator selections from Scripts/Ipad/STC.js
// 03.08.16 DAS
// =============
var CT = STC;
// 03.18.16 DAS
// Groundwater, Economy, environemt, Power, Agriculture, surface water, and Urban efficiencies
// Three places these MUST be defined; 1) Here, 2_ Indicator.js (~line 39), and Below
// For five indicators: var height = 220;var width = 235;
//var height = 230;
var height = 220;
var width = 235;
// For six indicators
var indicatorParameters = {

    "GWSYA": {
        divId: "idGWSYADiv", anIndicatorType: "GWSYA", ControlId: "idGWSYAIndicator", options: { Height: height, Width: width }
    },
    "ECOR": {
        divId: "idECORDiv", anIndicatorType: "ECOR", ControlId: "idECORIndicator", options: { Height: height, Width: width }
    },
    "ENVIND": {
        divId: "idENVINDDiv", anIndicatorType: "ENVIND", ControlId: "idENVINDIndicator", options: { Height: height, Width: width }
    },
    "PEF": {
        divId: "idPEFDiv", anIndicatorType: "PEF", ControlId: "idPEFIndicator", options: {
            Height: height,
            Width: width,
            meter: {
                style: 'rgr_meter'
            }
        }
    },
    "AGIND": {
        divId: "idAGINDDiv", anIndicatorType: "AGIND", ControlId: "idAGINDIndicator", options: {
            Height: height,
            Width: width,
            meter: {
                style: 'rgr_meter'
            }
        }
    },
    "SWI": {
        divId: "idSWIDiv", anIndicatorType: "SWI", ControlId: "idSWIIndicator", options: { Height: height, Width: width }
    },
    "UEF": {
        divId: "idUEFDiv", anIndicatorType: "UEF", ControlId: "idUEFIndicator",
        options: {
            Height: height,
            Width: width,
            meter: {
                style: 'rgr_meter'
            }
        }
    }
}

// -------------------------------------------------------
// 02.26.2016 DAS
// Grab the name of the state from the url (if not null)
var ourState = "Florida";
function getState() {
    var temp = $.urlParam('state');
    if (temp !== null) {
        ourState = $.urlParam('state');
    }
    getStateInt(ourState);
    return ourState;
}
var States = ["Florida", "Idaho", "Illinois", "Minnesota", "Wyoming", "Arizona", "Colorado", "Nevada", "California", "Utah", "New Mexico",
                "Alabama", "Kansas","Tennessee", "Virginia" ];

var StateNames = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Dist. of Columbia",
                                            "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
                                            "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri",
                                            "Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina",
                                            "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina",
                                            "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

function getStateInt() {
   
    var cnt;
    var check;
    var stateInt = 0;
    for (var i = 0; i < States.length; i++) {
        check = States[i];

        if (check == ourState) {
            stateInt = i;
            break;
        }
    }
    return stateInt;
}
//
var IndicatorControlsArray = [];
function setStateInformation() {
    //var userState = $.urlParam('state');
    var userState = getState();
    
    if(userState != null) {
        //Perform state specific information here such as choosing which
        //input controls should be visible/available
        // Display the name of the State above the Policy DIV, i.e.,
        // <aside id="left-sidebar">
        //   <asp:Panel ID="PanelUserInputs" runat="server">
        $('#dashboard-header-h0').text(userState);
        //
        // found below: 03.02.2016 DAS
        hideInputControls(userState);
        displayIndicators(userState);
        //
      }
    else {
        //var height = 230;
        //GWPIndicatorControl = new IndicatorControl("idGWPDiv", "ECOR", "idGWPIndicator", { Height: height });
        //ENVIndicatorControl = new IndicatorControl("idENVDiv", "environment", "idENVIndicator", {Height: height});
        //AGRIndicatorControl = new IndicatorControl("idAGRDiv", "SWI", "idAGRIndicator", { Height: height });
        //PWCIndicatorControl = new IndicatorControl("idPWCDiv", "groundwater", "idPWCIndicator", {Height: height});
        //AWSIndicatorControl = new IndicatorControl("idAWSDiv", "urbanefficiency", "idAWSIndicator",
        //    {
        //        Height: height,
        //        meter: {
        //            style: 'rgr_meter'
        //        }
        //    }
        //);
    }
}
setStateInformation();

//hide all input controls
function hideInputControls(state) {
    $('.InputControl').hide()
    //show controls in array
    var stateString = String(state);
    for (var index = 0; index < CT[stateString].IFLDS.length; index++) {

            $('#' + CT[stateString].IFLDS[index] + 'InputUserControl_ControlContainer').show()
        }
}
// QUAY EDIT 4/12/16 BEGIN
// This will set the indicator Titles to the web label
function ResetIndicatorTitles() {
    var fieldInfo = INFO_REQUEST.FieldInfo;
    for (var i = 0; i < fieldInfo.length; i++) {
        if (fieldInfo[i].WEBL) {
            if (fieldInfo[i].WEBL != "") {
                switch (fieldInfo[i].FLD) {
                    case "ENVIND":
                        IndSetupData.ENVIND.title = fieldInfo[i].WEBL;
                        break;
                    case "SWI":
                        IndSetupData.SWI.title = fieldInfo[i].WEBL;
                        break;
                    case "UEF":
                        IndSetupData.UEF.title = fieldInfo[i].WEBL;
                        break;
                }
            }
        }
    }
    //            IndSetupData = {
    //        ECOR: {
    //        filenames:['./Assets/indicators/New_Images/economy_button_grey.jpg','./Assets/indicators/New_Images/economy_flat_grey.jpg','./Assets/indicators/New_Images/economy_flat_grey_color.jpg','./Assets/indicators/New_Images/economy.jpg'],
    //        title: 'Economy'
    //},
    //ENVIND: {
    //        filenames: ['./Assets/indicators/New_Images/environment_button_grey.jpg', './Assets/indicators/New_Images/environment_flat_grey.jpg', './Assets/indicators/New_Images/environment_flat_grey_color.jpg', './Assets/indicators/New_Images/environment.jpg'],
    //        title: 'Environment'
    //},
    //SWI: {
    //        filenames: ['./Assets/indicators/New_Images/surfacewater_button_grey.jpg', './Assets/indicators/New_Images/surfacewater_flat_grey.jpg', './Assets/indicators/New_Images/surfacewater_flat_grey_color.jpg', './Assets/indicators/New_Images/surfacewater.jpg'],
    //        title: 'Surface Water'
    //},
    //GWSYA: {
    //        filenames: ['./Assets/indicators/New_Images/groundwater_button_grey.jpg', './Assets/indicators/New_Images/groundwater_flat_grey.jpg', './Assets/indicators/New_Images/groundwater_flat_grey_color.jpg', './Assets/indicators/New_Images/groundwater.jpg'],
    //        title: 'Groundwater'
    //},
    //UEF: {
    //        filenames: ['./Assets/indicators/New_Images/urbanefficiency_button_grey.jpg', './Assets/indicators/New_Images/urbanefficiency_flat_grey.jpg', './Assets/indicators/New_Images/urbanefficiency_flat_grey_color.jpg', './Assets/indicators/New_Images/urbanefficiency.jpg'],
    //        title: 'Urban Efficiency'
    //},
    //PEF: {
    //        filenames: ['./Assets/indicators/New_Images/power_button_grey.jpg', './Assets/indicators/New_Images/power_flat_grey.jpg', './Assets/indicators/New_Images/power_flat_grey_color.jpg', './Assets/indicators/New_Images/power.jpg'],
    //        title: 'Power Efficiency'
    //},
    //AGIND: {
    //        filenames: ['./Assets/indicators/New_Images/agriculture_button_grey.jpg', './Assets/indicators/New_Images/agriculture_flat_grey.jpg', './Assets/indicators/New_Images/agriculture_flat_grey_color.jpg', './Assets/indicators/New_Images/agriculture.jpg'],
    //        title: 'Agriculture'
    //}, 

}
// QUAY EDIT 4/12/16 END

function displayIndicators(state) {
    var stateString = String(state);
    // QUAY EDIT 4/12/16 begin
    ResetIndicatorTitles();
    // QUAY EDIT 3/12/16 END
    // QUAY EDIT 3/19/16 begin
    //  need to clear array
    IndicatorControlsArray = new Array();
    // need to clear all old indicators, if there
    $('.accordion').each(function () {
        if (this.innerHTML) {
            this.innerHTML = "";
        }
    });
    // QUAY EDIT 3/19/16 begin
    for (var index = 0; index < CT[stateString].INDFLDS.length; index++) {
         var params = indicatorParameters[CT[stateString].INDFLDS[index]];

         // STEPTOE EDIT 5/13/16 BEGIN
         // IndicatorControlsArray[params.anIndicatorType] = new IndicatorControl(params.divId, params.anIndicatorType, params.ControlId, params.options)
         IndicatorControlsArray[params.anIndicatorType] = new IndicatorControl(params.divId, params.anIndicatorType, params.ControlId, params.options, index == (CT[stateString].INDFLDS.length-1))
         // STEPTOE EDIT 5/13/16 END
    }

}
// New drawAllInndicators function for WaterSimAmerica
// 03.02.2016 DAS
function drawAllIndicators(jsondata) {
    console.log("drawAllIndicators");
    var stateString = getState();
    var indicatorDisplayed = CT[stateString].INDFLDS;

    var done = [];
    for (di = 0; di < indicatorDisplayed.length; di++) {
        done[CT[stateString].INDFLDS[di]] = 0;
    }  
    $.each(jsondata.RESULTS, function () {
        var lastIndex = this.VALS.length-1;
        if (this.FLD == "AGIND") {
            if (done["AGIND"] == 0) {
                IndicatorControlsArray["AGIND"].SetValue(this.VALS[lastIndex]);
                done["AGIND"] = 1;
            }

        } else if (this.FLD == "ECOR") {
            if (done["ECOR"] == 0) {
                IndicatorControlsArray["ECOR"].SetValue(this.VALS[lastIndex]);
                done["ECOR"] = 1;
            }

        } else if (this.FLD == "GWSYA") {
            if (done["GWSYA"] == 0) {
                IndicatorControlsArray["GWSYA"].SetValue(this.VALS[lastIndex]);
                done["GWSYA"] = 1;
            }

        } else if (this.FLD == "SWI") {
            if (done["SWI"] == 0) {
                IndicatorControlsArray["SWI"].SetValue(this.VALS[lastIndex]);
                done["SWI"] = 1;
            }
        }
        else if (this.FLD == "UEF") {
            if (done["UEF"] == 0) {
                IndicatorControlsArray["UEF"].SetValue(this.VALS[lastIndex]);
                done["UEF"] = 1;
            }
        }
        else if (this.FLD == "PEF") {
            if (done["PEF"] == 0) {
                IndicatorControlsArray["PEF"].SetValue(this.VALS[lastIndex]);
                done["PEF"] = 1;
            }
        }
        else if (this.FLD == "ENVIND") {
            if (done["ENVIND"] == 0) {
                IndicatorControlsArray["ENVIND"].SetValue(this.VALS[lastIndex]);
                done["ENVIND"] = 1;
            }
        }

    });

}

//Then to hide all the outputfields and display the ones that you want you can use the following:
//hide all output controls
//function hideOutputControls() {
//    $('.OutputControl').hide()
//    //show controls in array
//    for (var index = 0; index < CT["Florida"].OFLDS.length; index++) {
//        $('#GraphControls_OutputUserControl' + CT["Florida"].OFLDS[index] + '_OutputControl').show()
//    }
//}

// STEPTOE EDIT 05/07/16
// Call to start Ipad timers
function loadingScreenHidden(){
    try {
        webkit.messageHandlers.sendMessage.postMessage('loadingScreenHidden');
        return true;
    } catch(err) {
        return false;
    }
}

////Self invoking function to set the input values and calling web service to populate the charts
(
    function () {

        setSliderValues();

        //checking the provider list check boxes
        setProviderCheckBoxes();

        //Inidicators not on iPad page
        //initializeIndicators();

        //calling the webservice
        if (localStorage.actvScenario == "Base") {
            callWebService(getJSONData('empty'));
        }
        else {
            callWebService(getJSONData('parent'));
        }
        // QUAY EDIT 3/18/14 Begin
        callWebServiceVersion();
        //setting load scenarios list from local storage
         setLoadScenarios();

        //STEPTOE EDIT 12/08/2015
        //Hide input sliders and show buttons to select values
        inputControls2Radios();

        $("#WSLoading").hide();
        //Hide all Values
        // 03.22.16 DAS =======================
        $("span[id*=lblSliderVal]").hide()

        //Hide all Units
        $("span[id*=lblunits]").hide()
        // DAS ================================
        //
        $("#dashboard-header-h1").show();
        // QUAY EDIT 3/19/16 BEGIN
        // Hide the GOOD JOB DIV
        $("#idGoodJob").hide();
        $("#idAssessment").hide();
        if (!DebugMode) {

            //STEPTOE 12/08/2015  Modified Quay 3/19/16
            // ======================
            //comment out / in to start/stop Sideshow

            config = {};
            config.wizardName = ModalWizards[CurrentModal];
            //===========================
        }
        //function hideMarquee() {
        //    var mydiv = document.getElementsByClassName("marquee");
        //    mydiv[0].style.visibility = "hidden";
        //}
        hideMarquee();
       // $('.marquee').hide();
        // QUAY EDIT 3/19/16 END

        // QUAY EDIT 4/19/16
        // Hide audio elements
        hideaudio();

        // STEPTOE EDIT 05/07/16
        // Send loadingScreenHidden message!
        loadingScreenHidden();
        return;


    })();

    $(document).ready(function(){
        Sideshow.start(config);
    })
// E.O.F.
