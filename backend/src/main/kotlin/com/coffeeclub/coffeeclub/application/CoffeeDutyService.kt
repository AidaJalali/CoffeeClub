package com.coffeeclub.coffeeclub.application

import com.coffeeclub.coffeeclub.domain.User
import com.coffeeclub.coffeeclub.infrastructure.persistence.UserEntity
import com.coffeeclub.coffeeclub.infrastructure.persistence.UserRepository
import org.springframework.stereotype.Service

@Service
class CoffeeDutyService(
    private val userRepository: UserRepository
) {
    private var nextBuyerIndex = 0

    fun getNextPersonToBuyCoffee(): User? {
        val activeUsers = userRepository.findAll().filter { it.isActive }.sortedBy { it.id }
        if (activeUsers.isEmpty()) return null

        val nextBuyer = activeUsers[nextBuyerIndex]
        nextBuyerIndex = (nextBuyerIndex + 1) % activeUsers.size

        return nextBuyer.toDomain()
    }

    private fun UserEntity.toDomain() = User(
        id = this.id,
        name = this.name,
        email = this.email,
        isActive = this.isActive
    )
}