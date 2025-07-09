package com.coffeeclub.coffeeclub

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CoffeeClubApplication

fun main(args: Array<String>) {
    runApplication<CoffeeClubApplication>(*args)
}
