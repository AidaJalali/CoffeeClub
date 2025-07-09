package com.coffeeclub.coffeeclub.application

import com.coffeeclub.coffeeclub.domain.User
import com.coffeeclub.coffeeclub.infrastructure.persistence.UserRepository
import com.coffeeclub.coffeeclub.infrastructure.persistence.UserEntity
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
}