package com.coffeeclub.coffeeclub.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
interface WeeklyPlanRepository: JpaRepository<WeeklyPlanEntity, UUID>
