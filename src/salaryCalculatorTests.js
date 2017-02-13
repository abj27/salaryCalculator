// const td = require("testdouble");
const faker = require("faker");
import {expect} from "chai";
const paymentCalculator = require("./salaryCalcualatorService").paymentCalculator;
const Employee= require("./salaryCalcualatorService").Employee;
const employeeTypes= require("./salaryCalcualatorService").employeeTypes;
const dailyWorkSheets= require("./salaryCalcualatorService").dailyWorkSheets;
const DailyWorkSheet= require("./DailyWorkSheet").DailyWorkSheet;
describe("Payment calculator get payment", function () {
  //System Under Test
  let sut;
  let employee;
  let pricePerHour;
  let workingHoursInWeek = 44;
  let overTimeFactor = 1.5;
  let firstDayOfWeek =new Date();
  beforeEach(function () {
    //Arrange
    sut = paymentCalculator.getPayment;
    pricePerHour = 7;
    while(dailyWorkSheets.length){
        dailyWorkSheets.pop();
    }
  });
  var setWeekHours = function(initialDate, hours){
    var date = new Date(initialDate.getTime())
    dailyWorkSheets.push(new DailyWorkSheet(employee.id, date, hours[0]));
    for(var i= 1 ; i< hours.length; i++){
      dailyWorkSheets.push(new DailyWorkSheet(employee.id, date.setDate(date.getDay() +1), hours[i] ));
    }
  };

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

});