package com.coffeeclub.coffeeclub.infrastructure.web

import com.coffeeclub.coffeeclub.application.PlanService
import com.coffeeclub.coffeeclub.domain.DailyPlan
import com.coffeeclub.coffeeclub.domain.WeeklyPlan
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
    fun createWeeklyPlan(): WeeklyPlan {
        return planService.generateAndSaveWeeklyPlan()
    }

    /**
     * Handles GET requests to /api/plans/weekly/current
     * Fetches the plan for the current week.
     */
    @GetMapping("/weekly/current")
    fun getCurrentWeeklyPlan(): WeeklyPlan? {
        return planService.findCurrentWeeklyPlan()
    }

    /**
     * Handles GET requests to /api/plans/today
     * Fetches the plan specifically for today.
     */
    @GetMapping("/today")
    fun getTodaysPlan(): DailyPlan? {
        return planService.findTodaysPlan()
    }

    @GetMapping("/{id}")
    fun getPlanById(@PathVariable id: UUID): DailyPlan? {
        return planService.findTodaysPlan()
    }
}