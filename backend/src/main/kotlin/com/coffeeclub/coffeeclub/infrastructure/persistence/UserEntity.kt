package com.coffeeclub.coffeeclub.infrastructure.persistence

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "coffee_users")
data class UserEntity(
    @Id
    @Column(name = "id")
    var id: UUID,
    
    @Column(name = "name", nullable = false)
    var name: String,
    
    @Column(name = "email", nullable = false, unique = true)
    var email: String,
    
    @Column(name = "password", nullable = false)
    var password: String,
    
    @Column(name = "is_active", nullable = false)
    var isActive: Boolean,
    
    @Column(name = "is_admin", nullable = false)
    var isAdmin: Boolean = false,
    
    @Column(name = "wallet_balance", nullable = false)
    var walletBalance: Double = 0.0
)