# Introduction 
This is the backend part of the Auktionshaus project. Its framework is based on Java Spring Boot (https://start.spring.io/).  

# Getting Started
- Clone repository
- Make sure Gradle 6.7 is installed
- Switch to backend folder
- Setup Gradle by executing `.\gradlew`
- Start local instance with `.\gradlew bootRun`
- (Create .jar file by building project with `.\gradlew bootJar`)
- API Documentation insight under http://localhost:8080/swagger-ui.html

### Enable SSL
- Uncomment the `SSL` part in `SecurityConfig.java`
- Uncomment `@Configuration` and `@Bean` in `ServerConfig.java`
- Uncomment everything in `application.properties`
- Add your own SSL cert key into the `resources` folder (PKCS12 format)
- Load your SSL cert by adding the key to `application.properties` by updating `server.ssl.key-store=classpath:<name>`
- Set your SSL password in `application.properties` by updating `server.ssl.key-store-password=<password>`

### Configure E-Mail server
- All E-Mail configs are located in `./email/EmailHander.java`
- Set them to your desire

### Configure database JDBC driver
- All database configs are located in `./database/Config.java`
- Set the database IP
- Set the required account passwords
- (Optional: set [Stripe API key](https://stripe.com/docs/keys))