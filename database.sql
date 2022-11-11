CREATE TABLE tasks (
    "id" serial PRIMARY KEY,
    "owner" varchar(12) NOT NULL,
    "date" date NOT NULL,
    "details" varchar(800) NOT NULL,
    "is_complete" boolean
);

INSERT INTO "tasks" ("owner", date, details, is_complete)
VALUES ('Josh', '02-17-2023', 'Be a primer', 'FALSE');