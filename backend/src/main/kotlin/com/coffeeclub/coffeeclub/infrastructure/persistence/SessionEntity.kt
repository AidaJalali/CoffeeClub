package com.coffeeclub.coffeeclub.infrastructure.persistence

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "coffee_sessions")
class SessionEntity(
    @Id
    var id: UUID = UUID.randomUUID(),
    
    var title: String,
    
    var dateTime: LocalDateTime,
    
    var location: String = "Floor 3, Tapsel Building, Tehran",
    
    var maxParticipants: Int = 10,
    
    @ElementCollection
    @CollectionTable(name = "session_participants", joinColumns = [JoinColumn(name = "session_id")])
    @Column(name = "user_id")
    var participants: MutableList<UUID> = mutableListOf(),
    
    @ElementCollection
    @CollectionTable(name = "session_coffee_makers", joinColumns = [JoinColumn(name = "session_id")])
    @Column(name = "user_id")
    var coffeeMakers: MutableList<UUID> = mutableListOf(),
    
    var mokaPotCleaner: UUID? = null,
    
    var isActive: Boolean = true
) 