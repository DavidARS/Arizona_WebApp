// function Frame(left, top, width, height) {
//     this.left = left;
//     this.top = top;
//     this.width = width;
//     this.height = height;
//     this.reset = function () {
//     }
//     this.right = this.left + (this.width - 1);
//     this.bottom = this.top + (this.height - 1);

//     this.reset = function () {
//         this.right = this.left + (this.width - 1);
//         this.bottom = this.top + (this.height - 1);

//     }
// }

function getDomHeightWithID(anID) {
    var theheight = 0;
    var theelement = document.getElementById(anID);
    if (theelement != undefined) {
        if (theelement.clientHeight) {
            theheight = theelement.clientHeight;
        }
    }
    return theheight;
}
function getDomWidthWithID(anID) {
    var thewidth = 0;
    var theelement = document.getElementById(anID);
    if (theelement != undefined) {
        if (theelement.clientWidth) {
            thewidth = theelement.clientWidth;
        }
    }
    return thewidth;
}

var indicatorImages = {
   ECOR: {
    fileName: './Assets/indicators/New_Images/economy.jpg',
    title: 'Economy'


  },
  environment: {
    fileName: './Assets/indicators/New_Images/environment.jpg',
    title: 'Environment'
  },
  SWI: {
    fileName: './Assets/indicators/New_Images/surfacewater.jpg',
    title: 'Surface Water'
  },
  GWSYA: {
    fileName: './Assets/indicators/New_Images/groundwater.jpg',
    title: 'Groundwater'
  },
  urbanefficiency:{
    fileName: './Assets/indicators/New_Images/urbanefficiency.jpg',
    title: 'Urban Efficiency'
  },
  power:{
      fileName: './Assets/indicators/New_Images/power.jpg',
      title: 'Power Efficiency'
    },
  AGIND: {
      fileName: './Assets/indicators/New_Images/agriculture.jpg',
      title: 'Agriculture'
    },


  rg_meter:{
    fileName: './Assets/indicators/New_Images/rg_meter.jpg'
  },
  rgr_meter:{
    fileName: './Assets/indicators/New_Images/rgr_meter.jpg'
  }
}


