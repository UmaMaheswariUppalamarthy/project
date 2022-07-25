console.clear();
function Calculator() {
  //Conversion ratios
  this.CONVERT_METRE_RATIO = {
        'mile' : 1609.344,
        'kilometre' : 1000,
        'kilo': 1000,
        'metre': 1,
        'yard' : 0.9144,
        'feet' : 0.3048
   }

   this.CONVERT_SECOND_RATIO = {
      'hour' : 3600,
      'minute': 60,
      'second': 1
    }

    this.CONVERT_MPS_RATIO = {
      'mph' : 0.44704,
      'kmph': 0.2777778,
      'mps': 1
    }
    
    this.UNIT_STRING = {
        'mile' : {
            'single': 'mile',
            'multi': 'miles',
            'si' : 'mi', 
        },
       'kilo' : {
            'single': 'kilometre',
            'multi': 'kilometres',
            'si' : 'km', 
        },
        'metre' : {
            'single': 'metre',
            'multi': 'metres',
            'si' : 'm', 
        },
        'mps' : {
            'single': 'metre per second',
            'multi': 'metres per second',
            'si' : 'm/s', 
        },
        'mph' : {
            'single': 'mile per hour',
            'multi': 'miles per hour',
            'si' : 'mi/h', 
        },
       'kmph' : {
            'single': 'kilometre per hour',
            'multi': 'kilometres per hour',
            'si' : 'km/h', 
        },
      
    };
  
  //Speeds
   this.speed_ms = null;
  
   //Distances
   this.distance_m = null;
   
   //Times
   this.time_s = null;
  
   //Pace
   this.pace_s_per_m = null;
   
   //Output preference
   this.output_speed = 'mps';
   this.output_distance = 'metre';
   this.output_time = 'second';
   this.output_pace = 'metre';
   this.split_unit = 'kilometre'; //Ideally metre but in reality...
}


Calculator.prototype = {};

//CONVERSION FUNCTIONS

Calculator.prototype.convert_speedX_to_speedY = function(value, unit_in, unit_out) {
  var ratio_in = this.CONVERT_MPS_RATIO[unit_in];
  var ratio_out = 1 / this.CONVERT_MPS_RATIO[unit_out];
  return value_as_m = (value * ratio_in) * ratio_out;
}


Calculator.prototype.convert_distanceX_to_distanceY = function(value, unit_in, unit_out) {
  var ratio_in = this.CONVERT_METRE_RATIO[unit_in];
  var ratio_out = 1 / this.CONVERT_METRE_RATIO[unit_out];
  return value_as_m = (value * ratio_in) * ratio_out;
}

Calculator.prototype.secondsFromSMH = function(sec, min, hour) {
  var seconds = sec;
        if (min) {
            seconds += min * this.CONVERT_SECOND_RATIO.minute;
        }
  
        if (hour) {
            seconds += hour * this.CONVERT_SECOND_RATIO.hour;
        }
  return seconds;
}

//FORMATTING FUNCTIONS
//These always take a value and don't rely on on interal values
Calculator.prototype.formatTime = function(secs) {
  secs = Math.round(secs); //round because decimal seconds is way to accurate for this!!
	var hour = Math.floor(secs / 3600).toString();
	var min = Math.floor((secs % 3600) / 60).toString();
	var sec = (secs % 60).toString();
	if (min.length == 1) {
		min = '0'+min;
	}
	if (sec.length == 1) {
		sec = '0'+sec;
	}
	return hour+':'+min+':'+sec;
}

Calculator.prototype.formatDecimals = function(value) {
  return parseFloat(value).toFixed(2);
}

//INPUT VALUES
Calculator.prototype.setSpeed = function( value, unit ) {
    //Convert units into mps
    this.speed_ms = this.convert_speedX_to_speedY(value, unit, 'mps');
}

Calculator.prototype.setDistance = function( value, unit ) {
    this.distance_m = this.convert_distanceX_to_distanceY(value, unit, 'metre');
}

Calculator.prototype.setTime = function( sec, min, hour ) {
    this.time_s = this.secondsFromSMH(sec, min, hour);
}

Calculator.prototype.setPaceUpdateSpeed = function( unit, sec, min, hour ) {
   var pace_time_in_s = this.secondsFromSMH(sec, min, hour);
   var pace_distance_in_m = this.convert_distanceX_to_distanceY(1, unit, 'metre');
   var pace_per_m_in_s = pace_time_in_s / pace_distance_in_m;
   this.pace_s_per_m = pace_per_m_in_s;
   this.speed_ms = pace_distance_in_m / pace_time_in_s;
}

//Calculate values

Calculator.prototype.updateSpeed = function() {
  //Speed = distance / time
  this.speed_ms = this.distance_m / this.time_s;
}

Calculator.prototype.updateDistance = function() {
  //Distace = speed * time
  this.distance_m = this.speed_ms * this.time_s;
}

Calculator.prototype.updateTime = function() {
  //Time = distance / speed
  this.time_s = this.distance_m / this.speed_ms;
}

Calculator.prototype.updatePace = function() {
  //Pace is the distance unit (metre) as a function of speed
  this.pace_s_per_m = 1 / this.speed_ms;
}



//Output collections of values for use

