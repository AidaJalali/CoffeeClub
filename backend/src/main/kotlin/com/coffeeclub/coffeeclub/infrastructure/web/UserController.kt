package com.coffeeclub.coffeeclub.infrastructure.web

import com.coffeeclub.coffeeclub.application.UserService
import com.coffeeclub.coffeeclub.domain.User
import com.coffeeclub.coffeeclub.infrastructure.web.dto.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.slf4j.LoggerFactory
import java.util.UUID

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {
    private val logger = LoggerFactory.getLogger(UserController::class.java)

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun registerUser(@RequestBody request: CreateUserRequest): ResponseEntity<Any> {
        logger.info("Received registration request for email: ${request.email}")
        
        return try {
            val user = userService.registerUser(request)
            val userResponse = UserResponse.fromDomain(user)
            logger.info("User registered successfully: ${user.email}")
            ResponseEntity.status(HttpStatus.CREATED).body(userResponse)
        } catch (e: IllegalArgumentException) {
            logger.warn("Registration failed: ${e.message}")
            ResponseEntity.badRequest().body(mapOf("message" to e.message))
        } catch (e: Exception) {
            logger.error("Unexpected error during registration", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("message" to "Registration failed. Please try again."))
        }
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<Any> {
        logger.info("Received login request for email: ${request.email}")
        
        val user = userService.loginUser(request.email)
        return if (user != null) {
            val userResponse = UserResponse.fromDomain(user)
            logger.info("Login successful for user: ${user.email}")
            ResponseEntity.ok(userResponse)
        } else {
            logger.warn("Login failed - no user found with email: ${request.email}")
            ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(mapOf("message" to "Invalid email or user not found"))
        }
    }

    @PutMapping("/{id}/status")
    fun updateUserStatus(@PathVariable id: UUID, @RequestBody request: UpdateUserStatusRequest): ResponseEntity<Void> {
        logger.info("Updating user $id status to ${request.isActive}")
        // You would add the logic for this in your UserService
        return ResponseEntity.ok().build()
    }
}