// QUAY EDIT 4/5/16 BEGIN
// OK GOING TO USE THIS TO KEEP TRACK OF DEFICIT HEIGHT
var dfctHeight = new Array();
dfctHeight["UD"] = 0;
dfctHeight["AD"] = 0;
dfctHeight["ID"] = 0;
dfctHeight["PD"] = 0;

///-------------------------------------------------------------------------------------------------
/// <summary>   Gets deficit height. </summary>
/// <param name="fldname">  The fldname. </param>
/// <returns>   The deficit height. </returns>
///-------------------------------------------------------------------------------------------------

function getDeficitHeight(fldname) {
    var dfctvalue = 0;
    switch (fldname) {
        case "UD":
            dfctvalue = dfctHeight.UD;
            break;
        case "AD":
            dfctvalue = dfctHeight.AD;
            break;
        case "ID":
            dfctvalue = dfctHeight.ID;
            break;
        case "PD":
            dfctvalue = dfctHeight.PD;
            break;

    }
    return dfctvalue;
}

///-------------------------------------------------------------------------------------------------
/// <summary>   Sets deficit height. </summary>
/// <param name="fldname">      The fldname. </param>
/// <param name="dfctvalue">    The dfctvalue. </param>
/// <returns>   . </returns>
///-------------------------------------------------------------------------------------------------

function setDeficitHeight(fldname, dfctvalue) {
    switch (fldname) {
        case "UD_P":
            dfctHeight.UD = dfctvalue;
            break;
        case "AD_P":
            dfctHeight.AD = dfctvalue;
            break;
        case "ID_P":
            dfctHeight.ID = dfctvalue;
            break;
        case "PD_P":
            dfctHeight.PD = dfctvalue;
            break;
    }
}


var dfctValue = new Array();
dfctValue["UD"] = 0;
dfctValue["AD"] = 0;
dfctValue["ID"] = 0;
dfctValue["PD"] = 0;

///-------------------------------------------------------------------------------------------------
/// <summary>   Gets deficit value. </summary>
/// <param name="fldname">  The fldname. </param>
/// <returns>   The deficit value. </returns>
///-------------------------------------------------------------------------------------------------

function getDeficitValue(fldname) {
    var dfctvalue = 0;
    switch (fldname) {
        case "UD_P":
            dfctvalue = dfctValue.UD;
            break;
        case "AD_P":
            dfctvalue = dfctValue.AD;
            break;
        case "ID_P":
            dfctvalue = dfctValue.ID;
            break;
        case "PD_P":
            dfctvalue = dfctValue.PD;
            break;

    }
    return dfctvalue;
}

function getDeficitOffset(fldname) {
    var dfctvalue = 0;
    switch (fldname) {
        case "UD_P":
            dfctvalue = dfctValue.UD;
            break;
        case "AD_P":
            dfctvalue = dfctValue.AD;
            break;
        case "ID_P":
            dfctvalue = dfctValue.ID;
            break;
        case "PD_P":
            dfctvalue = dfctValue.PD;
            break;

    }
    return dfctvalue;
}

///-------------------------------------------------------------------------------------------------
/// <summary>   Sets deficit value. </summary>
/// <param name="fldname">      The fldname. </param>
/// <param name="dfctvalue">    The dfctvalue. </param>
/// <returns>   . </returns>
///-------------------------------------------------------------------------------------------------

function setDeficitValue(fldname, dfctvalue) {
    switch (fldname) {
        case "UD_P":
            dfctValue.UD = dfctvalue;
            break;
        case "AD_P":
            dfctValue.AD = dfctvalue;
            break;
        case "ID_P":
            dfctValue.ID = dfctvalue;
            break;
        case "PD_P":
            dfctValue.PD = dfctvalue;
            break;
    }
}

function GetTotalDeficitValue() {
    var tvalue = 0
    tvalue += dfctValue.UD;
    tvalue += dfctValue.AD;
    tvalue += dfctValue.ID;
    tvalue += dfctValue.PD;
    return tvalue;
}

// QUAY EDIT 4/5/16 END

