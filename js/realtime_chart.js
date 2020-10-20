//const config = require("./config.json");
//const apiHost = config.api.server;
//const apiPort = config.api.server;

//const apiHost = "10.1.1.100";
//const apiPort = "8001";

var refresh_btn = document.getElementById("autoCheck");
var update_graph, cur_time;





  
var _term = 1000;
var chart_xaxis_length = 60;



const chart_config = {
    title: 'Real time sensing Data Graph',
    showlegend: false, 
    xaxis: {
        title: 'Time'
    },
    yaxis: {
        title: 'Sensing Value',
        range: [0, 255]
    }
}



function refreshChange()
{
    //console.log("Switch changed : " + refresh_btn.checked);
    var start_time = cur_time;

    if(refresh_btn.checked == false)
    {
        clearInterval(update_graph);
    }else {

        update_graph = setInterval(function() {
            // code for chart update logic here
            
            var _user_id = '0000000000';
            var _device_id = '0000000000';
            var _sensor_type = '00001';
            ///////////////////////////////////////


            ///////////////////////////////////

            var jsonTemp = {
                "user_id" : _user_id,
                "device_id" : _device_id,
                "sensor_type" : _sensor_type
            };
        
            var req_option = {
                method: 'get',
                url: 'http://' + apiHost + ':'+apiPort + '/get-sensor-data',
                params: jsonTemp,
                // `headers` are custom headers to be sent
                headers: {'X-Requested-With': 'XMLHttpRequest'}
            };   
        

            var update;
            

            axios(req_option)
                .then(function (resp) {

                    resp_Data = resp.data.response.resultData;
                    cur_time = resp.data.server_time;
                    
                    if(resp_Data.length == 0 | resp_Data.length === undefined){
                        console.log("[Chart Update] Current Data is Empty");
                        update = {
                            x: [[cur_time]],
                            y: [[0]]
                        }
                        Plotly.extendTraces('chart', update, [0]);
                    }else{
                        var x_temp, y_temp;
                        console.log("[Chart Update] Will be Updated = ");
                        console.log(resp_Data);

                        for(var i = 0; i < resp_Data.length; i++)
                        {
                            update = {
                                x: [[resp_Data[i].s_time]],
                                y: [[resp_Data[i].sensor_value]]
                            }
                            Plotly.extendTraces('chart', update, [0]);
                        }

                        
                    }          
                    
                                      

                    //server time format = "2020-10-20T06:11:59.942Z"    
                    

                                    
                    /*
                    var cur_sec = text_to_sec(cur_time);
                    var start_sec = text_to_sec(start_time);
                    //console.log("Current Time = "+cur_time+" | "+temp);
                    //console.log("Diff Time    = "+sec_to_text((temp - chart_xaxis_length), cur_time));
                    //console.log("             " + chart_xaxis_length);
                    console.log("MAX="+chart_xaxis_length+"   Time diff = "+(cur_sec - start_sec));
                    console.log("cur - length = " + (cur_sec-chart_xaxis_length) +  "    |    " + sec_to_text(cur_sec-chart_xaxis_length, cur_time));

                    if((cur_sec - start_sec) >= chart_xaxis_length) {
                        
                        // code for chart 'sliding' here
                        

                        Plotly.relayout('chart',{
                            xaxis: {
                                      range: [sec_to_text(cur_sec-chart_xaxis_length, cur_time), cur_time]
                            }
                       });
                    }
                    */

                })
                .catch(function (err) {
                    console.log(err);
                }); 

                    
            
            
           
            
            
            
        }, _term);
    }
}

function sec_to_text(timeint, _cur_time)
{
    //server time format = "2020-10-20T06:11:59.942Z"    
    var _year =  _cur_time.split("T")[0].split("-")[0];
    var _month = _cur_time.split("T")[0].split("-")[1];
    var _day =   _cur_time.split("T")[0].split("-")[2];
    var _hour = Math.round(timeint / 3600);
    //var _hour, _hour_temp;
    //if(Math.round(timeint / 3600) < 10)
    //{ _hour_temp = "0"+_hour.toString(); }else _hour_temp = _hour;
    var _min = Math.round((timeint%3600)/60);
    //var _min, _min_temp;
    //if(Math.round((timeint%3600)/60) < 10)
    //{ _min_temp = "0"+_min.toString(); }else _min_temp = _min;
    var _sec =   timeint%60;
    var _rest =  _cur_time.split("T")[1].split(".")[1];

    return (_year+"-"+_month+"-"+_day+"T"+_hour+":"+_min+":"+_sec+"."+_rest);    
}

function text_to_sec(timetext)
{
    //var _year =     parseInt(timetext.split("T")[0].split("-")[0])*60*60*24;
    //var _month =    parseInt(timetext.split("T")[0].split("-")[1])*60*60*24;
    //var _day =      parseInt(timetext.split("T")[0].split("-")[2])*60*60*24;
    var _hour =     parseInt(timetext.split("T")[1].split(".")[0].split(":")[0])*60*60;
    var _min =      parseInt(timetext.split("T")[1].split(".")[0].split(":")[1])*60;
    var _sec =      parseInt(timetext.split("T")[1].split(".")[0].split(":")[2]);
    var _rest =     parseInt(timetext.split("T")[1].split(".")[1]);
    
    return (_sec+_min+_hour);
}


//init function
(function() {
    var req_option = {
        method: 'get',
        url: 'http://' + apiHost + ':'+apiPort + '/get-sensor-data',
        //params: jsonTemp,
        // `headers` are custom headers to be sent
        headers: {'X-Requested-With': 'XMLHttpRequest'}
    };
    axios(req_option)
        .then(function (resp) {
            console.log("init success");
            console.log(resp);       
            cur_time = resp.data.server_time;
            var trace1 = {
                x: [cur_time],
                y: [50],
                type: 'line'
              };
        
            Plotly.plot('chart',[trace1
                //{
                //    y:[getData()],
                //    type:'line'
                //}
            ], chart_config, {staticPlot: true});

        })
        .catch(function (err) {
            console.log(err);
        }); 

    


    //console.log("realtime chart script test" + apiHost + "   @"+cur_time);    

})();
