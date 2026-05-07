package com.nextstay.listing.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * AOP Aspect — FR-03 / NFRT04
 * Logs every controller method call: method name, args, execution time, and outcome.
 */
@Aspect
@Component
@Slf4j
public class RequestLoggingAspect {

    @Around("execution(* com.nextstay.listing.controller..*(..))")
    public Object logRequest(ProceedingJoinPoint joinPoint) throws Throwable {
        String method = joinPoint.getSignature().toShortString();
        String args   = Arrays.toString(joinPoint.getArgs());
        long start    = System.currentTimeMillis();

        log.info("[LISTING-SERVICE] >> {} | args={}", method, args);

        try {
            Object result = joinPoint.proceed();
            long elapsed  = System.currentTimeMillis() - start;
            log.info("[LISTING-SERVICE] << {} | duration={}ms | status=OK", method, elapsed);
            return result;
        } catch (Throwable ex) {
            long elapsed = System.currentTimeMillis() - start;
            log.error("[LISTING-SERVICE] << {} | duration={}ms | status=ERROR | msg={}",
                    method, elapsed, ex.getMessage());
            throw ex;
        }
    }
}
