package com.coffeeclub.coffeeclub.infrastructure.web

import com.coffeeclub.coffeeclub.application.PlanService
import com.coffeeclub.coffeeclub.domain.DailyPlan
import com.coffeeclub.coffeeclub.domain.WeeklyPlan
import com.coffeeclub.coffeeclub.infrastructure.web.dto.DailyPlanResponse
import com.coffeeclub.coffeeclub.infrastructure.web.dto.WeeklyPlanResponse
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/plans")
class PlanController(
    private val planService: PlanService
) {

    /**
     * Handles POST requests to /api/plans/weekly
     * Generates and saves a new plan for the week.
     */
    @PostMapping("/weekly")
    @ResponseStatus(HttpStatus.CREATED)
    fun createWeeklyPlan(): WeeklyPlanResponse {
        val weeklyPlan = planService.generateAndSaveWeeklyPlan()
        return WeeklyPlanResponse.fromDomain(weeklyPlan)
    }

    /**
     * Handles GET requests to /api/plans/weekly/current
     * Fetches the plan for the current week.
     */
    @GetMapping("/weekly/current")
    fun getCurrentWeeklyPlan(): WeeklyPlanResponse? {
        val weeklyPlan = planService.findCurrentWeeklyPlan()
        return weeklyPlan?.let { WeeklyPlanResponse.fromDomain(it) }
    }

    /**
     * Handles GET requests to /api/plans/today
     * Fetches the plan specifically for today.
     */
    @GetMapping("/today")
    fun getTodaysPlan(): DailyPlanResponse? {
        val dailyPlan = planService.findTodaysPlan()
        return dailyPlan?.let { DailyPlanResponse.fromDomain(it) }
    }

    /**
     * Handles GET requests to /api/plans/today/ensure
     * Ensures a plan exists for today, generating one if necessary.
     */
    @GetMapping("/today/ensure")
    fun ensureTodaysPlan(): DailyPlanResponse? {
        val dailyPlan = planService.ensureTodaysPlan()
        return dailyPlan?.let { DailyPlanResponse.fromDomain(it) }
    }

    @GetMapping("/{id}")
    fun getPlanById(@PathVariable id: UUID): DailyPlanResponse? {
        val dailyPlan = planService.findTodaysPlan()
        return dailyPlan?.let { DailyPlanResponse.fromDomain(it) }
    }
}