d3.sankey = function() {
    var sankey = {},
        nodeWidth = 24,
        nodePadding = 8,
        // QUAY EDIT 4/5/16  BEGIN
        imgHeight = 60;
    svgHeight = 480;
        //// QUAY EDIT 4/5/16 END
        size = [1, 1],
        nodes = [],
        links = [],
        useQS = false;
 
  //Custom node & link sizes
  sankey.useQS = function(_) {
    if (!arguments.length) return useQS;
    useQS = _;
    return sankey;
  };

  sankey.nodeWidth = function(_) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = +_;
    return sankey;
  };

  sankey.nodePadding = function(_) {
    if (!arguments.length) return nodePadding;
    nodePadding = +_;
    return sankey;
  };

  sankey.nodes = function(_) {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankey;
  };

  sankey.links = function(_) {
    if (!arguments.length) return links;
    links = _;
    return sankey;
  };

  sankey.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return sankey;
  };

  sankey.layout = function(iterations) {
    computeNodeLinks();
    computeNodeValues();
    computeNodeBreadths();
    computeNodeDepths(iterations);
    computeLinkDepths();
    return sankey;
  };

  sankey.relayout = function() {
    computeLinkDepths();
    return sankey;
  };

  sankey.link = function() {
    var curvature = .5;

    function link(d, offset) {
      var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = d.source.y + d.sy + d.dy / 2,
          y1 = d.target.y + d.ty + d.dy / 2;
      return "M" + x0 + "," + y0
           + "C" + x2 + "," + y0
           + " " + x3 + "," + y1
           + " " + x1 + "," + y1;
    }

    link.curvature = function(_) {
      if (!arguments.length) return curvature;
      curvature = +_;
      return link;
    };

    return link;
  };

   


  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {
    nodes.forEach(function(node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    links.forEach(function(link) {
      var source = link.source,
          target = link.target;
      if (typeof source === "number") source = link.source = nodes[link.source];
      if (typeof target === "number") target = link.target = nodes[link.target];
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues() {
    nodes.forEach(function(node) {
      node.value = Math.max(
        d3.sum(node.sourceLinks, value),
        d3.sum(node.targetLinks, value)
      );
    });
  }

  // Iteratively assign the breadth (x-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.
  function computeNodeBreadths() {
    var remainingNodes = nodes,
        nextNodes,
        x = 0;

    while (remainingNodes.length) {
      nextNodes = [];
      remainingNodes.forEach(function(node) {
        node.x = x;
        node.dx = nodeWidth;
        node.sourceLinks.forEach(function(link) {
          if (nextNodes.indexOf(link.target) < 0) {
            nextNodes.push(link.target);
          }
        });
      });
      remainingNodes = nextNodes;
      ++x;
    }

    //
    moveSinksRight(x);
    scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
  }

  function moveSourcesRight() {
    nodes.forEach(function(node) {
      if (!node.targetLinks.length) {
        node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
      }
    });
  }

  function moveSinksRight(x) {
    nodes.forEach(function(node) {
      if (!node.sourceLinks.length) {
        node.x = x - 1;
      }
    });
  }

  function scaleNodeBreadths(kx) {
    nodes.forEach(function(node) {
      node.x *= kx;
    });
  }

  //=====================================
  //  Step 7
  //   
  //======================================  
  function computeNodeDepths(iterations) {
    var nodesByBreadth = d3.nest()
        .key(function(d) { return d.x; })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) { return d.values; });

    //
    initializeNodeDepth();
    LayoutNodes();
    //resolveCollisions();
    //for (var alpha = 1; iterations > 0; --iterations) {
    //  relaxRightToLeft(alpha *= .99);
    //  resolveCollisions();
    //  relaxLeftToRight(alpha);
    //  resolveCollisions();
    //}
    
    function isConsumer(fldname) {
        return ((fldname = "UD_P") || (fldname = "AD_P") || (fldname = "ID_P") || (fldname = "PD_P"));
    }
    // QUAY EDIT 4/6/16 BEGIN
    function FetchDeficit(fldname) {
    }

    function LayoutNodes() {
        var ResY = 0;
        var ConsY = 0;
        //consumers first
        for (ni = 0; ni < nodesByBreadth[1].length; ni++) {
            // get the node (just testing an array approach, works
            var node = nodesByBreadth[1][ni];
            // set the top to the bottom of last
            node.y = ConsY;

            var offset = 0;
            // get the deficit height for this node
            var DfctValue = getDeficitValue(node.name);
            var DfctRatio = DfctValue / node.value;
            var Deficit = node.dy * DfctRatio;
            // total data height is both met and un met demand
            var TotalBucket = node.dy + Deficit;
            // if this is less than the imag height, add something to push below image
            if (TotalBucket> imgHeight) {
               offset = 0;
            } else {
               offset = imgHeight - TotalBucket;
            }
            // set bottom for next node
             
            ConsY += TotalBucket + offset + nodePadding;
        };
        // ok, let's check to see if theer is more room, if so add a little to very one
        var pixelsleft = size[1] - ConsY;
        if (pixelsleft > (nodesByBreadth[1].length * 2)) {
            var addsome = pixelsleft / nodesByBreadth[1].length;
            nodesByBreadth[1].forEach(function (node) {
                node.y += addsome;
            });

        }
        // resources
        nodesByBreadth[0].forEach(function (node) {
            // same thing but with resources and using foreach()
                node.y = ResY;
                var offset = 0;
                var DfctRatio = getDeficitValue(node.name) / node.value;
                var Deficit = node.dy * DfctRatio;
                var TotalBucket = node.dy + Deficit;
                if (TotalBucket > imgHeight) {
                    offset = 0;
                } else {
                    offset = imgHeight - TotalBucket;
                }
                ResY += TotalBucket + offset + nodePadding;

            
        });
        // ok, let's check to see if theer is more room, if so add a little to very one
        var pixelsleft =  size[1] - ResY;
        if (pixelsleft > (nodesByBreadth[1].length * 2)) {
            var addsome = pixelsleft / nodesByBreadth[0].length;
            nodesByBreadth[0].forEach(function (node) {
                node.y += addsome;
            });

        }
    }

    // QUAY EDIT 4/6/16 END

    function initializeNodeDepth() {
        // calculate how much extra is needed
        
        var ky = d3.min(nodesByBreadth, function (nodes) {
            var nodecnt = nodes.length;
            var imgPCT = 60 / size[1];
            var addpct = 0;

            // QUAY EDIT 4/5/16 Begin
            // return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
            // //------------------------------------------------------------
            var totalvalue = d3.sum(nodes, value);
            nodes.forEach(function (node) {
                var nodePCT = node.value / totalvalue;
                if (nodePCT < imgPCT) {
                    addpct += imgPCT - nodePCT;
                }
            });
            totalvalue += GetTotalDeficitValue() + (addpct * totalvalue);
            var totalpadding = (nodes.length - 1) * nodePadding;
            var HeightForDataBoxes = size[1] - totalpadding - 20;  // 20 is the header
            KYRatio = HeightForDataBoxes / totalvalue;
            return KYRatio;
            // QUAY EDIT 4/5/16 Begin
        });

      var dyValues = [];


      links.forEach(function(link) {
        dyValues.push(link.value * ky);
      });

      var quantile = d3.scale.quantile()
            .domain(dyValues)
            .range(d3.range(4,26, (25-4)/dyValues.length));


      links.forEach(function(link) {
        if(!useQS)
          link.dy = link.value * ky;
        else
          link.dy = quantile(link.value * ky);
      });

      dyValues = [];

      nodesByBreadth.forEach(function(nodes) {
        nodes.forEach(function(node, i) {
          dyValues.push(node.value * ky);
        });
      });
      // QUAY EDIT 4/6/16 
      // rescale all the deficit box heights
      dfctHeight.AD = dfctValue.AD * ky;
      dfctHeight.UD = dfctValue.UD * ky;
      dfctHeight.ID = dfctValue.ID * ky;
      dfctHeight.PD = dfctValue.PD * ky;

      //=======================


      quantile = d3.scale.quantile()
            .domain(dyValues)
            .range(d3.range(45,71,1));

      nodesByBreadth.forEach(function(nodes) {
        nodes.forEach(function(node, i) {
          node.y = i;

          if(!useQS)
            node.dy = node.value * ky;
          else{
            node.dy = quantile(node.value);
            node.exactSize = 0;
            if(node.sourceLinks.length){
              node.sourceLinks.forEach(function(link, i) {
                node.exactSize += link.dy;
              });
            }
            else{
              node.targetLinks.forEach(function(link, i) {
                node.exactSize += link.dy;
              });
            }
          }
        });
      });
    }

    function relaxLeftToRight(alpha) {
      nodesByBreadth.forEach(function(nodes, breadth) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedSource(link) {
        return center(link.source) * link.value;
      }
    }

    function relaxRightToLeft(alpha) {
      nodesByBreadth.slice().reverse().forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.sourceLinks.length) {
            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedTarget(link) {
        return center(link.target) * link.value;
      }
    }

    //=======================================================
    //  
    //   
    //========================================================
    function resolveCollisions() {
      nodesByBreadth.forEach(function(nodes) {
        var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i;

        // Push any overlapping nodes down.
        nodes.sort(customDepth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y0 - node.y;
          if (dy > 0) node.y = y0;
          //if (dy > 0) node.y += dy;
          defictheight = getDeficitHeight(node.name);
          y0 = node.y + node.dy + nodePadding+defictheight;
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y0 - nodePadding - size[1];
        if (dy > 0) {
          y0 = node.y -= dy;

          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
              node = nodes[i];
              // QUAY EDIT 4/5/16 BEGIN
            //dy = node.y + node.dy + nodePadding - y0 ;
           
            defictheight = getDeficitHeight(node.name);
            dy = (node.y + node.dy + nodePadding + defictheight )- y0;
              // QUAY EDIT 4/5/16 BEGIN
            if (dy > 0) node.y -= dy;
            y0 = node.y;
          }
        }
      });
    }

    function ascendingDepth(a, b) {
      return a.y - b.y;
    }

    //Return weights so that nodes are sorted based on chart order
    function getWeight(a) {
        //console.log('getWeight:', a);
      var aWeight = 0;
      switch(a){
        case "SUR_P":
          aWeight = 0;
          break;
          case "SURL_P":
          aWeight = 1;
          break;
          case "GW_P":
          aWeight = 2;
          break;
          case "REC_P":
          aWeight = 3;
          break;
          case "SAL_P":
          aWeight = 4;
          break;
          case "UD_P":
          aWeight = 5;
          break;
          case "AD_P":
          aWeight = 6;
          break;
          case "ID_P":
          aWeight = 7;
          break;
          case "PD_P":
          aWeight = 8;
          break;
      }
      return aWeight;
    }

    function customDepth(a, b){
      var aWeight = getWeight(a),
      bWeight = getWeight(b);

      return aWeight- bWeight;
    }
  }

  function computeLinkDepths() {
    nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach(function(node) {
      var sy = 0, ty = 0;
      node.sourceLinks.forEach(function(link) {
        link.sy = sy;
        sy += link.dy;
      });
      node.targetLinks.forEach(function(link) {
        link.ty = ty;
        ty += link.dy;
      });
    });

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  function center(node) {
    return node.y + node.dy / 2;
  }

  function value(link) {
    return link.value;
  }

  return sankey;
};

//=========================================================================
//  STEP 1
//   
//    
//============================================================================
//Sankey class: draws a sankey inside an SVG in the specified DIV
//use the update function to redraw with new data but same options as declaration
//linkColorScheme: (0 (Source), 1 (Target), 2 (Gradient))
function Sankey(fluxList, modelOutput, divID, options){// width, height, linkColorScheme){

  var defaults = {
    width: 700, //SVG width
    svgHeight: 500, //SVG height
    linkColorScheme: 0, //0 (Source), 1 (Target), 2 (Gradient)
    units: "MGD", //units displayed with values
    nodeWidth: 20, //width of rects
    imgWidth: 40, //width of image
    imgHeight: 60, //height of image
    nodePadding: 50, //vertical space between nodes
    // QUAY EDIT 4/5/16 BEGIN
    // This keeps the recatnagles scaled to the actual values
    //useQS: true, //use custom scaling to make rects match links
    useQS: false, //use custom scaling to make rects match links
    titlefontsize: "24px",
    titleOffset: 20,
    bucketfontsize: "16px",
    // QUAY EDIT 4/5/16 END
    autoScaleImgHeight: false, //scale image based on rect height
    showText: false, //show text label beside Resource/Consumer
    imgPath: "/Images/Sankey/White/" //User defined path for Resource/Consumer images
  };

  //fill defaults with user specified options
  if(typeof(options) != "undefined"){
      for(var option in options){
          defaults[option] = options[option];
      }
  }

  //If width is smaller than optimal scale down width objects
  if(defaults.width < 400){
    var ratio = defaults.width / 500;
    defaults.nodeWidth = ratio * defaults.nodeWidth;
    defaults.imgWidth = ratio * defaults.imgWidth;
  }

  //If height is smaller than optimal scale down height objects
  // QUAY EDIT 4/7/16 
  //if (defaults.height < 500) {
  if (defaults.svgHeight < 500) {
          //---------------------------
    var ratio = defaults.svgHeight / 500;
    defaults.imgHeight = ratio * defaults.imgHeight;
    defaults.nodePadding = ratio * defaults.nodePadding;// - 12.5;
  }

  //setup colors
  var red = '#E6585D';

// QUAY EDIT 4/6/16  BEGIN
// Moved this to ipad/core.js so can be used to control colors of chart and inputs
  //var colorBrewer = {
  //  "SUR": '#8dd3c7',
  //  "SURL": '#ffffb3',
  //  "GW": '#bebada',
  //  "REC": '#80b1d3',
  //  "SAL": '#fdb462',
  //  "UD": '#b3de69',
  //  "ID": '#fccde5',
  //  "AD": '#d9d9d9',
  //  "PD": '#bc80bd'
  //};
    // QUAY EDIT 4/6/16  END

    //======================================================
    //  STEP 2
    //   
    //    
    //===========================================================
  //Draw sandkey with specified parameters
  function drawSankey(fluxList, modelOutput, divID, defaults) {

      console.log('Sankey drawSankey:', modelOutput)

      // QUAY EDIT 4/11/16
      // Loading of labels from INFO_REQUEST
      GWLabel = "";
      RECLabel = "";
      SURLabel = "";
      SURLLabel = "";
      SALLable = "";
      UDLabel = "";
      ADLabel = "";
      IDLabel = "";
      PDLabel = "";
      $.each(INFO_REQUEST.FieldInfo, function () {
          switch (this.FLD) {
              case "GW_P":
                  GWLabel = this.LAB;
                  break;
              case "REC_P":
                  RECLabel = this.LAB;
                  break;
              case "SUR_P":
                  SURLabel = this.LAB;
                  break;
              case "SURL_P":
                  SURLLabel = this.LAB;
                  break;
              case "SAL_P":
                  SALLabel = this.LAB;
                  break;
              case "UD_P":
                  UDLabel = this.LAB;
                  break;
              case "AD_P":
                  ADLabel = this.LAB;
                  break;
              case "ID_P":
                  IDLabel = this.LAB;
                  break;
              case "PD_P":
                  PDLabel = this.LAB;
                  break;
          }
      });
  
      var fields = {
          "GW_P": { name: GWLabel },
          "REC_P": { name: RECLabel },
          "SUR_P": { name: SURLabel },
          "SURL_P": { name: SURLLabel },
          "SAL_P": { name: SALLabel }
      };

    //  var fields = {
    //  "GW": {name: "Groundwater"},
    //  "REC": {name: "Reclaimed"},
    //  "SUR": {name: "Surface"},
    //  "SURL": {name: "Lake"},
    //  "SAL": {name: "Saline"}
    //};


    //Loop through model results to get the Demand/Deficit for consumers
      for (var index = 0; index < modelOutput.RESULTS.length; index++) {
      switch(modelOutput.RESULTS[index].FLD){
        case "UD_P":
          var vals = modelOutput.RESULTS[index].VALS[0].VALS;
          var field = {};

          field.val = vals[vals.length-1];
          field.name = UDLabel; //"Urban/Rural";

          fields[modelOutput.RESULTS[index].FLD] = field;
          break;
        case "UDN_P":
          var vals = modelOutput.RESULTS[index].VALS[0].VALS;
          var field = {};
          field.val = vals[vals.length-1];
          // QUAY EDIT 4/6/16 
          setDeficitValue("UD_P", field.val);
          //=======================

          fields[modelOutput.RESULTS[index].FLD] = field;
          break;
        case "ID_P":
          var vals = modelOutput.RESULTS[index].VALS[0].VALS;
          var field = {};
          field.val = vals[vals.length-1];
          field.name = IDLabel;// "Industry";
          
          fields[modelOutput.RESULTS[index].FLD] = field;
          break;
        case "IDN_P":
          var vals = modelOutput.RESULTS[index].VALS[0].VALS;
          var field = {};
          field.val = vals[vals.length-1];
            // QUAY EDIT 4/6/16 
          setDeficitValue("ID_P", field.val);
            //=======================
          fields[modelOutput.RESULTS[index].FLD] = field;
          break;
        case "AD_P":
          var vals = modelOutput.RESULTS[index].VALS[0].VALS;
          var field = {};

          field.val = vals[vals.length-1];
          field.name = ADLabel; //"Agriculture";
          
          fields[modelOutput.RESULTS[index].FLD] = field;
          break;
        case "ADN_P":
          var vals = modelOutput.RESULTS[index].VALS[0].VALS;
          var field = {};
          field.val = vals[vals.length-1];
          // QUAY EDIT 4/6/16 
          setDeficitValue("AD_P", field.val);
          //=======================
          fields[modelOutput.RESULTS[index].FLD] = field;
          break;
        case "PD_P":
          var vals = modelOutput.RESULTS[index].VALS[0].VALS;
          var field = {};

          field.val = vals[vals.length-1];
          field.name = PDLabel;// "Power";
          
          fields[modelOutput.RESULTS[index].FLD] = field;
          break;
        case "PDN_P":
          var vals = modelOutput.RESULTS[index].VALS[0].VALS;
          var field = {};
          field.val = vals[vals.length-1];
          // QUAY EDIT 4/6/16 
          setDeficitValue("PD_P", field.val);
          //=======================

          fields[modelOutput.RESULTS[index].FLD] = field;
          break;
        case "GW_P":
        case "REC_P":
        case "SUR_P":
        case "SURL_P":
        case "SAL_P":
            var vals = modelOutput.RESULTS[index].VALS[0].VALS;
            fields[modelOutput.RESULTS[index].FLD].val = vals[vals.length - 1];
            break;
      }
    }
    //console.log('modelOutput.RESULTS:', modelOutput.RESULTS);
    console.log('Sankey fields:', JSON.stringify(fields));
    // QUAY EDIT 4/6/16 BEGIN
    // Calculate layout stats


    // QUAY EDIT 4/6/16 END


    var units = defaults.units,
    nodeWidth = defaults.nodeWidth,
    imgWidth = defaults.imgWidth,
    imgHeight = defaults.imgHeight,
    useQS = defaults.useQS,
    nodePadding = defaults.nodePadding;

    // STEPTOE EDIT 05_11_16 BEGIN
    var divHeight = defaults.divHeight ? defaults.divHeight : 550;
    //console.log('divHeight:', divHeight)
    // STEPTOE EDIT 05_11_16 END

    // QUAY EDIT 4/5/20116
    //var margin = {top: 10, right: 10 + nodeWidth + imgWidth, bottom: 10, left: 10 + nodeWidth + imgWidth},
    
    // STEPTOE EDIT 07_03_17 - buckets are gone so decrease padding on left and right
    //var margin = {top: 40, right: 10 + nodeWidth + imgWidth, bottom: 10, left: 10 + nodeWidth + imgWidth},
      //var margin = { top: 40, right: 10 + imgWidth, bottom: 10, left: 10 + imgWidth },
      var margin = { top: 40, right: 10, bottom: 10, left: 10 },
        width = defaults.width - margin.left - margin.right,
        height = defaults.svgHeight - margin.top - margin.bottom;

    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function(d) { return formatNumber(d) + " " + units; },
        color = d3.scale.category20();

    // Delete old Sankey
    d3.select(divID).select("svg").remove();


    // append the svg canvas to the page
    var svg = d3.select(divID).append("svg")
        .attr("width", width + margin.left + margin.right)

        // STEPTOE EDIT 05_11_16 BEGIN
        // .attr("height", height + margin.top + margin.bottom)
        //.attr("height", divHeight + margin.top + margin.bottom)
        .attr("height", defaults.svgHeight + margin.top + margin.bottom)
        // STEPTOE EDIT 05_11_16 END
        
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    // QUAY EDIT 4/5/16 BEGIN
    // add the sources of water label
    // Do it from the edge of the images
    svg.append("text")
      //.attr("x", 0 - imgWidth)
        .attr("x", 0)
      .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "start")
        .style("font-size", defaults.titlefontsize)
        .text("Sources of Water");
     // and the cosumers
     // have this end at the right endge of the images
     svg.append("text")
      //.attr("x", width + imgWidth)
         .attr("x", width)
      .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "end")
        .style("font-size", defaults.titlefontsize)
        .text("Consumers of Water");

    // QUAY EDIT 4/5/16 BEGIN

    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(nodeWidth)
        // .nodeWidth(36)
        .nodePadding(nodePadding)
        .size([width, height])
        .useQS(useQS);

    var path = sankey.link();

    var y = d3.scale.linear()
      .domain([0, 10000])
      .range([1, 6]);

    var fluxValues = [];

    fluxList.ForEach(function (d,i) {
      fluxValues.push(d.LastValue());
    });



    var quantile = d3.scale.quantile()
      .domain(fluxValues)
      .range([1,10]);

    //set up graph in same style as original example but empty
    graph = { "nodes": [], "links": [] };

    function getDefVal(name) {
        console.log('Sankey getDefVal:', name, defLabel)
        var value = 0;
        switch (name) {
            case "UD_P":
            case "ID_P":
            case "AD_P":
            case "PD_P":
                var defLabel = name.split('_')[0] + 'N_P';
                value = +fields[defLabel].val;
                break;
            default:
                break;
        }
        return value;
    }

    //=============================================================
    //  STEP 4
    //   
    //================================================================


    console.log('Sankey fluxList:', fluxList);
    fluxList.ForEach(function(d){
        // console.log(d.field, d.Consumer, d.LastValue());
        //console.log('fluxList.ForEach:',d);

      if(d.LastValue()){
        graph.nodes.push({ "name": d.Resource });
        graph.nodes.push({ "name": d.Consumer });
        graph.links.push({ "source": d.Resource,
                           "target": d.Consumer,
                          // "value": Math.max(100, +d.LastValue()) });
                           "value": +d.LastValue()
        });
                          // "value": quantile(+d.LastValue()) });
      }
    });

     // return only the distinct / unique nodes
     graph.nodes = d3.keys(d3.nest()
       .key(function (d) { return d.name; })
       .map(graph.nodes));

     // loop through each link replacing the text with its index from node
     graph.links.forEach(function (d, i) {
       graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
       graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
     });

     //now loop through each nodes to make nodes an array of objects
     // rather than an array of strings
     graph.nodes.forEach(function (d, i) {
       graph.nodes[i] = { "name": d };
     });

     console.log('Sankey graph:', JSON.stringify(graph));

      //================================================
      //  Step 5
      //   
      //    
      //========================================================     
      //setup d3 sankey
    sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

    // define utility functions
    function getLinkID(d){
        return "link-" + d.source.name + "-" + d.target.name;
    }
    function nodeColor(d) {
        return d.color = colorBrewer[d.name.replace(/ .*/, "")];
    }

    //create gradients if gradient is the current color scheme
    if(defaults.linkColorScheme == 2){
      var defs = svg.append("defs");

      // create gradients for the links
      var grads = defs.selectAll("linearGradient")
              .data(graph.links, getLinkID);

      grads.enter().append("linearGradient")
              .attr("id", getLinkID)
              .attr("gradientUnits", "objectBoundingBox"); 
                      //stretch to fit

      grads.html("") //erase any existing <stop> elements on update
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", function(d){
              return nodeColor( (+d.source.x <= +d.target.x)? 
                               d.source: d.target) ;
          });

      grads.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", function(d){
              return nodeColor( (+d.source.x > +d.target.x)? 
                               d.source: d.target) 
          });
    }

    console.log('Sankey graph.links:', graph.links);

    // add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
      .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke", function(d){
          switch(defaults.linkColorScheme){
            //Source
              case 0:
              d.color = colorBrewer[d.source.name.replace(/ .*/, "")];
              break;
            //Target
            case 1:
              d.color = colorBrewer[d.target.name.replace(/ .*/, "")];
              break;
            //Gradient
            case 2:
              d.color = "url(#" + getLinkID(d) + ")";
              break;
          }
          return d.color;
        })
        .style("stroke-width", function (d) { return Math.max(1, d.dy); })
        .style("fill", "none")
        .style("stroke-opacity", .5)
        .sort(function(a, b) { return b.dy - a.dy; });

    // add the link titles
    link.append("title")
          .text(function(d) {
          return fields[d.source.name].name + " → " + 
                  fields[d.target.name].name + "\n" + format(d.value); });

    // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
      .enter().append("g")
        .attr("class", "node")
        .attr("id", function (d) { return d.name + "_node"; })
        .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; });
      //Uncomment below to enable dragging, NOT TESTED!!!
      /*.call(d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart", function() { 
        this.parentNode.appendChild(this); })
        .on("drag", dragmove));*/
    //======================================================
    //  
    //   
      //=======================================================

    // STEPTOE EDIT BEGIN 06/21/2017 - Remove buckets
    // add the rectangles for the nodes (Consumers/Resources)
    node.append("rect")
        .attr("height", function(d) {
            if (!useQS)
                return d.dy;
            else
                return d.exactSize;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) { 
          return d.color = colorBrewer[d.name.replace(/ .*/, "")];
        })
        .style("stroke", function(d) { 
            return d3.rgb(d.color).darker(2);
        })
      .append("title")
        .text(function (d) {
          if(fields[(d.name.split('_')[0]) + "N_P"])
            return fields[d.name].name + "\nDemand: " + format(d.value);
          else
            return fields[d.name].name + "\nAvailable: " + format(d.value);
        });

    // add the Deficit rectangles for the Consumers
    node.filter(function(d){
        switch(d.name){
          case "UD_P":
          case "ID_P":
          case "AD_P":
          case "PD_P":
            condition = true;
            break;
          default:
            condition = false;
            break;
        }
        return condition;
      })
      .append("rect")
        .attr("height", function (d) {
            var name = d.name.split('_')[0];
            var ratio = fields[name + "N_P"].val / d.value; // QUAY EDIT 4/7/16  fields[d.name].val;
          // QUAY EDIT 4/5/16 BEGIN
          // OK NEED TO KEEP TRACK OF THIS
          if (!useQS) {
              // get the defiict height in pixels
              pxheight = ratio * d.dy;
              return pxheight;
          }
          else {
              // get the defiict height in pixels
              pxheight = ratio * d.exactSize;
              //// save this
              //setDeficitHeight(fields[d.name],pxheight);
              //// return
              return pxheight;
              //return ratio * d.exactSize;
          }
          // QUAY EDIT 4/5/16 END
        })
        .attr("width", sankey.nodeWidth())
        .attr("transform", function(d){
          if(!useQS)
            return "translate(0," + (d.dy + 1) + ")";
          else
            return "translate(0," + (d.exactSize + 1) + ")";                
        })
        .style("fill", function(d) { 
        // return d.color = color(d.name.replace(/ .*/, ""));
          return d.color = red;
        })
        .style("stroke", function(d) { 
        return d3.rgb(d.color).darker(2); })
      .append("title")
        .text(function (d) {
            var name = d.name.split('_')[0];
          return fields[d.name].name + "\nDeficit: " + format(fields[name + "N_P"].val);
        });
    // STEPTOE EDIT BEGIN 06/21/2017 - Remove buckets

