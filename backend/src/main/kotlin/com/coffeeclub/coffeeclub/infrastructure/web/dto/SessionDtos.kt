package com.coffeeclub.coffeeclub.infrastructure.web.dto

import com.coffeeclub.coffeeclub.domain.Session
import java.time.LocalDateTime
import java.util.UUID

data class CreateSessionRequest(
    val title: String,
    val dateTime: LocalDateTime,
    val location: String = "Floor 3, Tapsel Building, Tehran"
)

data class UpdateLocationRequest(
    val location: String
)

data class UpdateTimeRequest(
    val dateTime: LocalDateTime
)

data class JoinSessionRequest(
    val userId: UUID
)

data class LeaveSessionRequest(
    val userId: UUID
)

data class SessionResponse(
    val id: String,
    val title: String,
    val dateTime: String,
    val location: String,
    val maxParticipants: Int,
    val participants: List<String>,
    val coffeeMakers: List<String>,
    val mokaPotCleaner: String?,
    val isActive: Boolean
) {
    companion object {
        fun fromDomain(session: Session): SessionResponse {
            return SessionResponse(
                id = session.id.toString(),
                title = session.title,
                dateTime = session.dateTime.toString(),
                location = session.location,
                maxParticipants = session.maxParticipants,
                participants = session.participants.map { it.toString() },
                coffeeMakers = session.coffeeMakers.map { it.toString() },
                mokaPotCleaner = session.mokaPotCleaner?.toString(),
                isActive = session.isActive
            )
        }
    }
} 