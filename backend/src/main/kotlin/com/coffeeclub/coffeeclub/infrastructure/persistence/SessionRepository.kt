package com.coffeeclub.coffeeclub.infrastructure.persistence

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.UUID

@Repository
interface SessionRepository : JpaRepository<SessionEntity, UUID> {
    fun findByIsActiveTrueOrderByDateTimeAsc(): List<SessionEntity>
    fun findByDateTimeAfterOrderByDateTimeAsc(dateTime: LocalDateTime): List<SessionEntity>
} 