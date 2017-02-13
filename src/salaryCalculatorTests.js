const td = require("testdouble");
const faker = require("faker");
import {expect} from "chai";
const PaymentCalculator = require("./salaryCalculatorService").PaymentCalculator;
const Employee= require("./salaryCalculatorService").Employee;
const employeeTypes= require("./salaryCalculatorService").employeeTypes;
describe("Payment calculator get payment", function () {
  //System Under Test
  let sut;
  let employee;
  let paymentCalculator;
  let overtimeCalculator;
  let baseSalaryCalculator;
//   let pricePerHour;
//   let workingHoursInWeek = 44;
//   let overTimeFactor = 1.5;
  let firstDayOfWeek =new Date();
  beforeEach(function () {
    //Arrange
    employee = new Employee(employeeTypes.fixedSalary, faker.lorem.words, 5);
    baseSalaryCalculator = {
        calculate: td.func()
    };
    overtimeCalculator = {
        calculate: td.func()
    }
    paymentCalculator = new PaymentCalculator(baseSalaryCalculator, overtimeCalculator);
    sut = paymentCalculator.getPayment.bind(paymentCalculator);
  });
  it("should return the sum of the base salary and the overtime", function(){
      td.when(overtimeCalculator.calculate(employee)).thenReturn(5);
      td.when(baseSalaryCalculator.calculate(employee)).thenReturn(4);
      expect(sut(employee, firstDayOfWeek)).to.equal(9);
  });
/*
  it("should return a full week salary for a fixed salary employee", function () {
    //Act
    employee = new Employee(employeeTypes.fixedSalary, faker.lorem.word(), pricePerHour );
    //Assert
    expect(sut(employee, firstDayOfWeek)).to.equal(workingHoursInWeek * pricePerHour);
  });

  it("should return a full week salary for a regular employee that didn't work extra hours ", function () {
    employee = new Employee(employeeTypes.regular, faker.lorem.word(), pricePerHour );
    // O.O I have to set up ALL THE HOURS IN THE WEEK -_- maldito alberto y su maldito código aqueroso...
    setWeekHours(firstDayOfWeek,[8,8,8,8,8,4])
    expect(sut(employee, firstDayOfWeek)).to.equal(workingHoursInWeek * pricePerHour);
  });

  it("should return a full week salary plus overtime for a regular employee that worked extra hours ", function () {
    employee = new Employee(employeeTypes.regular, faker.lorem.word(), pricePerHour );
    setWeekHours(firstDayOfWeek,[8,8,9,9,8,4]);
    expect(sut(employee, firstDayOfWeek)).to.equal(workingHoursInWeek * pricePerHour + 2 *overTimeFactor * workingHoursInWeek);
  });

  it("should return a the amount of worked hours times the price per hour", function () {
    employee = new Employee(employeeTypes.regular, faker.lorem.word(), pricePerHour );
    var weekHours = [8,8,9,9,8,4];
    setWeekHours(firstDayOfWeek,weekHours);
    var workedHours = weekHours.aggregate(function(accumulator, current){
        return accumulator + current;
    });
    expect(sut(employee, firstDayOfWeek)).to.equal(workedHours * pricePerHour);
  });

  it("should return a the amount of worked hours times the price per hour", function () {
    employee = new Employee(employeeTypes.regular, faker.lorem.word(), pricePerHour );
    var weekHours = [8,8,9,9,8,4];
    setWeekHours(firstDayOfWeek,weekHours);
    var workedHours = weekHours.aggregate(function(accumulator, current){
        return accumulator + current;
    });
    expect(sut(employee, firstDayOfWeek)).to.equal(workedHours * pricePerHour);
  });
*/
});


const WorkedHoursService= require("./salaryCalculatorService").WorkedHoursService;
const DailyWorkSheet= require("./salaryCalculatorService").DailyWorkSheet;
describe("Worked Hours service, getting the work sheet", function () {
  let sut;
  let dailyWorkSheets =[];
  let employee = new Employee(employeeTypes.fixedSalary, faker.lorem.words, 5);
  let initialDate = new Date();
  let expectedHours = [8,7,8,8,8,2];
  beforeEach(function () {
    context ={
        workedHoursInADay : 8,
    };
    var workedHoursService = new WorkedHoursService(dailyWorkSheets);
    sut = workedHoursService.getWorkSheet.bind(workedHoursService);
  });


  it("Should return a list with the hours worked on that week", function(){
     setWeekHours(initialDate, expectedHours)
     var results = sut(initialDate, employee.id);
     expect(results.length).to.equal(expectedHours.length);
     for(var i =0; i< results.length ; i++){
         expect(results[i]).to.equal(expectedHours[i])
     }
  });

  var setWeekHours = function(initialDate, hours){
    var date = new Date(initialDate.getTime())
    dailyWorkSheets.push(new DailyWorkSheet(employee.id, date, hours[0]));
    for(var i= 1 ; i< hours.length; i++){
      dailyWorkSheets.push(new DailyWorkSheet(employee.id, date.setDate(date.getDay() +1), hours[i] ));
    }
  };

});

describe("Worked Hours service, getting the overwork sheet", function () {
  let sut;
  let dailyWorkSheets =[];
  let employee = new Employee(employeeTypes.fixedSalary, faker.lorem.words, 5);
  let initialDate = new Date();
  let expectedWorkedHours= [8,7,9,8,10,2];
  let expectedOverworkedHours= [0,0,1,0,2,0];
  let context;
  beforeEach(function () {
    // the context trick in javascript :D
    context ={
        workedHoursInADay : 8,
        getWorkSheet:td.func()
    };
    var workedHoursService = new WorkedHoursService(dailyWorkSheets);
    sut = workedHoursService.getOverworkSheet.bind(context);
  });
  it("Should return a list with the over worked hours per day on that week", function(){
     td.when(context.getWorkSheet(initialDate, employee.id)).thenReturn(expectedWorkedHours);
     var results = sut(initialDate, employee.id);
     expect(results.length).to.equal(expectedOverworkedHours.length);
     for(var i =0; i< results.length ; i++){
         expect(results[i]).to.equal(expectedOverworkedHours[i])
     }
  });
});


describe("Base salary calculator, calculate", function () {
  let sut;
  let dailyWorkSheets =[];

  let initialDate = new Date();
  let workingHoursInWeek = 44;
  let context;
  let pricePerHour =8;
  beforeEach(function () {
    // the context trick in javascript :D
    context ={
        workedHoursInADay : 8,
        getWorkSheet:td.func()
    };
    var workedHoursService = new WorkedHoursService(dailyWorkSheets);
    sut = workedHoursService.getOverworkSheet.bind(context);
  });
  var getEmployee = function(type){
    return new Employee(type, faker.lorem.word(),pricePerHour);
  }
  it("should return a full week salary for a fixed salary employee", function () {
    let employee = getEmployee(employeeTypes.fixedSalary);
    expect(sut(employee, initialDate)).to.equal(workingHoursInWeek * pricePerHour);
  });

  it("should return a full week salary for a regular employee", function () {
    let employee = getEmployee(employeeTypes.regular);
    expect(sut(employee, initialDate)).to.equal(workingHoursInWeek * pricePerHour);
  });

  it("should return a full week salary for a regular developer", function () {
    let employee = getEmployee(employeeTypes.developer);
    expect(sut(employee, initialDate)).to.equal(workingHoursInWeek * pricePerHour);
  });

  it("should return 0 for a contractor", function () {
    let employee = getEmployee(employeeTypes.contractor);
    expect(sut(employee, initialDate)).to.equal(0);
  });
});

