package com.coffeeclub.coffeeclub.application

import com.coffeeclub.coffeeclub.domain.User
import com.coffeeclub.coffeeclub.infrastructure.persistence.UserRepository
import com.coffeeclub.coffeeclub.infrastructure.persistence.UserEntity
import com.coffeeclub.coffeeclub.infrastructure.web.dto.CreateUserRequest
import org.springframework.stereotype.Service



@Service
class UserService(
    val userRepository: UserRepository,
){
    fun createUser(name: String, email: String): User {
            val user = User(
                name = name,
                email = email
            )

            val userEntity = UserEntity(
                id = user.id,
                name = user.name,
                email = user.email,
                isActive = true
            )

        userRepository.save(userEntity)
        return user
    }

    fun registerUser(request: CreateUserRequest): User {
        // In a real app, you'd check if the email already exists
        return createUser(request.name, request.email)
    }

    fun loginUser(email: String): User? {
        val userEntity = userRepository.findAll().find { it.email == email }
        return userEntity?.toDomain()
    }

    private fun UserEntity.toDomain() = User(
        id = this.id,
        name = this.name,
        email = this.email,
        isActive = this.isActive
    )
}