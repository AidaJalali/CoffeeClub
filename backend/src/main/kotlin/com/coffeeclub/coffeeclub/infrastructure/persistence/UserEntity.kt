package com.coffeeclub.coffeeclub.infrastructure.persistence

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID


@Entity //this class represents a database table
@Table(name = "coffee_users")  //table name in database
class UserEntity(
    @Id
    val id: UUID,
    val name: String,
    val email: String,
    val isActive: Boolean
)