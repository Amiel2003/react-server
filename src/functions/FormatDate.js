function formatDateAsText(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

function formatDateToLetters(dateEntered){
    const date = new Date(dateEntered);
    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
      ];
      
      // Extract the year, month, and day components
      const year = date.getFullYear();
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      
      // Create a formatted date string with the month name (October 29, 2023)
      const formattedDate = `${month} ${day}, ${year}`;
      return formattedDate;
}

function removeTime(data){
    const originalDateString = data;
    const date = new Date(originalDateString);
    const formattedDate = date.toLocaleDateString();
    return formattedDate
}

module.exports = {formatDateAsText,formatDateToLetters,removeTime}