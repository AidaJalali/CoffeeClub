package com.coffeeclub.coffeeclub.application

import com.coffeeclub.coffeeclub.infrastructure.persistence.WeeklyPlanRepository
import org.springframework.stereotype.Service

@Service
class PlanService (
    val planRepository: WeeklyPlanRepository,
    val userRepository: WeeklyPlanRepository
){
    //functions
    //TODO("Implement the plan generation logic here")
}