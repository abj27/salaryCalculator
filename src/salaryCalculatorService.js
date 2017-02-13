/*
*  Payment Calculator
*  Calculates the amount to pay to an employee
*  A fixed salary employee gains the same salary every week no matter the worked hours
*  A fixed salary employee with overtime gains the same salary every week but gets paid 50% more each hour worked after the first 44.
*  A developer gets the same salary every week and if he works more than 8 hours in a day, he gets the equivalent of a picapollo on extra money.
*  A contractor gets paid the amount of hours worked every week.
*/
var employeeTypes = {
    fixedSalary : "fixedSalary",
    fixedSalaryWithOvertime: "fixedSalaryWithOvertime",
    developer: "developer",
    contractor: "contractor"
};

var Employee = function(type, name, pricePerHour){
   this.id = Math.random();
   this.type = type;
   this.name = name;
   this.pricePerHour = pricePerHour;
};
var employees = [];

var DailyWorkSheet= function(employeeId, date, hoursWorked ){
   this.employeeId = employeeId;
   this.date = date;
   this.hoursWorked = hoursWorked;
}
var PicaPolloAPi= function(){
    this.getPicapolloPrice = function(date){
       return 140;
    }
}
var dailyWorkSheets = [];

var paymentCalculator= {
    getPayment: function(employee, firstDayOfWeek){
       if(employee.type === employeeTypes.fixedSalary) {
           return employee.pricePerHour * 44;
       }
       else if(employee.type === employeeTypes.fixedSalaryWithOvertime){
           let hoursWorkedInAWeek = dailyWorkSheets
             .find(x => x.employeeId == employee.id && x.date >= firstDayOfWeek && x.date <= firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6))
             .map(x => x.hoursWorked)
             .reduce((accumulator, current) =>{ return accumulator + current});
           if(hoursWorkedInAWeek > 44) {
              return employee.pricePerHour * 44 + (hoursWorkedInAWeek - 44) * 1.5
           }
           else{
               return employee.pricePerHour * 44;
           }

       }
       else if(employee.type === employeeTypes.contractor){
           let hoursWorkedInAWeek = dailyWorkSheets
             .find(x => x.employeeId == employee.id && x.date >= firstDayOfWeek && x.date <= firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6))
             .map(x => x.hoursWorked)
             .reduce((accumulator, current) =>{ return accumulator + current});
          return hoursWorkedInAWeek * employee.pricePerHour;
       }
       else if(employee.type === employeeTypes.developer){
           let extraPay= dailyWorkSheets
             .find(x => x.employeeId == employee.id && x.date >= firstDayOfWeek && x.date <= firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6))
             .map(x => {return{hoursWorked: x.hoursWorked, date: x.date}})
             .reduce((accumulator, current) =>{ if(current.hoursWorked > 8){
                 return accumulator + PicaPolloAPi().getPicapolloPrice(current.date);
             }}, 0);
          return 44 * employee.pricePerHour + extraPay;
       }
    }
};
module.exports ={
    employees : employees,
    Employee : Employee,
    DailyWorkSheet: DailyWorkSheet,
    dailyWorkSheets: dailyWorkSheets,
    dailyWorkSheets: dailyWorkSheets,
    paymentCalculator: paymentCalculator,
    employeeTypes: employeeTypes
}
