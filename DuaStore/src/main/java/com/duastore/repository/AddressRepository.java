package com.duastore.repository;

import com.duastore.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {

    // Lấy danh sách địa chỉ của 1 user (Địa chỉ mặc định sẽ hiện lên đầu tiên)
    @Query("SELECT a FROM Address a WHERE a.userId = ?1 ORDER BY a.isDefault DESC, a.id DESC")
    List<Address> findByUserIdOrderByIsDefaultDesc(Integer userId);

    // Hỗ trợ Task 22: Gỡ trạng thái mặc định của tất cả địa chỉ thuộc về 1 user
    @Modifying
    @Transactional
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.userId = ?1")
    void clearDefaultAddressByUserId(Integer userId);
}