//=======================================================================================
// QUAY EDIT 4/5/16 BEGIN
// need to readjust the padding of the consumer nodes to reflect the height of the deficit rectangles


// QUAY EDIT 4/5/16 END
//=======================================================================================


    // add the images for the Nodes (Consumers/Resources)
    //node.append("svg:image")
    //    .attr("height", function(d) {

    //      if(defaults.autoScaleImgHeight){
    //        var ratio = 1;
    //        if(fields[d.name + "N"])
    //          ratio += fields[d.name + "N"].val / fields[d.name].val;

    //        if(!useQS)
    //          return ratio * d.dy;
    //        else
    //          return ratio * d.exactSize;
    //      }
    //      else{
    //        return imgHeight;
    //      }
          
    //      // return d.dy;
    //    })
    //    .attr("width", imgWidth)
    //    .attr("xlink:href", function (d) {
    //      // console.log(defaults.imgPath + d.name + ".png");
    //      return defaults.imgPath + d.name + ".png";
    //    })
    //    .attr("transform", function(d){
    //      var transform = "translate(";
    //      switch(d.name){
    //        case "UD":
    //        case "ID":
    //        case "AD":
    //        case "PD":
    //          transform += "0,0)";
    //          break;
    //        default:
    //          // STEPTOE EDIT BEGIN 06/21/2017 - Remove buckets
    //            transform += "-" + (imgWidth + 1) + ",0)";
    //          //transform += "-10,0)";
    //          // STEPTOE EDIT END 06/21/2017 - Remove buckets
    //          break;
    //      }
    //      return transform;
    //    })
    //  .append("title")
    //    .text(function(d) {
    //      var outputString = fields[d.name].name + "\n";
    //      switch(d.name){
    //        case "UD":
    //        case "ID":
    //        case "AD":
    //        case "PD":
    //          outputString += "Demand: " + format(fields[d.name].val) + "\n";
    //          outputString += "Deficit: " + format(fields[d.name + "N"].val) + "\n";
    //          outputString += "Total: " + format(fields[d.name].val + fields[d.name + "N"].val);
    //          break;
    //        default:
    //          outputString += format(d.value);
    //          break;
    //      }
    //      return outputString;
    //    });

    if (defaults.showText) {
        // add in the text that displays beside the rectangles
        // for the nodes (Consumers/Resources)
        node.append("text")
            // QUAY EDIT 4/7/16
            .style("font-size", defaults.bucketfontsize)
            .style("font-weight", "bold")
            //-----------------------
            .attr("x", -6)
            .attr("y", function (d) {
                var ratio = 1;
                if (fields[d.name + "N"])
                    ratio += fields[d.name + "N"].val / fields[d.name].val;

                if (!useQS)
                    return (ratio) * d.dy / 2;
                else
                    return (ratio) * d.exactSize / 2;
                // return d.dy / 2;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function (d) { return fields[d.name].name; })
          .filter(function (d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");
    }
    // the function for moving the nodes
    // NOT TESTED
    function dragmove(d) {
      d3.select(this).attr("transform", 
          "translate(" + d.x + "," + (
                  d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
              ) + ")");
      sankey.relayout();
      link.attr("d", path);
    }
    
    return sankey;
  }
  //===========================================================================
  this.update = function(fluxList, modelOutput){
    this.sankey = drawSankey(fluxList, modelOutput, this.divID, this.defaults);
  }

  this.divID = divID;
  this.defaults = defaults;
  this.sankey = drawSankey(fluxList, modelOutput, divID, defaults);
}