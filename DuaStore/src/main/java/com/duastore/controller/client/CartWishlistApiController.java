package com.duastore.controller.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CartWishlistApiController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 1. LƯU / XÓA YÊU THÍCH VÀO CSDL
    @PostMapping("/wishlist/toggle")
    public ResponseEntity<Map<String, Object>> toggleWishlist(@RequestBody Map<String, Integer> payload) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = 2; // Tạm thời dùng tài khoản Nguyễn Văn An (id=2)
        Integer productId = payload.get("productId");
        
        // Kiểm tra xem trong DB đã có chưa
        String checkSql = "SELECT COUNT(*) FROM Wishlists WHERE userId = ? AND productId = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, userId, productId);
        
        if (count != null && count > 0) {
            // Đã có -> Xóa khỏi DB (Bỏ thích)
            jdbcTemplate.update("DELETE FROM Wishlists WHERE userId = ? AND productId = ?", userId, productId);
        } else {
            // Chưa có -> Thêm vào DB (Thích)
            jdbcTemplate.update("INSERT INTO Wishlists (userId, productId) VALUES (?, ?)", userId, productId);
        }
        
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    // 2. THÊM VÀO GIỎ HÀNG (CSDL)
    @PostMapping("/cart/add")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody Map<String, Integer> payload) {
        Map<String, Object> response = new HashMap<>();
        Integer userId = 2; 
        Integer productId = payload.get("productId");
        Integer variantId = payload.get("variantId");
        Integer quantity = payload.get("quantity");
        if(quantity == null) quantity = 1;

        if (variantId == null) {
            // Nếu chưa chọn biến thể (ví dụ bấm ngoài trang chủ), tự động lấy biến thể mặc định
            try {
                String sqlVar = "SELECT TOP 1 id FROM ProductVariants WHERE productId = ? AND isDefault = 1";
                variantId = jdbcTemplate.queryForObject(sqlVar, Integer.class, productId);
            } catch(Exception e) {
                response.put("success", false);
                return ResponseEntity.badRequest().body(response);
            }
        }

        // Cập nhật số lượng hoặc thêm mới
        String checkSql = "SELECT COUNT(*) FROM CartItems WHERE userId = ? AND variantId = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, userId, variantId);
        
        if (count != null && count > 0) {
            jdbcTemplate.update("UPDATE CartItems SET soLuong = soLuong + ? WHERE userId = ? AND variantId = ?", quantity, userId, variantId);
        } else {
            jdbcTemplate.update("INSERT INTO CartItems (userId, productId, variantId, soLuong) VALUES (?, ?, ?, ?)", userId, productId, variantId, quantity);
        }
        
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}