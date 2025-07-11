package com.coffeeclub.coffeeclub.application

import com.coffeeclub.coffeeclub.domain.User
import com.coffeeclub.coffeeclub.infrastructure.persistence.UserRepository
import com.coffeeclub.coffeeclub.infrastructure.persistence.UserEntity
import com.coffeeclub.coffeeclub.infrastructure.web.dto.CreateUserRequest
import org.springframework.stereotype.Service
import org.slf4j.LoggerFactory
import java.security.MessageDigest

@Service
class UserService(
    val userRepository: UserRepository,
){
    private val logger = LoggerFactory.getLogger(UserService::class.java)

    fun createUser(name: String, email: String, password: String): User {
        logger.info("Creating user with name: $name, email: $email")
        
        val user = User(
            name = name,
            email = email,
            password = hashPassword(password)
        )

        val userEntity = UserEntity(
            id = user.id,
            name = user.name,
            email = user.email,
            password = user.password,
            isActive = true
        )

        val savedEntity = userRepository.save(userEntity)
        logger.info("User created successfully with ID: ${savedEntity.id}")
        
        return User(
            id = savedEntity.id,
            name = savedEntity.name,
            email = savedEntity.email,
            password = savedEntity.password,
            isActive = savedEntity.isActive
        )
    }

    fun registerUser(request: CreateUserRequest): User {
        logger.info("Registering user: ${request.email}")
        
        // Validate input
        if (request.name.isBlank() || request.email.isBlank() || request.password.isBlank()) {
            throw IllegalArgumentException("Name, email, and password are required")
        }
        
        if (request.password.length < 6) {
            throw IllegalArgumentException("Password must be at least 6 characters long")
        }
        
        // Check if user already exists
        val existingUser = userRepository.findAll().find { it.email == request.email }
        if (existingUser != null) {
            logger.warn("User with email ${request.email} already exists")
            throw IllegalArgumentException("User with this email already exists")
        }
        
        return createUser(request.name, request.email, request.password)
    }

    fun loginUser(email: String, password: String): User? {
        logger.info("Attempting login for email: $email")
        
        val userEntity = userRepository.findAll().find { it.email == email }
        if (userEntity != null) {
            // Verify password
            if (verifyPassword(password, userEntity.password)) {
                logger.info("Login successful for user: ${userEntity.name}")
                return userEntity.toDomain()
            } else {
                logger.warn("Login failed - invalid password for email: $email")
            }
        } else {
            logger.warn("Login failed - no user found with email: $email")
        }
        return null
    }

    private fun hashPassword(password: String): String {
        val bytes = MessageDigest.getInstance("SHA-256").digest(password.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }

    private fun verifyPassword(inputPassword: String, storedPassword: String): Boolean {
        return hashPassword(inputPassword) == storedPassword
    }

    private fun UserEntity.toDomain() = User(
        id = this.id,
        name = this.name,
        email = this.email,
        password = this.password,
        isActive = this.isActive
    )
}