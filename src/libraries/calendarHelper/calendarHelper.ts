export function generateMonth(inputDate: Date) {

    const monthView: [Date[]] = [[]];

    // Get first day of the result array (Monday)
    const firstDayOfTheMonth = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);

    if (firstDayOfTheMonth.getDay() !== 1) {
        while (firstDayOfTheMonth.getDay() !== 1) {
            firstDayOfTheMonth.setDate(firstDayOfTheMonth.getDate() - 1);
        }
    }
    monthView[0].push(new Date(firstDayOfTheMonth)); // Push first day of the month

    // Get last day of the result array (Saturday)
    const lastDayOfTheMonth = new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 0);

    if (lastDayOfTheMonth.getDay() !== 0) {
        while (lastDayOfTheMonth.getDay() !== 0) {
            lastDayOfTheMonth.setDate(lastDayOfTheMonth.getDate() + 1);
        }
    }
    
    //console.log(firstDayOfTheMonth.toDateString());
    //console.log(lastDayOfTheMonth.toDateString());

    // Fill the array with the days of the month
    const newDay = new Date(firstDayOfTheMonth);
    let weekCounter = 0;
    while (newDay.toDateString() !== lastDayOfTheMonth.toDateString()) {
        newDay.setDate(newDay.getDate() + 1);
        if (newDay.getDay() === 1) {
            monthView.push([]);
            weekCounter++;
        }
        //console.log(newDay.toDateString());
        // New Date because if not it will be the same object (same reference)...
        monthView[weekCounter].push(new Date(newDay));
    }

    //console.log(monthView);
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

    console.log(weekView);
    return weekView;
}