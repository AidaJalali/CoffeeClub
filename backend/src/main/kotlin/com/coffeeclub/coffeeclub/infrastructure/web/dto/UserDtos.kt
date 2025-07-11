package com.coffeeclub.coffeeclub.infrastructure.web.dto

data class CreateUserRequest(
    val name: String,
    val email: String,
    val password: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class UpdateUserStatusRequest(
    val isActive: Boolean
)