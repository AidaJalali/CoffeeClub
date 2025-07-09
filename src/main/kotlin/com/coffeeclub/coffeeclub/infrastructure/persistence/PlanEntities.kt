package com.coffeeclub.coffeeclub.infrastructure.persistence

import com.coffeeclub.coffeeclub.domain.DailyPlan
import jakarta.persistence.CascadeType
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import java.time.LocalDate

import java.util.UUID;

@Entity
@Table(name = "weekly_plans")
public class WeeklyPlanEntity(
        @Id
        val id: UUID = UUID.randomUUID(),
        val year: Int,
        val weekOfYear: Int,

        @OneToMany(mappedBy = "weeklyPlan", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
        val dailyPlans: List<DailyPlanEntity>
)

@Entity
@Table(name = "daily_plans")
public class DailyPlanEntity(
        @Id
        val id: UUID = UUID.randomUUID(),
        val date: LocalDate,

        @ManyToOne
        val weeklyPlan: WeeklyPlanEntity,

        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(name = "daily_plan_active_users")
        val activeUsers: List<UserEntity>,

        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(name = "daily_plan_makers")
        val coffeeMakers: List<UserEntity>
        )