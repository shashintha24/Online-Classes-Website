package com.skproduct.ElectroPhysics.notification;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("""
        select n from Notification n
        where (n.targetUserId = :userId)
           or (n.targetUserId is null and (n.audience = :audience or n.audience = 'ALL'))
        order by n.createdAt desc
    """)
    List<Notification> findVisibleForUser(@Param("userId") Long userId, @Param("audience") String audience);

    @Query("""
        select count(n) from Notification n
        where n.unread = true and (
            n.targetUserId = :userId
            or (n.targetUserId is null and (n.audience = :audience or n.audience = 'ALL'))
        )
    """)
    long countUnreadForUser(@Param("userId") Long userId, @Param("audience") String audience);

    @Modifying
    @Query("""
        update Notification n set n.unread = false
        where n.unread = true and (
            n.targetUserId = :userId
            or (n.targetUserId is null and (n.audience = :audience or n.audience = 'ALL'))
        )
    """)
    int markAllReadForUser(@Param("userId") Long userId, @Param("audience") String audience);
}
