const randomBook = async (subject = "fantasy") => {
  try {
    const raw = await fetch(`https://openlibrary.org/subjects/${subject}.json`);
    const jsonData = await raw.json();
    const workNumber = Math.floor(Math.random() * jsonData.works.length);
    let {
      title,
      authors,
      first_publish_year: year,
    } = jsonData.works[workNumber];
    let author = authors && authors.length > 0 ? authors[0].name : "Unknown";
    const book = { title, author, year };
    console.log("Book:", book);
    return book;
  } catch {
    (error) => console.error("Error fetching books:", error);
  }
};

const getAuthorBirthday = async (author) => {
  try {
    const raw = await fetch(
      `https://openlibrary.org/search/authors.json?q=${author}`
    );
    const jsonData = await raw.json();
    const authorData = jsonData.docs[0];
    let birthDate = authorData.birth_date || "01-01-0001"; // Default date if not found

    // Convert birthDate to "YYYY-MM-DD" format if it's not "Unknown"
    if (birthDate !== "01-01-0001") {
      const parsedDate = new Date(birthDate); // Parse the date
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(parsedDate.getDate()).padStart(2, "0");
      birthDate = `${year}-${month}-${day}`;
    }

    return birthDate;
  } catch (error) {
    console.error("Error fetching author:", error);
    return "Unknown";
  }
};

module.exports = { randomBook, getAuthorBirthday };
