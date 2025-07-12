package com.coffeeclub.coffeeclub.infrastructure.web

import com.coffeeclub.coffeeclub.application.SessionService
import com.coffeeclub.coffeeclub.infrastructure.web.dto.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.slf4j.LoggerFactory
import java.util.UUID

@RestController
@RequestMapping("/api/sessions")
class SessionController(
    private val sessionService: SessionService
) {
    private val logger = LoggerFactory.getLogger(SessionController::class.java)

    @GetMapping
    fun getActiveSessions(): ResponseEntity<List<SessionResponse>> {
        logger.info("Fetching active sessions")
        
        val sessions = sessionService.getActiveSessions()
        val sessionResponses = sessions.map { SessionResponse.fromDomain(it) }
        return ResponseEntity.ok(sessionResponses)
    }

    @GetMapping("/upcoming")
    fun getUpcomingSessions(): ResponseEntity<List<SessionResponse>> {
        logger.info("Fetching upcoming sessions")
        
        val sessions = sessionService.getUpcomingSessions()
        val sessionResponses = sessions.map { SessionResponse.fromDomain(it) }
        return ResponseEntity.ok(sessionResponses)
    }

    @GetMapping("/{id}")
    fun getSessionById(@PathVariable id: UUID): ResponseEntity<SessionResponse?> {
        logger.info("Fetching session $id")
        
        val session = sessionService.getSessionById(id)
        return if (session != null) {
            ResponseEntity.ok(SessionResponse.fromDomain(session))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/{id}/join")
    fun joinSession(@PathVariable id: UUID, @RequestBody request: JoinSessionRequest): ResponseEntity<Any> {
        logger.info("User ${request.userId} joining session $id")
        
        return try {
            val session = sessionService.joinSession(id, request.userId)
            val sessionResponse = SessionResponse.fromDomain(session)
            ResponseEntity.ok(sessionResponse)
        } catch (e: IllegalArgumentException) {
            logger.warn("Failed to join session: ${e.message}")
            ResponseEntity.badRequest().body(mapOf("message" to e.message))
        } catch (e: Exception) {
            logger.error("Unexpected error joining session", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("message" to "Failed to join session"))
        }
    }

    @PostMapping("/{id}/leave")
    fun leaveSession(@PathVariable id: UUID, @RequestBody request: LeaveSessionRequest): ResponseEntity<Any> {
        logger.info("User ${request.userId} leaving session $id")
        
        return try {
            val session = sessionService.leaveSession(id, request.userId)
            val sessionResponse = SessionResponse.fromDomain(session)
            ResponseEntity.ok(sessionResponse)
        } catch (e: IllegalArgumentException) {
            logger.warn("Failed to leave session: ${e.message}")
            ResponseEntity.badRequest().body(mapOf("message" to e.message))
        } catch (e: Exception) {
            logger.error("Unexpected error leaving session", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("message" to "Failed to leave session"))
        }
    }

    @PostMapping("/{id}/complete")
    fun completeSession(@PathVariable id: UUID): ResponseEntity<Any> {
        logger.info("Completing session $id")
        
        return try {
            val session = sessionService.completeSession(id)
            val sessionResponse = SessionResponse.fromDomain(session)
            ResponseEntity.ok(sessionResponse)
        } catch (e: IllegalArgumentException) {
            logger.warn("Failed to complete session: ${e.message}")
            ResponseEntity.badRequest().body(mapOf("message" to e.message))
        } catch (e: Exception) {
            logger.error("Unexpected error completing session", e)
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("message" to "Failed to complete session"))
        }
    }
} 