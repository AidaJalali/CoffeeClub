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

data class UpdateWalletRequest(
    val balance: Double
)

data class UpdateEmailRequest(
    val email: String
)

// DTO for User that matches frontend expectations
data class UserResponse(
    val id: String, // UUID as string
    val name: String,
    val email: String,
    val isActive: Boolean,
    val isAdmin: Boolean = false,
    val walletBalance: Double = 0.0
) {
    companion object {
        fun fromDomain(user: com.coffeeclub.coffeeclub.domain.User): UserResponse {
            return UserResponse(
                id = user.id.toString(),
                name = user.name,
                email = user.email,
                isActive = user.isActive,
                isAdmin = user.isAdmin,
                walletBalance = user.walletBalance
            )
        }
    }
}