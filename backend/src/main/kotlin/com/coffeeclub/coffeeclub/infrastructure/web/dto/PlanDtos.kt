package com.coffeeclub.coffeeclub.infrastructure.web.dto

import com.coffeeclub.coffeeclub.domain.DailyPlan
import com.coffeeclub.coffeeclub.domain.WeeklyPlan
import java.util.UUID

// DTO for DailyPlan that matches frontend expectations
data class DailyPlanResponse(
    val id: UUID,
    val date: String, // ISO date string
    val activeUsers: List<UUID>,
    val coffeeMakerIds: List<UUID> // Frontend expects this field name
) {
    companion object {
        fun fromDomain(dailyPlan: DailyPlan): DailyPlanResponse {
            return DailyPlanResponse(
                id = dailyPlan.id,
                date = dailyPlan.date.toString(),
                activeUsers = dailyPlan.activeUsers,
                coffeeMakerIds = dailyPlan.coffeeMakers
            )
        }
    }
}

// DTO for WeeklyPlan that matches frontend expectations
data class WeeklyPlanResponse(
    val id: UUID,
    val year: Int,
    val weekOfYear: Int,
    val users: Map<String, UserResponse>, // UUID as string key
    val dailyPlans: List<DailyPlanResponse>
) {
    companion object {
        fun fromDomain(weeklyPlan: WeeklyPlan): WeeklyPlanResponse {
            return WeeklyPlanResponse(
                id = weeklyPlan.id,
                year = weeklyPlan.year,
                weekOfYear = weeklyPlan.weekOfYear,
                users = weeklyPlan.users.mapKeys { it.key.toString() }.mapValues { UserResponse.fromDomain(it.value) },
                dailyPlans = weeklyPlan.dailyPlans.map { DailyPlanResponse.fromDomain(it) }
            )
        }
    }
}

// DTO for User that matches frontend expectations
data class UserResponse(
    val id: String, // UUID as string
    val name: String,
    val email: String,
    val isActive: Boolean
) {
    companion object {
        fun fromDomain(user: com.coffeeclub.coffeeclub.domain.User): UserResponse {
            return UserResponse(
                id = user.id.toString(),
                name = user.name,
                email = user.email,
                isActive = user.isActive
            )
        }
    }
} 