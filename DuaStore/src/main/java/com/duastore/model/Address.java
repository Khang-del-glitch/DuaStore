package com.duastore.model;

import jakarta.persistence.*;
import lombok.Data;

@Data // Dùng Lombok để tự sinh Getter/Setter
@Entity
@Table(name = "Addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "userId", nullable = false)
    private Integer userId;

    @Column(name = "tenNguoiNhan", nullable = false, length = 100)
    private String tenNguoiNhan;

    @Column(name = "soDienThoai", nullable = false, length = 15)
    private String soDienThoai;

    @Column(name = "tinhThanh", nullable = false, length = 100)
    private String tinhThanh;

    @Column(name = "quanHuyen", nullable = false, length = 100)
    private String quanHuyen;

    @Column(name = "phuongXa", nullable = false, length = 100)
    private String phuongXa;

    @Column(name = "diaChiCuThe", nullable = false, length = 200)
    private String diaChiCuThe;

    @Column(name = "isDefault", nullable = false)
    private Boolean isDefault = false; // Mặc định khi tạo mới là 0 (false)
}