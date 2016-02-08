var HorizontalBarChart = React.createClass({

    getInitialState: function() {

        var data = this.props.data_function();

        data = data.chartData;

        //var test_data = [];

        var rand = getRandomInt(1, (data[0]["t"] / (data.length + 2)));

        var last_value = false;

        for (var i = 0; i < data.length; i++)
        {
            for (var key in data[i])
            {

                if (key.length != 1) continue;

                //if (!this.props.labels_mapping[key] || typeof this.props.labels_mapping[key] == "undefined") continue;

                if (!last_value)
                {
                    last_value = data[i][key];
                }
                else
                {
                    last_value = Math.round(last_value - (last_value / 100 * getRandomInt(4, 10)));
                }

                data[i][key] = last_value;

            }
        }

        function getRandomInt(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

/*
        data = data.chartDPTotal.dp;

        var formatted_data = [];

        for (var i = 0; i < data.length; i++)
        {
            formatted_data.push({ label : data[i]['label'], value: data[i]["data"][0][1] })
        }
*/
        return {
            data : data,
            fully_opened : false
        };
    },

    componentWillMount: function() {

        $(event_emitter).on('date_choise', function(e, period){ // todo: rename to date_change

            var data = this.props.data_function();

            data = data.chartData;

            //var test_data = [];

            var rand = getRandomInt(1, (data[0]["t"] / (data.length + 2)));

            var last_value = false;

            for (var i = 0; i < data.length; i++)
            {
                for (var key in data[i])
                {

                    if (key.length != 1) continue;

                    if (!last_value)
                    {
                        last_value = data[i][key];
                    }
                    else
                    {
                        last_value = Math.round(last_value - (last_value / 100 * getRandomInt(2, 6)));
                    }

                    //console.log("last_value:", last_value, ", minus:", (last_value / 100 * getRandomInt(10, 40)));

                    data[i][key] = last_value;

                }
            }

            function getRandomInt(min, max)
            {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            this.setState({
                data : data
            });


        }.bind(this));

        $(event_emitter).on('data_changed', function(e, data){



        }.bind(this));

    },

    draw : function(container)
    {

        var self = this;

        var margin = {
            top    : 20,
            right  : 150,
            bottom : 30,
            left   : 40
        };

        var colors = ["#1A8AF3", "#5DCBFF", "#9521B8", "#26C1B9", "#9FC126", "#0FB654", "#A63818", "#F73930", "#FD8927", "#F9BD34", "#FF7575"];

        var height = this.props.height;
        var width = this.props.width;
        var bar_blocks_top_margin = 15;
        var bar_height = this.props.bar_height;
        var bar_margin_bottom = this.props.bar_margin_bottom;
        var bar_margin_right = 40;
        var bar_text_margin_left = 10;

        var label_margin_bottom = 20;

        var data = this.state.data;

        var keys = [];
        var data_key_label = this.props.label_key;

        for (var key in data[0])
        {
            if (key.length == 1 && this.props.labels_mapping[key])
            {
                keys.push(key);
            }
        }

        width = Math.round(width / keys.length) - bar_margin_right;

        var horizontal_scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, width])

        if (!this.chart)
        {
            this.chart = d3.select(container)
                .attr("width", width + margin.left + margin.right)
                .attr("height", ((bar_height + bar_margin_bottom) * 4) + "px")
                .append("div")
                    .style("position",  "absolute")
                    .style("left",  margin.left + "px")
                    .style("top", margin.top + "px")


            //for (var di = 0; di < data.length; di++)
            for (var k = 0; k < keys.length; k++)
            {
                this.labels = this.chart.append("div")
                    .attr("class", "block_label")
                    .style("position",  "absolute")
                    .style("left",  (k * (width + bar_margin_right)) + "px")
                    .style("width",  width + "px")
                    .html(function(d, i){
                        return self.props.labels_mapping[keys[k]];
                    })
            }

        }
        else
        {

            if (self.state.fully_opened)
            {
                var height = (bar_height + bar_margin_bottom) * 11;
            }
            else
            {
                var height = (bar_height + bar_margin_bottom) * 6;
            }


            d3.select(container)
                .attr("height", height)
        }

        var current_data = data.slice(0, 10);
        var other_data = data.slice(5, 11);

/*
        if (!this.labels)
        {

            for (var k = 0; k < keys.length; k++)
            {

                var key = keys[k];

                this.labels = this.chart.append("text")
                    .attr("class", "label")
                    .text(function(d) {
                        return self.props.labels_mapping[key];
                    })
                    .style("fill", "black")
                    .attr("transform", function(d, i) {
                        return "translate(" + (k * (width + bar_margin_right)) + ", 0)";
                    })

            }
        }
*/
        for (var k = 0; k < keys.length; k++)
        {

            var key = keys[k];

            var total = 0;

            data.forEach(function(elem){

                total += elem[key];

            });

            var other_total = 0;

            other_data.forEach(function(elem){
                other_total += elem[key];
            });

            /*var other_block = { "device" : "other" };

            other_block[key] = other_total;*/

            //current_data.push(other_block);

            var combined_data = current_data.concat([/*other_block*/]);

            console.log("==================== combined_data ===================");
            console.log(combined_data);

            var bar_block = this.chart.selectAll("div.bar_block_" + k)
                                .data(combined_data, function(d){
                                    return d[data_key_label];
                                })

            // --- update ---


            bar_block
                .transition()
                .duration(750)

            bar_block
                .style("left", function(d, i){

                    if (i < 5 || self.state.fully_opened)
                    {
                        //console.log("k 1:", k, " ->>", width, "-->",  bar_margin_right);
                        var left = k * (width + bar_margin_right);
                    }
                    else {

                        var nk = i - 5;
/*
                        var x = 10 * nk;
                        var y = parseInt(7 * (bar_margin_bottom + bar_height));
*/
                        //console.log("k 2:", (nk * (width + bar_margin_right)));

                        var left = nk * (width + bar_margin_right);
                    }

                    return (left  + "px");
                })
                .style("top", function(d, i){
                    return (((parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + label_margin_bottom) + "px");
                })

            var update_bar_outer = bar_block
                                      .selectAll(".bar-outer")
                                      .style("width", function(d, i){

                                          if (i < (5 + 1) || self.state.fully_opened) // +1 - first rect in set
                                          {
                                              return width + "px";
                                          }
                                          else
                                          {
                          /*
                                              var percent = Math.round((d[key] / total) * 100);
                                              var rect_width = Math.round(horizontal_scale(percent));
                                              return width + "px";*/

                                              return "20px";
                                          }

                                      })

            console.log("============ update_bar_outer =============");
            console.log(update_bar_outer);

            var i = 0;
            var iw = 0;
            var ih = 0;

            var bar_inner = update_bar_outer.selectAll(".bar-inner")
                .style("width", function(d, i){

                    var d = combined_data[i]; // todo: FIX - not actual data in default  "d"
                    i++;

                    return (d.percent) + "%";

                })
                .style("background-color", function(d, i){

                    if (i < (5) || self.state.fully_opened)
                    {
                        return colors[k];
                    }
                    else
                    {

                        return "#cccccc";
                    }

                })
                .style("width", function(d, i){

                    var d = combined_data[iw]; // todo: FIX - not actual data in default  "d"
                    iw++;

                    if (i < (5) || self.state.fully_opened)
                    {
                        var percent = Math.round((d[key] / total) * 100);
                        return (percent) + "%"; // todo: remove -10 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    }
                    else
                    {

                        return "100%";
                    }

                })

            bar_inner.selectAll("bar-inner-text")
                .html(function(d, i) {

                    var d = combined_data[ih]; // todo: FIX - not actual data in default  "d"
                    ih++;

                    if (i < 5 || self.state.fully_opened)
                    {
                        return d[data_key_label];
                    }
                    else if (i == data.length - 1)
                    {
                        return "Other";
                    }
                    else
                    {

                        return "";
                    }

                })


            bar_block.selectAll(".percent")
                    .html(function(d, i) {

                        console.log("========= percent =======", i);
                        console.log(d);

                        var percent = Math.round((d[key] / total) * 100);

                        return (percent) + "%";
                    })

            /// old
/*
            bar_block
                .transition()
                .duration(750)
                .attr("transform", function(d, i) {

                    if (i < 5 || self.state.fully_opened)
                    {
                        //console.log("k 1:", k, " ->>", width, "-->",  bar_margin_right);
                        return "translate(" + (k * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + ")";
                    }
                    else {

                        var nk = i - 5;

                        var x = 10 * nk;
                        var y = parseInt(7 * (bar_margin_bottom + bar_height));

                        //console.log("k 2:", (nk * (width + bar_margin_right)));

                        return "translate(" + (nk * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + ")";
                    }

                })

            bar_block.selectAll(".back_rect")
                .transition()
                .delay(750)
                .duration(750)
                .attr("width", function(d, i) {

                      if (i < (6 + 1) || self.state.fully_opened) // +1 - first rect in set
                      {
                          return width;
                      }
                      else {

                          var percent = Math.round((d[key] / total) * 100);
                          var rect_width = Math.round(horizontal_scale(percent));
                          return rect_width;
                      }                            //return "translate(" + (k * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + 10) + ")";
                })


            var i = 0;

            bar_block.selectAll(".bar_rect")
                      .transition()
                      .duration(750)
                      .style("fill", function(d, i){

                          if (i < (5) || self.state.fully_opened)
                          {
                              return colors[k];
                          }
                          else
                          {

                              return "#cccccc";
                          }

                      })
                      .attr("d", function(d){

                            var d = data[i]; // todo: FIX - not actual data in default  "d"
                            i++;

                            var percent = Math.round((d[key] / total) * 100);
                            var bar_width = Math.round(horizontal_scale(percent));

                            if (i < (6 + 1) /*|| self.state.fully_opened*/  /*   )
                            {
                                var round_corner = true;
                            }
                            else {

                                var round_corner = false;
                            }

                            var rect = self.rounded_rect(0, 0, bar_width, bar_height, 2, round_corner, false, round_corner, false);

                            return rect;
                    })


            var bar_labels = bar_block.selectAll(".bar_label")
                    .text(function(d, i) {

                                if (i < 5 || self.state.fully_opened)
                                {
                                    return d[data_key_label];
                                }
                                else if (i == data.length - 1)
                                {
                                    return "Other";
                                }
                                return
                                {

                                    return "";
                                }

                    })
                    .attr("y", function(d) {
                        var y = this.getBBox().height / 2 + bar_height / 2;
                        return y;
                    }).style("opacity", function(d, i) {

                        /*var gradient = defs.append("linearGradient")
                          .attr("id", gradient.id)*/
/*
                        var gradient = self.chart
                                          .selectAll("defs")
                                          .selectAll("#text_gradient_" + key + "_" + i)
                                          .selectAll("stop")

                        console.log("----- gradient -----" + key + "_" + i);
                        //console.log(d3.select(gradient[0][0]).selectAll("stop"));
                        console.log(gradient);

                        //defs

                        //var stops = d3.select(gradient[0]).selectAll("stops");
                        /*var stops = gradient[0].selectAll("stops");

                        console.log("----------- stops ------------");
                        console.log(stops);*/
/*
                        if (i < 5)
                        {
                            return 1;
                        }
                        else
                        {
                            return 0;
                        }

                    })
                    .transition()
                    .duration(750)

                    bar_labels
                            .filter(function(d, i){

                                if (i < 5) return false;

                                return true;

                            })
                            .delay(750)
                            .transition()
                            .duration(750)
                            .style("opacity", 1)


            var p = 0;
            var pi = 0;
            var last_text_width = 0;

            bar_block.selectAll(".percent")
                .style("display", function(d, i){

                    if (i > 5 && self.state.fully_opened == false)
                    {
                        return "none";
                    }
                    else
                    {
                        return "block";
                    }

                })
                .transition()
                .duration(750)
                .attr("transform", function(d, i) {

                    var text_width = width - this.getBBox().width;
/*
                    if (this.getBBox().width != 0)
                    {
                        last_text_width = text_width; // last_text_width - fix. text_width = 0 to appear text blocks
                    }
                    else {
                        text_width = last_text_width;
                    }
*//*
                    var x = Math.round(text_width) - 20;
                    var y = Math.round(this.getBBox().height / 2 + bar_height / 3);

                    //console.log(pi, "::", text_width, " -> translate(" + x + ", " + y + ")");

                    pi++;

                    return "translate(" + x + ", " + y + ")";

                })
                /*.text(function(d) {

                    var d = data[p]; // todo: FIX - not actual data in default  "d"
                    p++;

                    if (!d[key])
                    {
                          var percent = 0;
                    }
                    else
                    {
                          var percent = Math.round((d[key] / total) * 100);
                    }

                    return percent + "%";
                })*/

                /*.attr("x", function(d) {

                    var d = data[pi]; // todo: FIX - not actual data in default  "d"
                    pi++;

                    var x = Math.round(width - this.getBBox().width) - 20;

                    console.log("update x:", x, ", width:", this.getBBox().width);

                    return x;
                })
                .attr("y", function(d) {
                        var y = this.getBBox().height / 2 + bar_height / 2;

                        console.log("update y:", y);

                        return y;
                })*/
                /*.text(function(d, i) {

                    var d = data[p]; // todo: FIX - not actual data in default  "d"
                    p++;

                    if (i > (6) || self.state.fully_opened)
                    {
                        return "";
                    }

                    if (!d[key])
                    {
                        var percent = 0;
                    }
                    else
                    {
                        var percent = Math.round((d[key] / total) * 100);
                    }

                    return percent + "%";
              })
              .style("fill", "black")
              */

            // --- enter ---

            var skip_width = 0;

            var enter_blocks = bar_block.enter().append("div")
                .attr("class", "bar_block bar_block_" + k)
                .style("left", function(d, i){

                    if (i < 5 || self.state.fully_opened)
                    {
                        //return "translate(" + (k * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + ")";
                        var left = k * (width + bar_margin_right);
                    }
                    else {

                        var percent = Math.round((d[key] / total) * 100);
                        var rect_width = Math.round(horizontal_scale(percent));


                        //var m = i - 5;

                        var x = (k * (width + bar_margin_right)) + skip_width;
                        //var y = parseInt(5 * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin;

                        skip_width += rect_width;

                        var left = x;
                    }

                    return left  + "px";
              })
              .style("top", function(d, i){

                  if (i < 5 || self.state.fully_opened)
                  {
                      var top = (parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + label_margin_bottom;
                  }
                  else {

                      var percent = Math.round((d[key] / total) * 100);
                      var rect_width = Math.round(horizontal_scale(percent));

                      //var m = i - 5;
                      //var x = (k * (width + bar_margin_right)) + skip_width;

                      var y = parseInt(5 * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin;

                      skip_width += rect_width;

                      var top = y + label_margin_bottom;
                  }

                  return top + "px";

                    //return ((parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + "px");
              })
              .style("opacity", 0)


                /*

            var enter_blocks = bar_block.enter().append("g")
                    .attr("class", "bar_block_" + k)
                    .attr("transform", function(d, i) {

                        if (i < 5 || self.state.fully_opened)
                        {
                            return "translate(" + (k * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + ")";
                        }
                        else {

                            var percent = Math.round((d[key] / total) * 100);
                            var rect_width = Math.round(horizontal_scale(percent));


                            var m = i - 5;

                            var x = (k * (width + bar_margin_right)) + skip_width;
                            var y = parseInt(5 * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin;

                            skip_width += rect_width;

                            return "translate(" + x + ", " + y + ")";
                        }

                        //return "translate(" + (k * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + ")";
                    })
                    .style("opacity", 0)
*/

            enter_blocks
                    .transition()
                    .duration(750)
                    .style("opacity", 1)

            var bar_outer = enter_blocks.append("div")
                    .attr("class", "bar-outer")
                    .style("height", bar_height + "px")
                    .style("width", function(d, i){

                        //return width + "px";


                        if (i < (5 + 1) || self.state.fully_opened) // +1 - first rect in set
                        {
                            return width + "px";
                        }
                        else
                        {

                            var percent = Math.round((d[key] / total) * 100);
                            var rect_width = Math.round(horizontal_scale(percent));
                            return rect_width + "px";

                            //return "20px";
                        }

                    })
                    .style("background-color", function(d) {
                        return "#F5F5F5";
                    })

            bar_outer.append("span")
                    .attr("class", "label bar-outer-text")
                    .style("z-index", 100)
                    .style("height", bar_height + "px")
                    .style("line-height", bar_height + "px")
                    .style("top", 0)
                    .html(function(d, i) {
                        if (i < 5 || self.state.fully_opened)
                        {
                            return d[data_key_label];
                        }
                        else if (i == data.length - 1)
                        {
                            return "Other";
                        }
                        else
                        {
                            return "";
                        }
                    })

/*
            enter_blocks.append("rect")
                    .attr("class", "back_rect")
                    .style("fill", function(d) {
                          return "#F5F5F5";
                    })
                    .attr("x", 0 /*one_bar_width / 2*/ /*)
  /*                  .attr("y", 0 /*height - text_height/*function(d) { return y(d.t) + 3; }*/ /*)
                    /*.attr("height", bar_height)
                    .attr("width", function(d, i) {

                        if (i < (5 + 1) || self.state.fully_opened) // +1 - first rect in set
                        {
                            return width;
                        }
                        else {

                            var percent = Math.round((d[key] / total) * 100);
                            var rect_width = Math.round(horizontal_scale(percent));
                            return rect_width;
                        }

                        //return "translate(" + (k * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + ")";
                    })*/
    /*                .attr("d", function(d, i){

                        var percent = Math.round((d[key] / total) * 100);
                        var bar_width = Math.round(horizontal_scale(percent));


                        if (i < (5 + 1) || self.state.fully_opened) // +1 - first rect in set
                        {
                            var bar_width = width;
                        }
                        else {

                            var percent = Math.round((d[key] / total) * 100);
                            var bar_width = Math.round(horizontal_scale(percent));
                        }


                        if (i < (5 + 1) /*|| self.state.fully_opened*/  /*   )
                        {
                            var round_corner = true;
                        }
                        else {

                            var round_corner = false;
                        }

                        var rect = self.rounded_rect(0, 0, bar_width, bar_height, 2, false, round_corner, false, round_corner);

                        return rect;
                    })
                    /*.attr("rx", 2)
                    .attr("ry", 2)*/


            bar_outer.append("div")
                  .attr("class", "bar-inner")
                  .style("width", function(d, i){

                      if (i < (5) || self.state.fully_opened)
                      {
                          var percent = Math.round((d[key] / total) * 100);
                          return (percent) + "%"; // todo: remove -10 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                      }
                      else
                      {

                          return "100%";
                      }

                  })
                  .style("height", bar_height + "px")
                  .style("line-height", bar_height + "px")
                  .style("background-color", function(d, i){

                      if (i < (5) || self.state.fully_opened)
                      {
                          return colors[k];
                      }
                      else
                      {

                          return "#cccccc";
                      }

                  })
                  .append("span")
                      .attr("class", "bar-inner-text")
                      .style("line-height", bar_height + "px")
                      .html(function(d, i) {

                          if (i < 5 || self.state.fully_opened)
                          {
                              return d[data_key_label];
                          }
                          else if (i == data.length - 1)
                          {
                              return "Other";
                          }
                          else
                          {

                              return "";
                          }

                          //return d.name;
                      })

            enter_blocks.append("div")
                .attr("class", "percent")
                .html(function(d, i) {

                    console.log("========= percent =======", i);
                    console.log(d);

                    var percent = Math.round((d[key] / total) * 100);

                    return (percent) + "%";
                })
                .style("height", bar_height + "px")
                .style("line-height", bar_height + "px")

/*
            enter_blocks.append("path")
                    .attr("class", "bar_rect")
                    .style("fill", function(d, i){

                        if (i < (5) || self.state.fully_opened)
                        {
                            return colors[k];
                        }
                        else
                        {

                            return "#cccccc";
                        }

                    })
                    .attr("d", function(d, i){

                        var percent = Math.round((d[key] / total) * 100);
                        var bar_width = Math.round(horizontal_scale(percent));

                        if (i < (5 + 1) /*|| self.state.fully_opened*/   /*       )
                        {
                            var round_corner = true;
                        }
                        else {

                            var round_corner = false;
                        }

                        var rect = self.rounded_rect(0, 0, bar_width, bar_height, 2, round_corner, false, round_corner, false);

                        return rect;
                    })
                    .attr("x", 0)
                    .attr("y", 0)
                    /*.attr("rx", 2)
                    .attr("ry", 2)*/

/*
                    var gradient = this.chart
                        .append("defs")
                        .append("linearGradient")
                            .attr("id", "half_grad")

                    gradient.append("stop")
                        .attr("offset", "50%")
                        .attr("stop-color", "yellow")

                    gradient.append("stop")
                        .attr("offset", "50%")
                        .attr("stop-color", "red")
                        .attr("stop-opacity", "1")*/
/*
            var gradients = enter_blocks
                .append("defs")
                .append("linearGradient")
                .attr("id", function(d, i){
                    return "text_gradient_" + i;
                })

            */
/*
            var text_labels = enter_blocks.append("g")
                  .attr("class", "label_wrapper")
                  .style("height", bar_height)
                  .style("width", 20)
                  .attr("width", 20)
                  .append("text")
                      .attr("class", "bar_label")
                      .style("font-size", "13px")
                      /*.attr("width", 10)*/
            /*          .text(function(d, i) {

                          /*console.log("==%%%%%%% == full data =======");
                          console.log(data);*/
/*
                          if (i < 5 || self.state.fully_opened)
                          {
                              return d[data_key_label];
                          }
                          else if (i == data.length - 1)
                          {
                              return "Other";
                          }
                          else
                          {

                              return "";
                          }

                      })
                      .attr("x", bar_text_margin_left)
                      .attr("y", function(d) {
                          var y = bar_height / 2 + this.getBBox().height / 3;
                          return y;
                      })


                      var gradients = text_labels/*.append("defs")*/
/*                          .append("linearGradient")
                          .attr("id", function(d, i){
                              console.log("append:", "text_gradient_" + key + "_" + i);
                              return "text_gradient_" + key + "_" + i;
                          })

                      gradients.append("stop")
                          .attr("offset", function(d, i){

                              var text_block_width = this.parentNode.parentNode.parentNode.getBBox().width;

                              if (!text_block_width)
                              {
                                  return "0"; // todo
                              }

                              console.log("====== append gradient =========");
                              console.log(d.device);

                              console.log("text width:", text_block_width);

                              var percent = Math.round((d[key] / total) * 100);
                              var bar_width = Math.round(horizontal_scale(percent));

                              var possible_text_width = bar_width - bar_text_margin_left;

                              var white_part_width = possible_text_width - text_block_width - 2;

                              console.log("white_part_width:", white_part_width);

                              if (white_part_width < 0)
                              {
                                  var white_part_percent = Math.round(possible_text_width / text_block_width * 100);
                              }
                              else
                              {
                                  var white_part_percent = 100;
                              }

                              console.log("white_part_percent:", white_part_percent);

                              return white_part_percent + "%";

                              /*var percent = Math.round((d[key] / total) * 100);
                              var rect_width = Math.round(horizontal_scale(percent));
                              return rect_width;*/
      /*                    })
                          .attr("stop-color", "yellow")

                      gradients.append("stop")
                          .attr("offset", function(d, i){

                              var text_block_width = this.parentNode.parentNode.parentNode.getBBox().width;

                              if (!text_block_width)
                              {
                                  return "0"; // todo
                              }

                              console.log("====== black ========== d.device:", d.device, ", text_block_width:", text_block_width);

                              var percent = Math.round((d[key] / total) * 100);
                              var bar_width = Math.round(horizontal_scale(percent));

                              var possible_text_width = bar_width - bar_text_margin_left;

                              var black_part_width = text_block_width - possible_text_width + 2;

                              //console.log("black_part_width:", black_part_width);

                              if (black_part_width > 0)
                              {
                                  var black_part_percent = Math.round(black_part_width / text_block_width * 100);
                              }
                              else
                              {
                                  var black_part_percent = 0;
                              }

                              console.log("black_part_percent:", black_part_percent);

                              return black_part_percent + "%";

                          })
                          .attr("stop-color", "red")
                          .attr("stop-opacity", "1")

                      console.log("--- enter gradients -----------");
                      console.log(gradients);

                      gradients[0].forEach(function(gradient){

                          var stops = d3.select(gradient).selectAll("stop");

                          var gradient = defs.append("linearGradient")
                              .attr("id", gradient.id)

                          gradient
                              .append("stop")
                              .attr("offset", Math.round(stops[0][0].offset.baseVal * 100) + "%")
                              .attr("stop-color", "white"/*stops[0][0]["stop-color"]*/ /*)
/*
                          gradient
                              .append("stop")
                              .attr("offset", Math.round(stops[0][1].offset.baseVal * 100) + "%")
                              .attr("stop-color", "black"/*stops[0][1]["stop-color"]*/  /*)
              /*                .attr("stop-opacity", 1/*stops[0][1]["stop-color"]*//*)

                      });

                  */    //.attr("mask", "url(#Mask)")
                      //
                      //
                      //

                      /*
                      fill="black" clip-path="url(#myClip)"
                      .style("clip-path", "url(#Mask)")
                      */
/*
            enter_blocks.append("text")
                    .attr("class", "percent")
                    .style("font-size", "13px")
                    .text(function(d, i) {

                        if (i == 5)
                        {
                            var percent = Math.round((other_total / total) * 100);
                            return percent + "%";
                        }
                        /*else if (i > 5 && self.state.fully_opened == false)
                        {
                            return "";
                        }
*//*
                        if (!d[key])
                        {
                            var percent = 0;
                        }
                        else
                        {
                            var percent = Math.round((d[key] / total) * 100);
                        }

                        //console.log("percent:", percent + "%");

                        return percent + "%";
                    })
                    .style("display", function(d, i){

                        if (i > 5 && self.state.fully_opened == false)
                        {
                            return "none";
                        }
                        else
                        {
                            return "block";
                        }

                    })
                    .style("fill", "black")
                    .attr("transform", function(d, i) {

                        var x = Math.round(width - this.getBBox().width) - 20;
                        //var y = Math.round(this.getBBox().height / 2 + bar_height / 3);
                        var y = bar_height / 2 + this.getBBox().height / 3;

                        return "translate(" + x + ", " + y + ")";

                    })
                    /*.attr("x", function(d) {
                        var x = Math.round(width - this.getBBox().width) - 20;
                        return x;
                    })
                    .attr("y", function(d) {
                        var y = Math.round(this.getBBox().height / 2 + bar_height / 3);
                        return y;
                    })*/
/*
                text_labels
                    .style("fill", function(d, i){
                          //return "black";
                          //return "url(#text_gradient_1)";
                          return "url(#text_gradient_" + key + "_" + i + ")";
                    })
*/
            // --- exit ---

            bar_block.exit()
                .transition()
                .duration(750)
                .style("opacity", 0)
                .remove();



        }

    },

    rounded_rect : function (x, y, w, h, r, tl, tr, bl, br) {
        var retval;
        retval  = "M" + (x + r) + "," + y;
        retval += "h" + (w - 2*r);
        if (tr) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r; }
        else { retval += "h" + r; retval += "v" + r; }
        retval += "v" + (h - 2*r);
        if (br) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r; }
        else { retval += "v" + r; retval += "h" + -r; }
        retval += "h" + (2*r - w);
        if (bl) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r; }
        else { retval += "h" + -r; retval += "v" + -r; }
        retval += "v" + (2*r - h);
        if (tl) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r; }
        else { retval += "v" + -r; retval += "h" + r; }
        retval += "z";

        return retval;
    },

    load_more : function(){

        this.setState({
            "fully_opened" : true
        });

    },

    render : function(){

        var wrapper_height

        var wrapper_style = {
            /*width : this.props.width,*/

        }

        if (this.state.fully_opened)
        {
            var height = ((this.props.bar_height + this.props.bar_margin_bottom) * 12);
        }
        else
        {
            var height = ((this.props.bar_height + this.props.bar_margin_bottom) * 9);
        }

        var chart_style = {
            width : this.props.width,
            height : height + "px"
        }

        var load_more_style = {};

        if (this.state.fully_opened)
        {
            load_more_style.display = "none";
        }
        else {
            load_more_style.display = "block";
        }

        return (
            <div className="horizontal_chart_wrapper" style={wrapper_style}>
                <div className="chart_label">{this.props.graph_label}</div>
                <div className="horizontal_chart" style={chart_style} id="horizontal_chart">
                </div>
                <div onClick={this.load_more} style={load_more_style} className="load_more">
                    <span>
                        Load More
                    </span>
                </div>
            </div>
        );
    },

    componentDidMount : function()
    {
        this.draw("#horizontal_chart");
    },

    componentDidUpdate : function()
    {
        this.draw("#horizontal_chart");
    }

});
