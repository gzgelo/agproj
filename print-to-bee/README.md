# Print to Bee - Printing System

## Description
Your Digital Printing Solution – a comprehensive printing system that streamlines print job management, queue handling, and document processing.

## Features
- User authentication and role management
- Print job queue management
- Document upload and processing
- Report generation with JasperStudio
- MySQL database integration
- Print job tracking and history

## Technologies Used
- **Java** - Core programming language
- **MySQL** - Database management
- **JasperStudio** - Report generation and design
- **Java Swing** - Desktop GUI framework
- **JDBC** - Database connectivity

## Database Structure
- Users table (user_id, username, password, role)
- PrintJobs table (job_id, user_id, file_name, status, timestamp)
- Reports table (report_id, job_id, generated_date)

## Screenshots
![Print to Bee Screenshot](./screenshot.png)

## How to Run
1. Install Java JDK 8 or higher
2. Install MySQL Server
3. Import the database schema
4. Configure database connection in `config.properties`
5. Run the main application file