function IndicatorControl(divId, anIndicatorType, ControlId, options) {
    //divId, anIndicatorType, ControlId, Width, Height
    //var myHeight = 100;
    //var myWidth = 100;
   // defWidth: 225,
	//        defHeight: 186,
	//  new=176       specWidth: 196,
    //    specHeight: 162
    var defaults = {
        defWidth: 225,
        defHeight: 186,
        specWidth: 176,
        specHeight: 152
    };

    //fill defaults with user specified options
    if(typeof(options) != "undefined"){
        for(var option in options){
            defaults[option] = options[option];
        }
    }

    // console.log(defaults)
    if (defaults.Width == undefined && defaults.Height != undefined){
        defaults.Width = defaults.specWidth * (defaults.Height / defaults.specHeight);
    }
    else if(defaults.Width != undefined && defaults.Height == undefined){
        defaults.Height = defaults.specHeight * (defaults.Width / defaults.specWidth);
    }

    this.id = ControlId
    if (defaults.Width == undefined) {
        var aWidth = getDomWidthWithID(divId);
        // console.log("aWidth: " + aWidth)
        if (aWidth > 0) {
            this.width = aWidth;
            defaults.width = aWidth;
        } else {
           this.width = defaults.defWidth;
        }
    } else {
        this.width = defaults.Width;
    }
    if (defaults.Height == undefined) {
            var aHeight = getDomHeightWithID(divId);
            if (aHeight > 0) {
                this.height = aHeight;
                defaults.height = aHeight;
            } else {
            this.height = defaults.defHeight;
        }
    } else {
        this.height = defaults.Height;
    }

    //Check if div exists, if not create the div
    if (!$('#'+divId).length){
        $('.accordion').append('<div id="' + divId + '" class="IndicatorControl" data-fld="' + anIndicatorType + '"></div>')
    }

    // Setup Div Size so that no outer container is required
    this.divObj = $('.accordion').find('#' + divId);
    this.divObj.css('width', this.width);
    this.divObj.css('height', this.height);
    this.divObj.css('float', 'left');

    // console.log(this.width, this.height);

    this.IndicatorType = anIndicatorType;
    this.DivID = divId;
    // QUAY ADDED FOr report support 1/2/14
    this.Description = "";

    this.MinValue = 0; // default
    this.MaxValue = 150; // default
    this.value = 0;  // 0 to 100 valid
    this.value_old = 0;
    this.drawOldValue = false;
    //this.fudgecnt = 0;

    // This is a function used to set the value of the control and redraw
    this.SetValue = function (value) {
        // check if valid range
        if ((value >= this.MinValue) && (value <= this.MaxValue)) {
            ////set old value
            this.value_old = this.value;
                 // set the value
                this.value = value;
            // paint the control
            this.Paint();

            this.drawOldValue = true;
        }
    };
    // The frame offset
    this.offsetleft = 4;
    this.offsetright = 7;
    this.offsettop = 4;
    this.offsetbottom = 4;

    // create Frame
    // this.Frame = new Frame(this.offsetleft, this.offsettop, this.width - (this.offsetleft + this.offsetright), this.height - (this.offsettop + this.offsetbottom));
    // set background
    this.background = "white";
    ///-------------------------------------------------------------------------------------------------
    /// <summary> Resize the Control </summary>
    /// <param name="parameter1">   The first parameter. </param>
    /// <param name="parameter2">   The second parameter. </param>
    ///-------------------------------------------------------------------------------------------------
    this.resize = function (width, height) {
        // set the control
        this.width = width;
        this.height = height;
        // set the canvas
        this.canvas.width = width;
        this.canvas.height = height;
        // reset Frame
        // this.Frame.width = this.width - (this.offsetleft + this.offsetright);
        // this.Frame.height = this.height - (this.offsettop + this.offsetbottom);
        // this.Frame.reset();
        // reinitialize
        // InitializeIndicator(this);
        this.divObj.css('width', this.width);
        this.divObj.css('height', this.height);
        this.dims = calculateDims(this.canvas, defaults);

        // draw it
        this.Paint();
    }
    // onclick event handler
    this.oncLick = function (event) {
    }
    // Paint the object
    this.Paint = function () {
        DrawIndicator(this);
    }

    // constructor Code
//    this.canvas = canvas;
    this.canvas = document.createElement("Canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height
    this.canvas.id = this.DivID + this.id + "Canvas";
    this.canvas.style.position = "absolute";
    this.CT = this.canvas.getContext("2d");
    this.canvas.onclick = this.onclick;
    // Set defualt colors
    // this.Colors = new IndicatorColors("lightskyblue", "royalblue", "darkgreen", "darkolivegreen", "darkkhaki", "khaki", "gold", "burlywood", "peachpuff", "mediumblue", "yellowgreen", "lawngreen", "seagreen", "peru","#777777");

    // call the indicators initialization code
    // store all images in object no need to init
    // InitializeIndicator(this);
    this.dims = calculateDims(this.canvas, defaults);

    // draw thw indicator
    DrawIndicator(this);
    // add it to the div element
    var TheDiv = document.getElementById(this.DivID);
    if (TheDiv != undefined)
    {
        if (TheDiv.appendChild) {
            TheDiv.appendChild(this.canvas);
        }
    }

}

function draw(canvas, dims){
  if (canvas.getContext){
    var canvasDims = dims.canvas;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasDims.width, canvasDims.height);
    ctx.beginPath();
    ctx.rect(0, 0, canvasDims.width, canvasDims.height);
      //ctx.fillStyle = 'rgb(80, 85, 88)';
    ctx.fillStyle = '#e6e6e6';
    ctx.fill();
  }
}
function getTextHeight(font) {

    var text = $('<span>Hg</span>').css({ fontFamily: font });
    var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

    var div = $('<div></div>');
    div.append(text, block);

    var body = $('body');
    body.append(div);

    try {

        var result = {};

        block.css({ verticalAlign: 'baseline' });
        result.ascent = block.offset().top - text.offset().top;

        block.css({ verticalAlign: 'bottom' });
        result.height = block.offset().top - text.offset().top;

        result.descent = result.height - result.ascent;

    } finally {
        div.remove();
    }

    return result;
}
function drawImage(canvas, dims, src, values, drawOldValue) {
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var img = new Image();

        var indicatorDims = dims.indicator;

        var x = indicatorDims.x + indicatorDims.border;
        var y = indicatorDims.border;

        img.onload = function () {
            ctx.drawImage(img, x, y, indicatorDims.width, indicatorDims.height);
			drawText(canvas, dims, indicatorFile.title);
            drawMeter(canvas, dims, 'big', values.current);

            if (drawOldValue)
                drawMeter(canvas, dims, 'small', values.old);
        };
        // img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';
        img.src = src;
    }
}
function drawText(canvas, dims, title) {
  if (canvas.getContext){
    var canvasDims = dims.canvas;
    var indicatorDims = dims.indicator;
    //var fontInt = indicatorDims.x - indicatorDims.border;
    var fontInt = 24;
    //var x = indicatorDims.x - indicatorDims.border;
    //var y = canvasDims.height - indicatorDims.border;
    //var x = indicatorDims.x - indicatorDims.border;
   // var y = canvasHeight - border - textHeight;
    var ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(x, y);
    //ctx.rotate(-Math.PI/4);
    ctx.font = fontInt + "px sans-serif";
    ctx.fillStyle = "#0066cc";

    var text = ctx.measureText(title); // TextMetrics object
    //while (text.width > y - indicatorDims.border) {
      while(text.width > indicatorDims.width - indicatorDims.border * 2){
      fontInt--;
      ctx.font = fontInt + "px sans-serif";
      text = ctx.measureText(title); // TextMetrics object
      // console.log("looping")
    }
      var x = indicatorDims.x + indicatorDims.border;
      var y = canvasDims.height - indicatorDims.border - getTextHeight(ctx.font).height;

      console.log("text.height: ", getTextHeight(ctx.font));
      console.log("y: " + y);

      ctx.save();
      ctx.translate(x, y);
    ctx.fillText(title, 0, 0);
    ctx.restore();
  }
}

