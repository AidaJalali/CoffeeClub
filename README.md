# CoffeeClub

A simple Spring Boot API to manage our office coffee club routine. This project helps decide whose turn it is to make coffee, buy beans, and track expenses.

***
This project solves these problems by providing a simple API to:

* **Manage a Fair Rota:** It maintains separate, rotating queues for making coffee and for buying new supplies.
* **Create Coffee Rounds:** Any user can initiate a coffee round, and the system automatically assigns the task to the correct person.
* **Track Shared Expenses:** It allows users to log purchases, making it easy to see who has contributed.
* **Handle User Status:** Users can set their status to "inactive" if they are on vacation so they are skipped in the rotation.


***


## Tech Stack

* **Framework**: Spring Boot
* **Language**: Kotlin
* **Build Tool**: Gradle
* **Database**: Spring Data JPA with PostgreSQL


### Running the Application

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/coffeeclub.git](https://github.com/your-username/coffeeclub.git)
    cd coffeeclub
    ```

2.  Run the application using the Gradle wrapper:
    ```bash
    ./gradlew bootRun
    ```
    The application will be running at `http://localhost:8080`.

### Building the JAR

You can build the executable JAR file with:
```bash
./gradlew bootJar
