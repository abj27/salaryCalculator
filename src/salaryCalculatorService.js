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
    regular: "regular",
    developer: "developer",
    contractor: "contractor"
};

var Employee = function(type, name, hourlyRate){
   this.id = Math.random();
   this.type = type;
   this.name = name;
   this.hourlyRate = hourlyRate;
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


var WorkedHoursSevice = function(dailyWorkSheets){
    this.workingHoursInADay = 8;
    let isInsideWeek = function(firstDayOfWeek, date){
        return date >= firstDayOfWeek && date <= firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    }
    this.getOverworkSheet = (firstDayOfWeek, employeeId) =>{
         //Calling public function inside another one of the same class
         return this.getWorkSheet(firstDayOfWeek, employeeId)
                    .map(x => x >= this.workingHoursInADay? x - this.workingHoursInADay : 0)
    };
    this.getWorkSheet = (firstDayOfWeek, employeeId) =>{
        dailyWorkSheets
             .find(x => x.employeeId == employeeId && this.isInsideWeek(firstDayOfWeek, x.date))
    };
};
var workedHoursService = new WorkedHoursSevice(dailyWorkSheets);


var BaseSalaryCalculator = function(){
    this.workingHoursInWeek= 44;
    this.calculate = (employeeType, hourlyRate) =>{
       switch (employeeType) {
           case employeeType.fixedSalary:
           case employeeType.regular:
           case employeeType.developer:
               return hourlyRate * this.workingHoursInWeek
           case employeeType.contractor:
               return 0;
       }
    }
};
var baseSalaryCalculator = new BaseSalaryCalculator();

var OvertimeCalculator = function(workedHoursService, picapolloAPi){

    this.overworkRate = 1.5;
    this.calculate = (employeeId,employeeType, hourlyRate, firstDayOfWeek) =>{
       switch (employeeType) {
           case employeeType.fixedSalary:
               return 0
           case employeeType.regular:
              var overworkedHours =workedHoursService
              .getOverworkSheet(firstDayOfWeek, employeeId)
              .reduce((accumulator, current) => accumulator + current);
            return overworkedHours * hourlyRate * this.overworkRate;
           case employeeType.developer:
               var overworkedDays= workedHoursService
               .getOverworkSheet(firstDayOfWeek, employeeId).filter(x => x >0);
               return overworkedDays *picapolloAPi.getPicapolloPrice();
           case employeeType.contractor:
               var workedHours = workedHoursService
               .getWorkSheet(firstDayOfWeek, employeeId)
               .reduce((accumulator, current) => accumulator + current);
               return workedHours * hourlyRate;
       }
    }
};
var overtimeCalculator = new OvertimeCalculator(workedHoursService,new PicaPolloAPi());

var dailyWorkSheets = [];

var PaymentCalculator= function(baseSalaryCalculator, overtimeCalculator){
   this. getPayment = function(employee, firstDayOfWeek){
       var baseSalary =baseSalaryCalculator.calculate(employee.type, employee.hourlyRate);
       var overtime = overtimeCalculator.calculate(employee.id, employee.type, employee.hourlyRate, firstDayOfWeek);
       return baseSalary + overtime;
    }
};
var paymentCalculator = new PaymentCalculator(baseSalaryCalculator, overtimeCalculator);

module.exports ={
    Employee : Employee,
    employees : employees,
    employeeTypes: employeeTypes,
    DailyWorkSheet: DailyWorkSheet,
    dailyWorkSheets: dailyWorkSheets,
    PaymentCalculator: PaymentCalculator,
    paymentCalculator: paymentCalculator,
    BaseSalaryCalculator: BaseSalaryCalculator,
    baseSalaryCalculator: baseSalaryCalculator,
    OvertimeCalculator: OvertimeCalculator,
    overtimeCalculator: overtimeCalculator,
    WorkedHoursService: WorkedHoursSevice,
    workedHoursService: workedHoursService
}
