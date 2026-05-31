package com.duastore.controller.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import java.util.Map;

@Controller
public class HomeController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("title", "Trang chủ");
        
        try {
            Integer userId = 2; // Vẫn dùng tài khoản id=2
            
            // Lấy Tên, Giá, Ảnh từ View vw_ProductPrice của bạn
            String sql = "SELECT DISTINCT w.productId, p.tenSanPham, p.giaBan, p.hinhAnhHienThi " +
             "FROM Wishlists w " +
             "JOIN vw_ProductPrice p ON w.productId = p.id " +
             "WHERE w.userId = ?";
            List<Map<String, Object>> myWishlist = jdbcTemplate.queryForList(sql, userId);
            model.addAttribute("myWishlist", myWishlist); // Truyền mảng Dữ liệu vào HTML
            
            // Lấy mảng các ID để đối chiếu tô đỏ trái tim ngoài màn hình
            List<Integer> likedIds = jdbcTemplate.queryForList("SELECT productId FROM Wishlists WHERE userId = ?", Integer.class, userId);
            model.addAttribute("likedIds", likedIds);
            
        } catch (Exception e) {
            System.out.println("Lỗi đọc DB: " + e.getMessage());
        }

        return "view/client/index";
    }
}