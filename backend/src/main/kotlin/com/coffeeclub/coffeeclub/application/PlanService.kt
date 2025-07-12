package com.coffeeclub.coffeeclub.application

import com.coffeeclub.coffeeclub.domain.DailyPlan
import com.coffeeclub.coffeeclub.domain.User
import com.coffeeclub.coffeeclub.domain.WeeklyPlan
import com.coffeeclub.coffeeclub.infrastructure.persistence.*
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.util.Calendar
import java.util.UUID
import kotlin.math.ceil
import org.slf4j.LoggerFactory

@Service
class PlanService(
    private val userRepository: UserRepository,
    private val planRepository: WeeklyPlanRepository
) {

    private val logger = LoggerFactory.getLogger(PlanService::class.java)

    fun generateAndSaveWeeklyPlan(): WeeklyPlan {
        val activeUsers = userRepository.findAll().filter { it.isActive }.sortedBy { it.id }
        if (activeUsers.isEmpty()) {
            return WeeklyPlan(
                UUID.randomUUID(),
                0,
                0,
                emptyMap<UUID, User>(),
                dailyPlans = emptyList<DailyPlan>()
            )
        }

        val dailyAssignments = assignMakersForWeek(activeUsers)
        val planEntity = buildPlanEntities(dailyAssignments, activeUsers)
        val savedEntity = planRepository.save(planEntity)

        return mapToDomain(savedEntity)
    }


    fun findCurrentWeeklyPlan(): WeeklyPlan? {
        // 1. Get the current year and week number
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val weekOfYear = calendar.get(Calendar.WEEK_OF_YEAR)

        // 2. Use the new repository method to find the specific plan for this week
        val currentPlanEntity = planRepository.findByYearAndWeekOfYear(year, weekOfYear)

        // 3. Map it to the domain object if it exists
        return currentPlanEntity?.let { mapToDomain(it) }
    }


    fun findTodaysPlan(): DailyPlan? {
        val currentWeeklyPlan = findCurrentWeeklyPlan()
        val today = LocalDate.now()

        // Find the daily plan that matches today's date
        return currentWeeklyPlan?.dailyPlans?.find { it.date == today }
    }

    fun ensureTodaysPlan(): DailyPlan? {
        // First try to find today's plan
        var todaysPlan = findTodaysPlan()
        
        // If no plan exists for today, generate a new weekly plan
        if (todaysPlan == null) {
            logger.info("No plan found for today, generating new weekly plan")
            val newWeeklyPlan = generateAndSaveWeeklyPlan()
            todaysPlan = newWeeklyPlan.dailyPlans.find { it.date == LocalDate.now() }
        }
        
        return todaysPlan
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
                id = dailyEntity.id,
                date = dailyEntity.date!!,
                activeUsers = dailyEntity.activeUsers.map { it.id },
                coffeeMakers = dailyEntity.coffeeMakers.map { it.id }
            )
        }

        return WeeklyPlan(
            id = entity.id,
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