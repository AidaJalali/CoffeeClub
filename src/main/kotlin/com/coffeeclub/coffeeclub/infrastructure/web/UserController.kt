package com.coffeeclub.coffeeclub.infrastructure.web

import com.coffeeclub.coffeeclub.application.UserService
import com.coffeeclub.coffeeclub.domain.User
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


data class CreateUserRequest(
    val name: String,
    val email: String
)


@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
){
    @PostMapping
    fun createUser(@RequestBody request: CreateUserRequest): User {
        return userService.createUser(request.name, request.email)
    }
}
