CREATE TABLE tasks (
    "id" serial PRIMARY KEY,
    "owner" varchar(12) NOT NULL,
    "date" date NOT NULL,
    "details" varchar(800) NOT NULL,
    "is_complete" boolean DEFAULT FALSE,
    "completed_on" date
);

INSERT INTO "tasks" ("owner", date, details, is_complete)
VALUES ('Josh', '02-17-2023', 'Be a primer', 'FALSE'), 
    ('Josh', '02-28-2023', 'Have a huge b-day party', 'FALSE'), 
    ('Josh', '04-01-2023', 'Have a programming job by this day', 'FALSE');