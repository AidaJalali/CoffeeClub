package com.coffeeclub.coffeeclub.infrastructure.web

import com.coffeeclub.coffeeclub.application.UserService
import com.coffeeclub.coffeeclub.domain.User
import com.coffeeclub.coffeeclub.infrastructure.web.dto.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    fun registerUser(@RequestBody request: CreateUserRequest): User {
        return userService.registerUser(request)
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<User> {
        val user = userService.loginUser(request.email)
        return if (user != null) {
            ResponseEntity.ok(user)
        } else {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        }
    }

    @PutMapping("/{id}/status")
    fun updateUserStatus(@PathVariable id: UUID, @RequestBody request: UpdateUserStatusRequest): ResponseEntity<Void> {
        // You would add the logic for this in your UserService
        println("Updating user $id status to ${request.isActive}")
        return ResponseEntity.ok().build()
    }
}