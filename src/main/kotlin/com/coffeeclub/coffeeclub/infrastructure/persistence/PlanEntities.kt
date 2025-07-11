package com.coffeeclub.coffeeclub.infrastructure.persistence

import jakarta.persistence.*
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "weekly_plans")
class WeeklyPlanEntity(
        @Id
        var id: UUID = UUID.randomUUID(),

        @Column(name = "plan_year")
        var year: Int = 0,

        var weekOfYear: Int = 0,

        @OneToMany(mappedBy = "weeklyPlan", cascade = [CascadeType.ALL], fetch = FetchType.EAGER)
        var dailyPlans: MutableList<DailyPlanEntity> = mutableListOf()
)

@Entity
@Table(name = "daily_plans")
class DailyPlanEntity(
        @Id
        var id: UUID = UUID.randomUUID(),
        var date: LocalDate? = null,

        @ManyToOne
        var weeklyPlan: WeeklyPlanEntity? = null,

        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(
                name = "daily_plan_active_users",
                joinColumns = [JoinColumn(name = "daily_plan_id")],
                inverseJoinColumns = [JoinColumn(name = "user_id")]
        )
        var activeUsers: MutableList<UserEntity> = mutableListOf(),

        @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(
                name = "daily_plan_makers",
                joinColumns = [JoinColumn(name = "daily_plan_id")],
                inverseJoinColumns = [JoinColumn(name = "user_id")]
        )
        var coffeeMakers: MutableList<UserEntity> = mutableListOf()
)