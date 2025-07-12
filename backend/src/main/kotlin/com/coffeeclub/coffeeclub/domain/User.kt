package com.coffeeclub.coffeeclub.domain
import java.util.UUID

data class User(
    val id: UUID = UUID.randomUUID(),
    val name: String,
    val email: String,
    val password: String = "",
    val isActive: Boolean = true,
    val isAdmin: Boolean = false,
    val walletBalance: Double = 0.0
)