const POPULATE = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 ),
  message VARCHAR ( 255 ),
  added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (username, message) VALUES
  ('Amando', 'Hi there!'),
  ('Charles', 'Hello World!');
`;

module.exports = { POPULATE };
