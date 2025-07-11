package com.coffeeclub.coffeeclub.application

import com.coffeeclub.coffeeclub.domain.User
import com.coffeeclub.coffeeclub.infrastructure.persistence.UserRepository
import com.coffeeclub.coffeeclub.infrastructure.persistence.UserEntity
import com.coffeeclub.coffeeclub.infrastructure.web.dto.CreateUserRequest
import org.springframework.stereotype.Service
import org.slf4j.LoggerFactory

@Service
class UserService(
    val userRepository: UserRepository,
){
    private val logger = LoggerFactory.getLogger(UserService::class.java)

    fun createUser(name: String, email: String): User {
        logger.info("Creating user with name: $name, email: $email")
        
        val user = User(
            name = name,
            email = email
        )

        val userEntity = UserEntity(
            id = user.id,
            name = user.name,
            email = user.email,
            isActive = true
        )

        val savedEntity = userRepository.save(userEntity)
        logger.info("User created successfully with ID: ${savedEntity.id}")
        
        return User(
            id = savedEntity.id,
            name = savedEntity.name,
            email = savedEntity.email,
            isActive = savedEntity.isActive
        )
    }

    fun registerUser(request: CreateUserRequest): User {
        logger.info("Registering user: ${request.email}")
        
        // Check if user already exists
        val existingUser = userRepository.findAll().find { it.email == request.email }
        if (existingUser != null) {
            logger.warn("User with email ${request.email} already exists")
            throw IllegalArgumentException("User with this email already exists")
        }
        
        return createUser(request.name, request.email)
    }

    fun loginUser(email: String): User? {
        logger.info("Attempting login for email: $email")
        
        val userEntity = userRepository.findAll().find { it.email == email }
        if (userEntity != null) {
            logger.info("Login successful for user: ${userEntity.name}")
            return userEntity.toDomain()
        } else {
            logger.warn("Login failed - no user found with email: $email")
            return null
        }
    }

    private fun UserEntity.toDomain() = User(
        id = this.id,
        name = this.name,
        email = this.email,
        isActive = this.isActive
    )
}