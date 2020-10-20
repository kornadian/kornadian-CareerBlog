
//const config = require("config.json");

//const apiHost = "10.1.1.100";
//const apiPort = "8001";


function testclick()
{
    console.log("Clicked Javascript Start");
    var _user_id = "00000";
    var _device_id = "0000000001";
    var _sensor_type= "00001";
    
    var jsonTemp = {
        "user_id" : _user_id,
        "device_id" : _device_id,
        "sensor_type" : _sensor_type
    };
    console.log("GET body data = " + jsonTemp.device_id);

    var req_option = {
        method: 'get',
        url: 'http://' + apiHost + ':'+apiPort + '/get-sensor-data',
        params: jsonTemp,
        // `headers` are custom headers to be sent
        headers: {'X-Requested-With': 'XMLHttpRequest'}
    };   

    axios(req_option)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });        
}


function generateTraffic()
{
    //sid,user_id,device_id,sensor_type,c_time,s_time,sensor_value from sensor_input
    //document.forms["traffic_form"].
    console.log("===============Clicked Button Process Start===============");
    
    var _user_id = document.getElementById("user_id").value;
    var _device_id = document.getElementById("device_id").value;
    var _sensor_type= document.getElementById("sensor_type").value;
    var _random_tf = document.getElementById("randomCheck").checked;

    var _sensor_value= document.getElementById("sensor_value").value;
    var _secTerm= document.getElementById("secTerm").value;
    var _numReq= document.getElementById("numReq").value;

    if(_user_id == "") _user_id = "0000000000";
    if(_device_id == "") _device_id = "0000000000";
    if(_sensor_type == "") _sensor_type = "00001";
    if(_sensor_value == "") _sensor_value = 50;
    //if(_secTerm == "" | _secTerm <= 500) _secTerm = 500;
    _secTerm = 500;
    if(_numReq == ""){_numReq = 10;}else if(_numReq > 100){_numReq = 100;}
    //_numReq = 1;

    var _c_time = new Date();

    var jsonTemp = {
        "user_id" : _user_id,
        "device_id" : _device_id,
        "sensor_type" : _sensor_type,
        "sensor_value" : _sensor_value,
        //"c_time" : _c_time,
    };
    var req_option = {
        method: 'post',
        url: 'http://' + apiHost + ':'+apiPort + '/set-sensor-data',
        data: jsonTemp,
        headers: {'X-Requested-With': 'XMLHttpRequest'}
    };


    

    var i = 0;
    var execReq = setInterval(() => {
        if( i >= _numReq){
            i = 0;
            clearInterval(execReq);
        } else{
            i++;
            if(_random_tf == true) _sensor_value = Math.floor(Math.random() * 256);
            _c_time = new Date();
            //console.log(i + " th looping value = "+ _sensor_value + "   @ " + _c_time);
            req_option.data.sensor_value = _sensor_value;
            req_option.data.c_time = _c_time;
            //console.log(req_option);

            axios(req_option)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });

            /*
                .then(function (response) {
                console.log(response);
                })
                .catch(function (error) {
                console.log(error);
                });
            */
        }
    }, _secTerm);
    
        
    

    


   
}

//init function
(function() {

    console.log("Sensor Javascript Init Function Start");    

})();

