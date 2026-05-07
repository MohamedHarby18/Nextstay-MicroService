package com.nextstay.listing.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

/**
 * AOP Aspect — FR-03 / NFRT04 / NFRS-02
 * Security audit log for role-sensitive operations (moderation, calendar edits, deletions).
 * Logs: who (userId), what (method), outcome (allowed / denied).
 */
@Aspect
@Component
@Slf4j
public class SecurityAuditAspect {

    // Audit every call to moderateListing (Admin action — FR-08)
    @Before("execution(* com.nextstay.listing.service.ListingService.moderateListing(..))")
    public void auditModeration(JoinPoint jp) {
        log.info("[SECURITY-AUDIT] moderateListing called | args={}", java.util.Arrays.toString(jp.getArgs()));
    }

    // Audit every call to deleteListing (Host action)
    @Before("execution(* com.nextstay.listing.service.ListingService.deleteListing(..))")
    public void auditDelete(JoinPoint jp) {
        log.info("[SECURITY-AUDIT] deleteListing called | args={}", java.util.Arrays.toString(jp.getArgs()));
    }

    // Audit every call to updateAvailability (Host calendar — FR-07)
    @Before("execution(* com.nextstay.listing.service.ListingService.updateAvailability(..))")
    public void auditAvailabilityUpdate(JoinPoint jp) {
        log.info("[SECURITY-AUDIT] updateAvailability called | args={}", java.util.Arrays.toString(jp.getArgs()));
    }

    // Log successful completion of any admin/host write operation in the service layer
    @AfterReturning(
        pointcut = "execution(* com.nextstay.listing.service.ListingService.moderateListing(..))" +
                   " || execution(* com.nextstay.listing.service.ListingService.deleteListing(..))",
        returning = "result"
    )
    public void auditSuccess(JoinPoint jp, Object result) {
        log.info("[SECURITY-AUDIT] {} completed successfully | result={}",
                jp.getSignature().getName(), result);
    }

    // Log any forbidden / unexpected exception thrown from the service layer
    @AfterThrowing(
        pointcut = "execution(* com.nextstay.listing.service..*(..))",
        throwing  = "ex"
    )
    public void auditException(JoinPoint jp, Throwable ex) {
        log.warn("[SECURITY-AUDIT] {} threw {} | msg={}",
                jp.getSignature().toShortString(), ex.getClass().getSimpleName(), ex.getMessage());
    }
}
