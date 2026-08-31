# EcoKnot Database

EcoKnot uses MySQL as its relational database.

## Local Development

Database name:

ecoknot_db

Default local configuration:

- Host: localhost
- Port: 3306
- Username: root
- Password: empty by default in XAMPP

## Setup

1. Start MySQL from XAMPP.
2. Open phpMyAdmin.
3. Create a database named `ecoknot_db`.
4. Use UTF-8 (`utf8mb4`) encoding.

Database tables will be managed through Spring Boot using JPA/Hibernate.