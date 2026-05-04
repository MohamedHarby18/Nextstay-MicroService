package com.nextstay.review.repository;

import com.nextstay.review.entity.HostResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface HostResponseRepository extends JpaRepository<HostResponse, UUID> {
    Optional<HostResponse> findByReviewId(UUID reviewId);
    Boolean existsByReviewId(UUID reviewId);
}
