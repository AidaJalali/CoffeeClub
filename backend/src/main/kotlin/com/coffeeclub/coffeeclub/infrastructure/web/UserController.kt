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
    fun registerUser(@RequestBody request: CreateUserRequest): UserResponse {
        val user = userService.registerUser(request)
        return UserResponse.fromDomain(user)
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<UserResponse> {
        val user = userService.loginUser(request.email)
        return if (user != null) {
            ResponseEntity.ok(UserResponse.fromDomain(user))
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