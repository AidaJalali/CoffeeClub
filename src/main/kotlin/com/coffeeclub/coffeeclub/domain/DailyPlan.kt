package com.coffeeclub.coffeeclub.domain

import java.time.LocalDate
import java.util.UUID


data class DailyPlan (
    val id: UUID,
    val date: LocalDate = LocalDate.now(),
    val activeUsers: List<UUID>,
    val coffeeMakers: List<UUID>    //for now coffee makers are also dishwashers
    )