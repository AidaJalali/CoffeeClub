package com.coffeeclub.coffeeclub.application

import com.coffeeclub.coffeeclub.domain.Session
import com.coffeeclub.coffeeclub.infrastructure.persistence.SessionRepository
import com.coffeeclub.coffeeclub.infrastructure.persistence.SessionEntity
import com.coffeeclub.coffeeclub.infrastructure.persistence.UserRepository
import org.springframework.stereotype.Service
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.util.UUID

@Service
class SessionService(
    private val sessionRepository: SessionRepository,
    private val userRepository: UserRepository
) {
    private val logger = LoggerFactory.getLogger(SessionService::class.java)

    fun createSession(title: String, dateTime: LocalDateTime, location: String = "Floor 3, Tapsel Building, Tehran"): Session {
        logger.info("Creating session: $title at $dateTime")
        
        val sessionEntity = SessionEntity(
            title = title,
            dateTime = dateTime,
            location = location
        )
        
        val savedEntity = sessionRepository.save(sessionEntity)
        logger.info("Session created with ID: ${savedEntity.id}")
        
        return savedEntity.toDomain()
    }

    fun joinSession(sessionId: UUID, userId: UUID): Session {
        logger.info("User $userId joining session $sessionId")
        
        val sessionEntity = sessionRepository.findById(sessionId)
            .orElseThrow { IllegalArgumentException("Session not found") }
        
        if (!sessionEntity.isActive) {
            throw IllegalArgumentException("Session is not active")
        }
        
        if (sessionEntity.participants.size >= sessionEntity.maxParticipants) {
            throw IllegalArgumentException("Session is full")
        }
        
        if (userId in sessionEntity.participants) {
            throw IllegalArgumentException("User already joined this session")
        }
        
        sessionEntity.participants.add(userId)
        
        // Apply Moka Pot logic: every 2 participants need 1 coffee maker
        val requiredCoffeeMakers = (sessionEntity.participants.size + 1) / 2
        val currentCoffeeMakers = sessionEntity.coffeeMakers.size
        
        if (currentCoffeeMakers < requiredCoffeeMakers) {
            // Assign coffee maker role to the new participant
            sessionEntity.coffeeMakers.add(userId)
            logger.info("User $userId assigned as coffee maker")
        }
        
        val savedEntity = sessionRepository.save(sessionEntity)
        return savedEntity.toDomain()
    }

    fun leaveSession(sessionId: UUID, userId: UUID): Session {
        logger.info("User $userId leaving session $sessionId")
        
        val sessionEntity = sessionRepository.findById(sessionId)
            .orElseThrow { IllegalArgumentException("Session not found") }
        
        if (userId !in sessionEntity.participants) {
            throw IllegalArgumentException("User is not a participant in this session")
        }
        
        sessionEntity.participants.remove(userId)
        sessionEntity.coffeeMakers.remove(userId)
        
        // Reassign coffee makers if needed
        reassignCoffeeMakers(sessionEntity)
        
        val savedEntity = sessionRepository.save(sessionEntity)
        return savedEntity.toDomain()
    }

    fun completeSession(sessionId: UUID): Session {
        logger.info("Completing session $sessionId")
        
        val sessionEntity = sessionRepository.findById(sessionId)
            .orElseThrow { IllegalArgumentException("Session not found") }
        
        // Assign Moka Pot cleaning responsibility to the last coffee maker
        if (sessionEntity.coffeeMakers.isNotEmpty()) {
            val lastCoffeeMaker = sessionEntity.coffeeMakers.last()
            sessionEntity.mokaPotCleaner = lastCoffeeMaker
            logger.info("User $lastCoffeeMaker assigned to clean Moka Pot")
        }
        
        sessionEntity.isActive = false
        val savedEntity = sessionRepository.save(sessionEntity)
        return savedEntity.toDomain()
    }

    fun getActiveSessions(): List<Session> {
        return sessionRepository.findByIsActiveTrueOrderByDateTimeAsc()
            .map { it.toDomain() }
    }

    fun getUpcomingSessions(): List<Session> {
        return sessionRepository.findByDateTimeAfterOrderByDateTimeAsc(LocalDateTime.now())
            .map { it.toDomain() }
    }

    fun getSessionById(sessionId: UUID): Session? {
        return sessionRepository.findById(sessionId)
            .map { it.toDomain() }
            .orElse(null)
    }

    private fun reassignCoffeeMakers(sessionEntity: SessionEntity) {
        val participants = sessionEntity.participants.toList()
        val requiredCoffeeMakers = (participants.size + 1) / 2
        
        sessionEntity.coffeeMakers.clear()
        
        // Assign coffee makers fairly among participants
        for (i in 0 until minOf(requiredCoffeeMakers, participants.size)) {
            sessionEntity.coffeeMakers.add(participants[i])
        }
    }

    private fun SessionEntity.toDomain() = Session(
        id = this.id,
        title = this.title,
        dateTime = this.dateTime,
        location = this.location,
        maxParticipants = this.maxParticipants,
        participants = this.participants.toList(),
        coffeeMakers = this.coffeeMakers.toList(),
        mokaPotCleaner = this.mokaPotCleaner,
        isActive = this.isActive
    )
} 