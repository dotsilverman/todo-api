// var person = {
// 	name : 'Dot',
// 	age : 21
// };

// // won't update my age
// function wontUpdatePerson(obj) {
// 	obj = {
// 		name : 'Dot',
// 		age : 24
// 	};
// }

// wontUpdatePerson(person);
// console.log(person);

// // will update my age
// function updatePerson(obj, years) {
// 	obj.age = years;
// }

// updatePerson(person, 24);
// console.log(person);

// Array example
var grades = [15, 37];

// function wontUpdateGrades(gradesArr) {
// 	gradesArr = [70, 45, 82];
// }

// wontUpdateGrades(grades);
// console.log(grades);

function updateGrades(array, grade) {
	array.push(grade);
	debugger;
}

updateGrades(grades, 93);
console.log(grades);

// Hum... arrays work different than function! Grades in wontUpdateGrades doesn't reference
// the original grades variable