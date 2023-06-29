// all alarms will be store in this array in the for of alarm object
/* 
Alarm{
     this.id = id;
     this.timeoutId = timeoutId;
     this.time = time;
     this.title = title;
}
*/
let alarms = [];


// grabing important UI Elemets
const alarmTitleInputBox = document.querySelector('#alarm-title-input-box');
const alarmTimeInputBox = document.querySelector('#alarm-time-input-box');
const alarmSubmitBtn = document.querySelector('#alarm-submit-btn');
const alarmList = document.querySelector('#alarm-list');
const realtimeClock = document.querySelector('#realtime-clock')


// constructor for alarm
class Alarm {
    constructor(id, timeoutId, time, title) {
        this.id = id;
        this.timeoutId = timeoutId;
        this.time = time;
        this.title = title;
    }

    getTime(){
        return (new Date(this.time)).toTimeString().slice(0,8);
    }

}




// function to showing alerts whenever we need
function showAlert(message){
    alert(message);
}



// creates a list of alarm using array alarms and paints on web-page
function renderList(){

    alarmList.innerHTML = '';

    for(let i = 0; i<alarms.length; i++){
        let alarm = alarms[i];

        const li = document.createElement("li");
        li.innerHTML = `
            <span class="list-time">${alarm.getTime()}</span>
            <span class="list-title">${alarm.title}</span>
            <img src="delete-button-png-28580 (1)" alt="delete" class="list-img" data-id="${alarm.id}">
        `;
        alarmList.append(li);
    }

}


// function to validate time if given time is correct it returns object of date else return false and alert error message
function validateTime(textTime){
    let hours = Number(textTime.slice(0, 2));
    let minuts = Number(textTime.slice(3, 5));
    let seconds = Number(textTime.slice(6, 8));
    let period = textTime.slice(9, 11);

    if(hours == NaN || hours < 0 || hours > 12 || minuts == NaN || minuts < 0 || minuts > 59 || seconds == NaN || seconds < 0 || seconds > 59 || !(period == 'am' || period == 'pm')){
        showAlert("time formate is wrong / am or pm should be in small case");
        return false;
    }

    if(period == 'pm'){
        hours += 12;
    }

    let alarmDate = new Date();
    alarmDate.setHours(hours, minuts, seconds, 0);

    if(alarmDate.getTime() - (new Date()) < 0){
        alarmDate.setDate(alarmDate.getDate() + 1);
    }
        return alarmDate;
//     return (new Date()).setHours(hours, minuts, seconds, 0);
}




// if time is valid and alarm gets created then we are adding alarm to the alarms array
function addAlarm(){

    // using current time as ID to alarm
    let id = (new Date()).getTime();

    let title = alarmTitleInputBox.value;
    let time = validateTime(alarmTimeInputBox.value).getTime();
    

    //resetting Time input fiels
    alarmTimeInputBox.value = '';
    alarmTitleInputBox.value = '';

    // exit adding alarm if validateTime returns false
    if(!time){
        return;
    }

    let timeoutId = createAlarm(time - (new Date()).getTime(), title, id);


    //creating alarm object and adding it to the array
    let alarm = new Alarm(id, timeoutId, time, title);
    alarms.unshift(alarm);
    renderList();
}




// sets timeout function as an alarm 
function createAlarm(timeInMillisecond, title, id){

    return setTimeout( function() {
        showAlert(title);
        deleteAlarm(id);
    }, timeInMillisecond);

    
}


//removes the alarm from array and clear its timout 
function deleteAlarm(id){
    const newAlarms = alarms.filter(function(alarm){
        if(alarm.id == id){
            clearTimeout(alarm.timeoutId);
            return false;
        }

        return true;
    });

    alarms = newAlarms;
    renderList();
}


//return current time in am pm notation
function getCurrentTime(){
    return (new Date()).toTimeString().slice(0,8);
}


// maintaining realtime clock using time interval function
function setRealTimeClock(){
    let textTime = getCurrentTime();
    let hours = Number(textTime.slice(0, 2));

    if(hours > 12){
        hours -= 12;
        textTime = hours + textTime.slice(2, textTime.length) + ' pm';
    }else{
        textTime = textTime + ' am';
    }
    realtimeClock.innerHTML = '';
    let timeSpan = document.createElement("span");
    timeSpan.innerHTML = textTime;

    realtimeClock.append(timeSpan);

}

setRealTimeClock();
let IntervalId = setInterval(setRealTimeClock, 1000);



// event listner to create alarm activates by alarm submit button
alarmSubmitBtn.addEventListener('click', addAlarm);

// delete alarm item when we click on delete icon button
alarmList.addEventListener('click', (e) => {
    let target = e.target;
    deleteAlarm(target.dataset.id);
});