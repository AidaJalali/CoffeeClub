package com.coffeeclub.coffeeclub.domain

import java.util.UUID


data class WeeklyPlan(
    val year: Int,
    val weekOfYear: Int,
    val user: Map<UUID, User>,
    val dailyPlans: List<DailyPlan>
)