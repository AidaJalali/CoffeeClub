package com.coffeeclub.coffeeclub.infrastructure.web

import com.coffeeclub.coffeeclub.application.CoffeeDutyService
import com.coffeeclub.coffeeclub.domain.User
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/duty")
class CoffeeDutyController(
    private val coffeeDutyService: CoffeeDutyService
) {
    @GetMapping("/buyer")
    fun getNextBuyer(): User? {
        return coffeeDutyService.getNextPersonToBuyCoffee()
    }
}