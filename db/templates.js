const CREATE_AUTHORS_TABLE = `
CREATE TABLE IF NOT EXISTS authors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR (255),
  birthdate DATE
  CONSTRAINT unique_name UNIQUE (name)
  );
`;

const CREATE_BOOKS_TABLE = `
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR (255),
  authorid INTEGER,
  pages INTEGER,
  year INTEGER,
  isbn VARCHAR (13),
  CONSTRAINT fk_author FOREIGN KEY (authorid) REFERENCES authors (id)
  CONSTRAINT unique_title UNIQUE (title)
  CONSTRAINT not_future_year CHECK (year <= EXTRACT(YEAR FROM CURRENT_DATE))
);
`;

const INSERT_AUTHORS = `
INSERT INTO authors (name, birthdate)
VALUES
  ('Douglas Adams', '1952-03-11'),
  ('F. Scott Fitzgerald', '1896-09-24'),
  ('Harper Lee', '1926-04-28'),
  ('George Orwell', '1903-06-25'),
  ('Jane Austen', '1775-12-16');
`;

const INSERT_BOOKS = `
INSERT INTO books (title, authorid, pages)
VALUES
  ('The Hitchhiker''s Guide to the Galaxy', 1, 224),
  ('The Great Gatsby', 2, 180),
  ('To Kill a Mockingbird', 3, 281),
  ('1984', 4, 328),
  ('Pride and Prejudice', 5, 279);
`;

module.exports = {
  CREATE_AUTHORS_TABLE,
  CREATE_BOOKS_TABLE,
  INSERT_AUTHORS,
  INSERT_BOOKS,
};
