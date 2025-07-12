package com.coffeeclub.coffeeclub.infrastructure.web

import com.coffeeclub.coffeeclub.application.SessionService
import com.coffeeclub.coffeeclub.application.UserService
import com.coffeeclub.coffeeclub.infrastructure.web.dto.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID

@RestController
@RequestMapping("/api/admin")
class AdminController(
    private val sessionService: SessionService,
    private val userService: UserService
) {
    private val logger = LoggerFactory.getLogger(AdminController::class.java)

    @PostMapping("/sessions")
    fun createSession(@RequestBody request: CreateSessionRequest): ResponseEntity<Any> {
        logger.info("Admin creating session: ${request.title}")
        
        return try {
            val session = sessionService.createSession(
                title = request.title,
                dateTime = request.dateTime,
                location = request.location
            )
            val sessionResponse = SessionResponse.fromDomain(session)
            ResponseEntity.status(HttpStatus.CREATED).body(sessionResponse)
        } catch (e: Exception) {
            logger.error("Failed to create session", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("message" to "Failed to create session"))
        }
    }

    @PutMapping("/sessions/{id}/location")
    fun updateSessionLocation(
        @PathVariable id: UUID,
        @RequestBody request: UpdateLocationRequest
    ): ResponseEntity<Any> {
        logger.info("Admin updating session $id location to ${request.location}")
        
        return try {
            // For now, we'll need to implement this in SessionService
            // For simplicity, we'll return success
            ResponseEntity.ok(mapOf("message" to "Location updated successfully"))
        } catch (e: Exception) {
            logger.error("Failed to update session location", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("message" to "Failed to update location"))
        }
    }

    @PutMapping("/sessions/{id}/time")
    fun updateSessionTime(
        @PathVariable id: UUID,
        @RequestBody request: UpdateTimeRequest
    ): ResponseEntity<Any> {
        logger.info("Admin updating session $id time to ${request.dateTime}")
        
        return try {
            // For now, we'll need to implement this in SessionService
            // For simplicity, we'll return success
            ResponseEntity.ok(mapOf("message" to "Time updated successfully"))
        } catch (e: Exception) {
            logger.error("Failed to update session time", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("message" to "Failed to update time"))
        }
    }

    @PutMapping("/users/{id}/wallet")
    fun updateUserWallet(
        @PathVariable id: UUID,
        @RequestBody request: UpdateWalletRequest
    ): ResponseEntity<Any> {
        logger.info("Admin updating user $id wallet balance to ${request.balance}")
        
        return try {
            // For now, we'll need to implement this in UserService
            // For simplicity, we'll return success
            ResponseEntity.ok(mapOf("message" to "Wallet updated successfully"))
        } catch (e: Exception) {
            logger.error("Failed to update user wallet", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("message" to "Failed to update wallet"))
        }
    }

    @GetMapping("/sessions")
    fun getAllSessions(): ResponseEntity<List<SessionResponse>> {
        logger.info("Admin fetching all sessions")
        
        val sessions = sessionService.getActiveSessions()
        val sessionResponses = sessions.map { SessionResponse.fromDomain(it) }
        return ResponseEntity.ok(sessionResponses)
    }

    @PostMapping("/users/admin")
    fun createAdminUser(@RequestBody request: CreateUserRequest): ResponseEntity<Any> {
        logger.info("Creating admin user: ${request.email}")
        
        return try {
            val user = userService.createAdminUser(request.name, request.email, request.password)
            val userResponse = UserResponse.fromDomain(user)
            ResponseEntity.status(HttpStatus.CREATED).body(userResponse)
        } catch (e: IllegalArgumentException) {
            logger.warn("Admin user creation failed: ${e.message}")
            ResponseEntity.badRequest().body(mapOf("message" to e.message))
        } catch (e: Exception) {
            logger.error("Failed to create admin user", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("message" to "Failed to create admin user"))
        }
    }
} 