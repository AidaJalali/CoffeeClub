package com.coffeeclub.coffeeclub.domain
import java.util.UUID


data class User(
    val id: UUID = UUID.randomUUID(),
    val name: String,
    val email: String,
    val isActive: Boolean = true
)