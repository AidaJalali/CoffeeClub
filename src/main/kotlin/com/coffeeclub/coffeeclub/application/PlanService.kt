package com.coffeeclub.coffeeclub.application

import com.coffeeclub.coffeeclub.domain.DailyPlan
import com.coffeeclub.coffeeclub.domain.WeeklyPlan
import com.coffeeclub.coffeeclub.infrastructure.persistence.*
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.util.Calendar
import kotlin.math.ceil

@Service
class PlanService(
    private val userRepository: UserRepository,
    private val planRepository: WeeklyPlanRepository
) {

    fun generateAndSaveWeeklyPlan(): WeeklyPlan {
        val activeUsers = userRepository.findAll().filter { it.isActive }.sortedBy { it.id }
        if (activeUsers.isEmpty()) {
            return WeeklyPlan(0, 0, emptyMap(), emptyList())
        }

        val dailyAssignments = assignMakersForWeek(activeUsers)
        val planEntity = buildPlanEntities(dailyAssignments, activeUsers)
        val savedEntity = planRepository.save(planEntity)

        return mapToDomain(savedEntity)
    }

    fun findCurrentWeeklyPlan(): WeeklyPlan? {
        val latestPlanEntity = planRepository.findAll().maxByOrNull { it.year * 100 + it.weekOfYear }
        return latestPlanEntity?.let { mapToDomain(it) }
    }

    private fun assignMakersForWeek(activeUsers: List<UserEntity>): Map<LocalDate, List<UserEntity>> {
        val assignments = mutableMapOf<LocalDate, List<UserEntity>>()
        var nextMakerIndex = 0
        val makersPerDay = ceil(activeUsers.size / 2.0).toInt()

        for (dayOffset in 0..6) {
            val date = LocalDate.now().plusDays(dayOffset.toLong())
            val makersForToday = mutableListOf<UserEntity>()
            repeat(makersPerDay) {
                makersForToday.add(activeUsers[nextMakerIndex])
                nextMakerIndex = (nextMakerIndex + 1) % activeUsers.size
            }
            assignments[date] = makersForToday
        }
        return assignments
    }

    private fun buildPlanEntities(assignments: Map<LocalDate, List<UserEntity>>, allActiveUsers: List<UserEntity>): WeeklyPlanEntity {
        val calendar = Calendar.getInstance()
        val weeklyPlanEntity = WeeklyPlanEntity(
            year = calendar.get(Calendar.YEAR),
            weekOfYear = calendar.get(Calendar.WEEK_OF_YEAR)
        )

        val dailyPlanEntities = ArrayList(assignments.map { (date, makers) ->
            DailyPlanEntity(
                date = date,
                weeklyPlan = weeklyPlanEntity,
                activeUsers = ArrayList(allActiveUsers),
                coffeeMakers = ArrayList(makers)
            )
        })

        weeklyPlanEntity.dailyPlans = dailyPlanEntities
        return weeklyPlanEntity
    }

    private fun mapToDomain(entity: WeeklyPlanEntity): WeeklyPlan {
        val allUsersInPlan = (entity.dailyPlans.flatMap { it.activeUsers } + entity.dailyPlans.flatMap { it.coffeeMakers })
            .distinctBy { it.id }
            .associate { it.id to it.toDomain() }

        val dailyDomainPlans = entity.dailyPlans.map { dailyEntity ->
            DailyPlan(
                date = dailyEntity.date!!,
                activeUserIds = dailyEntity.activeUsers.map { it.id },
                coffeeMakerIds = dailyEntity.coffeeMakers.map { it.id }
            )
        }

        return WeeklyPlan(
            year = entity.year,
            weekOfYear = entity.weekOfYear,
            users = allUsersInPlan,
            dailyPlans = dailyDomainPlans
        )
    }

    private fun UserEntity.toDomain() = com.coffeeclub.coffeeclub.domain.User(
        id = this.id,
        name = this.name,
        email = this.email,
        isActive = this.isActive
    )
}