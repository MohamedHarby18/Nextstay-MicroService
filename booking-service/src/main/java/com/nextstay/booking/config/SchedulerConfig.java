package com.nextstay.booking.config;

import com.nextstay.booking.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SchedulerConfig {

    private final ReservationService reservationService;

    @Scheduled(cron = "0 0 0 * * ?")   // every midnight
    public void completeReservations() {
        reservationService.completePastStays();
    }
}