CREATE TABLE cars (
  id          text PRIMARY KEY,
  brand       text NOT NULL,
  model       text NOT NULL,
  year        integer NOT NULL CHECK (year >= 1900 AND year <= 2026),
  price       numeric NOT NULL CHECK (price >= 0),
  image       text NOT NULL,
  image_alt   text NOT NULL,
  description text NOT NULL
);
