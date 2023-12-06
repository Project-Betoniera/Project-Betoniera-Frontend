export function generateMonth(inputDate: Date) {
    const monthView: [Date[]] = [[]];

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

    const numberOfWeeks = Math.ceil((lastDayOfTheMonth.getTime() - firstDayOfTheMonth.getTime()) / 1000 / 60 / 60 / 24 / 7);

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
    const firstDayOfTheWeek = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate() - inputDate.getDay() + 1);

    // Fill the array with the days of the week
    const newDay = new Date(firstDayOfTheWeek);
    for (let i = 0; i < 7; i++) {
        weekView.push(new Date(newDay));
        newDay.setDate(newDay.getDate() + 1);
    }

    return weekView;
}