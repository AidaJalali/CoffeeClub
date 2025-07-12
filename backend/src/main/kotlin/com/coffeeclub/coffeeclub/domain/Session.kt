package com.coffeeclub.coffeeclub.domain

import java.time.LocalDateTime
import java.util.UUID

data class Session(
    val id: UUID = UUID.randomUUID(),
    val title: String,
    val dateTime: LocalDateTime,
    val location: String = "Floor 3, Tapsel Building, Tehran",
    val maxParticipants: Int = 10,
    val participants: List<UUID> = emptyList(),
    val coffeeMakers: List<UUID> = emptyList(),
    val mokaPotCleaner: UUID? = null,
    val isActive: Boolean = true
) 