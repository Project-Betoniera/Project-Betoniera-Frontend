export function generateMonth(inputDate: Date) {
    const monthView: [Date[]] = [[]]; // Declare an array of arrays, with the first array being empty
    monthView.pop(); // Remove the first empty array

    // Get first day of the result array (Monday)
    const firstDayOfTheMonth = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);
    while (firstDayOfTheMonth.getDay() !== 1) {
        firstDayOfTheMonth.setDate(firstDayOfTheMonth.getDate() - 1);
    }

    // Get last day of the result array (Sunday)
    const lastDayOfTheMonth = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0);
    while (lastDayOfTheMonth.getDay() !== 0) {
        lastDayOfTheMonth.setDate(lastDayOfTheMonth.getDate() + 1);
    }

    const millisecondsInAWeek = 604800000;
    const numberOfWeeks = Math.ceil((lastDayOfTheMonth.getTime() - firstDayOfTheMonth.getTime()) / millisecondsInAWeek);

    let currentDay = new Date(firstDayOfTheMonth);
    for (let i = 0; i < numberOfWeeks; i++) {
        monthView.push(generateWeek(currentDay));
        currentDay.setDate(currentDay.getDate() + 7); // Go to next week
    }

    return monthView;
}

export function generateWeek(inputDate: Date) {
    const weekView: Date[] = [];

    // Get first day of the result array (Monday)
    const firstDayOfTheWeek = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    if (firstDayOfTheWeek.getDay() !== 1) {
        while (firstDayOfTheWeek.getDay() !== 1) {
            firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() - 1);
        }
    }

    // Fill the array with the days of the week
    const newDay = new Date(firstDayOfTheWeek);
    for (let i = 0; i < 7; i++) {
        weekView.push(new Date(newDay));
        newDay.setDate(newDay.getDate() + 1);
    }

    return weekView;
}

export function generateShortWeek(inputDate: Date) {
    const weekView: Date[] = [];

    // Get first day of the result array (Monday)
    const firstDayOfTheWeek = inputDate;

    // Fill the array with the days of the week
    const newDay = new Date(firstDayOfTheWeek);
    for (let i = 0; i < 3; i++) {
        weekView.push(new Date(newDay));
        newDay.setDate(newDay.getDate() + 1);
    }

    return weekView;
}