function drawMeter(canvas, dims, size, value){
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    var img = new Image();

    var indicatorDims = dims.indicator;
    var meterDims = dims.meter;
    var height = meterDims.height;
    var shuttleDims = dims.shuttle;

    var x = indicatorDims.x + indicatorDims.border + meterDims.padding.left;
    var y = indicatorDims.border + indicatorDims.height - meterDims.padding.bottom;

    if(size == 'small'){
        height *= 0.5;
     // y += shuttleDims.lineWidth * 3.5 + height;//15 + height;
      y += shuttleDims.lineWidth * 3.5 + height + meterDims.adjSeparation;//15 + height;
    }

    img.onload = function(){
      ctx.drawImage(img, x, y, meterDims.width, height);
      drawShuttle(canvas, dims, size, value);
    };
    img.src = indicatorImages[meterDims.style].fileName;
  }
}

function drawMeterWithCustomShuttle(canvas, dims, size, value){
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    var img = new Image();

    var indicatorDims = dims.indicator;
    var meterDims = dims.meter;
    var height = meterDims.height;
    var shuttleDims = dims.shuttle;

    var x = indicatorDims.x + indicatorDims.border + meterDims.padding.left;
    var y = indicatorDims.border + indicatorDims.height - meterDims.padding.bottom;

    if(size == 'small'){
      height *= 0.5;
      y += shuttleDims.lineWidth * 3.5 + height + meterDims.adjSeparation;  //15 + height;
    }

    img.onload = function(){
      ctx.drawImage(img, x, y, meterDims.width, height);
      drawShuttle(canvas, dims, size, value);
    };
    img.src = indicatorImages[meterDims.style].fileName;
  }
}

