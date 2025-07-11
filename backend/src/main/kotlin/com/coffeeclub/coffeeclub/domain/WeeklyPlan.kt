package com.coffeeclub.coffeeclub.domain

import java.util.UUID


data class WeeklyPlan(
    val id: UUID,
    val year: Int,
    val weekOfYear: Int,
    val users: Map<UUID, User>,
    val dailyPlans: List<DailyPlan>
)