Calculator.prototype.returnPaceValues = function() {
  var pace_array = [];
  pace_array['metre_s'] = this.formatDecimals(this.pace_s_per_m);
  pace_array['kilometre_s'] = this.formatDecimals(this.pace_s_per_m * this.CONVERT_METRE_RATIO.kilometre);
  pace_array['mile_s'] = this.formatDecimals(this.pace_s_per_m * this.CONVERT_METRE_RATIO.mile);
  pace_array['kilometre_hms'] = this.formatTime(this.pace_s_per_m * this.CONVERT_METRE_RATIO.kilometre);
  pace_array['mile_hms'] = this.formatTime(this.pace_s_per_m * this.CONVERT_METRE_RATIO.mile);
  
  return pace_array;
}



Calculator.prototype.returnSpeedValues = function() {
  var speed_array = [];
  
  speed_array['mps'] = this.formatDecimals(this.speed_ms);
  speed_array['mph'] = this.formatDecimals(this.speed_ms / this.CONVERT_MPS_RATIO.mph);
  speed_array['kmph'] = this.formatDecimals(this.speed_ms / this.CONVERT_MPS_RATIO.kmph);
  
  return speed_array;
}


Calculator.prototype.returnTimeValues = function() {
  var time_array = [];
  
  time_array['sec'] = this.formatDecimals(this.time_s);
  time_array['hms'] = this.formatTime(this.time_s);
  
  return time_array;
}

Calculator.prototype.returnDistanceValues = function() {
  var distance_array = [];
  
  distance_array['metre'] = this.formatDecimals(this.distance_m);
  distance_array['kilometre'] = this.formatDecimals(this.distance_m / this.CONVERT_METRE_RATIO.kilometre);
   distance_array['mile'] = this.formatDecimals(this.distance_m / this.CONVERT_METRE_RATIO.mile);
  return distance_array;
}


Calculator.prototype.returnSplit = function() {
  var split_times = [];
  //Number of splits is the total distance / size of 1 split unit
  var split_unit_in_m = this.convert_distanceX_to_distanceY(1, this.split_unit, 'metre');
  var number_of_splits = Math.floor(this.distance_m / split_unit_in_m);
  var split_length_s = this.time_s / number_of_splits;
  var running_time = 0;
  for (var i = 1; i <= number_of_splits; i++) {
    var split = [];
    running_time += split_length_s;
    split['distance_marker'] = i; //of prefered units
    split['time_s'] = running_time;
    split['time_hms'] = this.formatTime(running_time);
    //addto split arrays
    split_times[i] = split;
  }
  return split_times;
}






//Quick returns

Calculator.prototype.returnTimeHMS = function() {
  //Human formated Hour Min Second Time
  return this.formatTime(this.time_s);
}


Calculator.prototype.returnUnitString = function(unit, si, multi) {
  if (si) {
    return this.UNIT_STRING[unit]['si'];
  }
  return this.UNIT_STRING[unit]['multi'];
}










//Init the calculator
var calc = new Calculator();

//test the values are not set
console.log( calc.speed_ms, calc.distance_m , calc.time_s);


//Set the values
calc.setSpeed(20, 'mph');
calc.setDistance(20, 'kilometre');
calc.setTime(20, 2, 1);


//test the values are set
console.log( calc.speed_ms, calc.distance_m , calc.time_s);



//update DT and recalculate Speed
calc.setDistance(100, 'kilometre');
calc.setTime(0, 0, 1);
calc.updateSpeed();
//Test values are updated
console.log( "Speed: " + calc.speed_ms); //100 km/h = 27.777777777778 m/s


//update ST and recalculate Distance
calc.setSpeed(100, 'mph');
calc.setTime(0, 0, 1);
calc.updateDistance();
//Test values are updated
console.log( "Distance: " + calc.distance_m); //100 mph for 1 hour = 100 miles = 160934.4m


//update DS and recalculate Time
calc.setSpeed(100, 'mph');
calc.setDistance(100, 'mile');
calc.updateTime();
//Test values are updated
console.log( "Time: " + calc.time_s); //100 mph over 100 miles = 1 hour = 3600s

calc.updatePace();
console.log( "Pace: " + calc.pace_s_per_m);
console.log( "Speed: " + calc.speed_ms + 'm/s'); 


//Output full values
var pacesArray = calc.returnPaceValues();
for(var key in pacesArray)
{
  console.log("pace key " + key + " has value " + pacesArray[key]);
}


var speedsArray = calc.returnSpeedValues();
for(var key in speedsArray)
{
  console.log("speed key " + key + " has value " + speedsArray[key]);
}


var timeArray = calc.returnTimeValues();
for(var key in timeArray)
{
  console.log("time key " + key + " has value " + timeArray[key]);
}


var distanceArray = calc.returnDistanceValues();
for(var key in distanceArray)
{
  console.log("distance key " + key + " has value " + distanceArray[key]);
}


console.log( calc.returnUnitString('mile', true) );


calc.returnSplit();



var new_calc = new Calculator();
new_calc.setPaceUpdateSpeed('mile', 5, 0);

new_calc.setDistance(26, 'mile');

new_calc.updateTime();

var timeArray = new_calc.returnTimeValues();
var time_hms_to_cover_distance = timeArray['hms'];

console.log(new_calc.pace_s_per_m, new_calc.speed_ms, timeArray);