function drawShuttle(canvas, dims, size, value){
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    var img = new Image();

    var indicatorDims = dims.indicator;
    var meterDims = dims.meter;
    var shuttleDims = dims.shuttle;
    //  var height = meterDims.height;
    var height = meterDims.height + shuttleDims.addHeight ;

    var percentage = value / 100 * Math.max(0, meterDims.width - shuttleDims.width - shuttleDims.lineWidth/2);
    // console.log("percentage: " + percentage);
    var x = percentage + indicatorDims.x + indicatorDims.border + meterDims.padding.left;
      // Add height to the shuttle (defined in the setting of the object below) 02.29.16 DAS
    if (size == 'big') {
        var y = indicatorDims.border + indicatorDims.height - meterDims.padding.bottom - shuttleDims.addHeight / 2;
    }
    else {
        height += 5;
        var y = indicatorDims.border + indicatorDims.height - (meterDims.padding.bottom+5  )- (shuttleDims.addHeight) / 2;
        //if(size == 'small'){
        height *= 0.5;
        // y += shuttleDims.lineWidth * 3.5 + height;//15 + height;
        y += shuttleDims.lineWidth * 3.5 + height + meterDims.adjSeparation;//15 + height;
    }

    ctx.beginPath();
    ctx.lineWidth = shuttleDims.lineWidth;
    ctx.strokeStyle = shuttleDims.color;
    ctx.rect(x, y, shuttleDims.width, height);
    ctx.stroke();
  }
}
function drawShuttleImage(canvas, dims, size, value){
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    var img = new Image();

    var indicatorDims = dims.indicator;
    var meterDims = dims.meter;
    var shuttleDims = dims.shuttle;
   // var height = meterDims.height;
    var height = meterDims.height + shuttle.addHeight;


    var percentage = value / 100 * Math.max(0, meterDims.width - shuttleDims.width - shuttleDims.lineWidth/2);
    // console.log("percentage: " + percentage);
    var x = percentage + indicatorDims.x + indicatorDims.border + meterDims.padding.left;
    var y = indicatorDims.border + indicatorDims.height - meterDims.padding.bottom;

    if(size == 'small'){
        height *= 0.5;
       // y += shuttleDims.lineWidth * 3.5 + height;
      y += shuttleDims.lineWidth * 3.5 + height + meterDims.adjSeparation;//15 + height;
    }

    ctx.beginPath();
    ctx.lineWidth = shuttleDims.lineWidth;
    ctx.strokeStyle = 'blue';
    ctx.rect(x, y, shuttleDims.width, height);
    ctx.stroke();
  }
}

// Position the meters within the canvas, and other things
// 02.28.16 DAS
//-----------------------------------------------------------
function calculateDims(canvas, options){

  var scale = {
    width: canvas.width / 196,
    height: canvas.height / 162
  }
  // console.log(scale.width, scale.height)

    var dims = {
        canvas: {
          width: canvas.width,
          height: canvas.height
        },
        indicator: {
          width: 154,
          height: 154,
          border: 3,
          x: 34
        },
        meter: {
            style: 'rg_meter',
            width: 124,
            height: 22,
            adjSeparation: 15,
            padding: {
                left: 15 * scale.width,
                //bottom: 46 * scale.height = Value * scale.height determines meter placement on the indicator
                bottom: 62 * scale.height
            }
        },
        shuttle: {
            image: false,
            width: 10,
            lineWidth: 4,
            addHeight: 3,
            padding: {
                left: 15 * scale.width,
                bottom: 62 * scale.height
            },
            // color: '#377eb8'

            color: '#0000CC'
        }
    }

    for(var option in options){
        if(typeof(options[option]) != 'object')
            dims[option] = options[option];
        else{
            var object = options[option];
            for(var subOption in object){
                dims[option][subOption] = object[subOption];
            }
        }
    }

    for(var element in dims){
        if(element != 'canvas'){
          for(var dim in dims[element]){
            if(dim == 'width' || dim == 'height')
              dims[element][dim] = dims[element][dim] * scale[dim];
            else if(typeof(dims[element][dim]) == 'number'){
              dims[element][dim] = dims[element][dim] * scale.width;
            }
            // console.log(element, dim)
          }
        }
    }
  return dims;
}

function DrawIndicator(IndControl) {

    var indicatorFile = indicatorImages[IndControl.IndicatorType];
    var canvas = IndControl.canvas,
    dims = IndControl.dims;
    draw(canvas, dims);
    //drawText(canvas, dims, indicatorFile.title);
    drawImage(canvas, dims, indicatorFile.fileName, {current: IndControl.value, old: IndControl.value_old}, IndControl.drawOldValue);
     // console.log(dims)
}