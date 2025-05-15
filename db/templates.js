const CREATE_AUTHORS_TABLE = `
CREATE TABLE IF NOT EXISTS authors (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR (255) UNIQUE,
  birthdate DATE
  );
`;

const CREATE_BOOKS_TABLE = `
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR (255) UNIQUE,
  authorid INTEGER,
  pages INTEGER,
  year INTEGER NOT NULL,
  isbn VARCHAR (13),
  CONSTRAINT fk_author FOREIGN KEY (authorid) REFERENCES authors (id),
  CONSTRAINT not_future_year CHECK (year <= EXTRACT(YEAR FROM CURRENT_DATE))
);
`;

const CREATE_INVENTORY_TABLE = `
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  bookid INTEGER UNIQUE,
  quantity INTEGER DEFAULT 0,
  CONSTRAINT fk_book FOREIGN KEY (bookid) REFERENCES books (id)
);
`;

const INSERT_AUTHORS = `
INSERT INTO authors (name, birthdate)
VALUES
  ('Douglas Adams', '1952-03-11'),
  ('F. Scott Fitzgerald', '1896-09-24'),
  ('Harper Lee', '1926-04-28'),
  ('George Orwell', '1903-06-25'),
  ('Jane Austen', '1775-12-16')
  ON CONFLICT (name) DO NOTHING;
`;

const INSERT_BOOKS = `
INSERT INTO books (title, authorid, pages, year)
VALUES
  ('The Hitchhiker''s Guide to the Galaxy', 1, 224, 1979),
  ('The Great Gatsby', 2, 180, 1925),
  ('To Kill a Mockingbird', 3, 281, 1960),
  ('1984', 4, 328, 1949),
  ('Pride and Prejudice', 5, 279, 1813)
  ON CONFLICT (title) DO NOTHING; 
`;

module.exports = {
  CREATE_AUTHORS_TABLE,
  CREATE_BOOKS_TABLE,
  CREATE_INVENTORY_TABLE,
  INSERT_AUTHORS,
  INSERT_BOOKS,
};
