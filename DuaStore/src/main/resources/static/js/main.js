/* =====================================================
   DuaStore — main.js (Client)
===================================================== */

'use strict';

/* ══════════════════════════════════════════
   EDIT TOGGLE TẠI ĐÂY — Mobile nav toggle (☰ / ✕)
   Sửa openNav/closeNav, icon swap, sub-menu tại đây
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    const toggle = document.getElementById('dsNavToggle');
    const panel  = document.getElementById('dsNavPanel');
    const overlay = document.getElementById('dsNavOverlay');
    const icon   = document.getElementById('dsToggleIcon');

    function openNav() {
        panel.classList.add('open');
        overlay.classList.add('open');
        toggle.classList.add('is-open');
        toggle.setAttribute('aria-label', 'Đóng menu');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        panel.classList.remove('open');
        overlay.classList.remove('open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-label', 'Mở menu');
        document.body.style.overflow = '';

        // Thu gọn tất cả sub-menu đang mở
        document.querySelectorAll('.ds-sub-menu.open').forEach(el => el.classList.remove('open'));
        document.querySelectorAll('.ds-chevron.rotated').forEach(el => el.classList.remove('rotated'));
    }

    if (toggle && panel && icon) {
        toggle.addEventListener('click', () => {
            if (panel.classList.contains('open')) {
                closeNav();
            } else {
                openNav();
            }
        });
    }
    if (overlay) {
        overlay.addEventListener('click', closeNav);
    }

    /* ── Sub-menu toggle trong panel (giống pattern toggle chính) ── */
    document.querySelectorAll('.ds-sub-toggle').forEach(btn => {
        const menu = btn.nextElementSibling;
        if (btn && menu) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (menu.classList.contains('open')) {
                    menu.classList.remove('open');
                    btn.querySelector('.ds-chevron')?.classList.remove('rotated');
                } else {
                    menu.classList.add('open');
                    btn.querySelector('.ds-chevron')?.classList.add('rotated');
                }
            });
        }
    });

    /* ── Đóng panel khi click link ── */
    document.querySelectorAll('.ds-nav-panel .ds-nav-link, .ds-nav-panel .ds-sub-link').forEach(link => {
        link.addEventListener('click', () => {
            // Chỉ đóng nếu không phải sub-toggle
            if (!link.classList.contains('ds-sub-toggle')) {
                setTimeout(closeNav, 200);
            }
        });
    });

});
/* ══════════════════════════════════════════
   KẾT THÚC EDIT TOGGLE
══════════════════════════════════════════ */

/* ── SwiperJS Hero Carousel ──
   ★ Cấu hình: fade effect, loop 5s, pagination dots
   ★ Xem HTML trong index.html → cần đúng class .hero-swiper + .hero-pagination */
document.addEventListener('DOMContentLoaded', () => {
    const heroSwiperEl = document.querySelector('.hero-swiper');
    if (heroSwiperEl) {
        new Swiper('.hero-swiper', {
            loop: true,
            effect: 'fade',
            autoplay: { delay: 5000, disableOnInteraction: false },
            pagination: { el: '.hero-pagination', clickable: true },
        });
    }
});

/* ── ScrollReveal ──
   ★ Các class gắn vào HTML:
     .sr-card   → category grid (mỗi card cách 200ms)
     .sr-up     → section từ dưới lên (hero, testimonials, FAQ, product carousel)
     .sr-left   → từ trái sang (dự trữ)
     .sr-right  → từ phải sang (dự trữ)
   ★ Import từ CDN trong base.html dòng 457 */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            origin: 'bottom', distance: '40px', duration: 800, delay: 200, easing: 'ease-out'
        });
        sr.reveal('.sr-card', { interval: 200 });
        sr.reveal('.sr-up', {});
        sr.reveal('.sr-left', { origin: 'left', distance: '60px' });
        sr.reveal('.sr-right', { origin: 'right', distance: '60px' });
    }
});

/* ── Back to top button ── */
const backTopBtn = document.getElementById('backTopBtn');
if (backTopBtn) {
    window.addEventListener('scroll', () => {
        backTopBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    }, { passive: true });
}

/* ── Auto-dismiss flash alerts sau 5 giây ── */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.alert.alert-dismissible').forEach(el => {
        setTimeout(() => {
            const instance = bootstrap.Alert.getOrCreateInstance(el);
            if (instance) instance.close();
        }, 5000);
    });
});

/* ── Cập nhật số lượng badge giỏ hàng ──
   Gọi hàm này sau AJAX thêm vào giỏ:
   updateCartBadge(newCount);
*/
function updateCartBadge(count) {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    if (count <= 0) {
        badge.classList.add('d-none');
        badge.textContent = '0';
    } else {
        badge.classList.remove('d-none');
        badge.textContent = count > 99 ? '99+' : String(count);
    }
}

/* ── AJAX thêm vào giỏ hàng ──
   ★ Button có class .ds-add-cart + data-id (productId) + data-name
   ★ Gửi POST /api/cart/add → backend trả JSON { cartCount: N }
   ★ Thành công: gọi updateCartBadge(N) + hiện "✓ Đã thêm" 2s
   ★ Backend CẦN tạo endpoint POST /api/cart/add */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ds-add-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const name = this.dataset.name;
            const origText = this.textContent;
            this.textContent = '⏳';
            this.disabled = true;

            fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: parseInt(id), quantity: 1 })
            })
            .then(r => r.json())
            .then(data => {
                if (data && typeof data.cartCount !== 'undefined') {
                    updateCartBadge(data.cartCount);
                }
                this.textContent = '✓ Đã thêm';
                setTimeout(() => { this.textContent = origText; this.disabled = false; }, 2000);
            })
            .catch(() => {
                this.textContent = '✗ Lỗi';
                setTimeout(() => { this.textContent = origText; this.disabled = false; }, 2000);
            });
        });
    });
});

/* ══════════════════════════════════════════
   THEME TOGGLE (client — inside profile dropdown)
══════════════════════════════════════════ */
(function() {
    function getTheme() { return localStorage.getItem('duastore-theme') || 'light'; }
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('duastore-theme', theme);
        const isDark = theme === 'dark';
        const icon = document.getElementById('dsProfileThemeIcon');
        const label = document.getElementById('dsProfileThemeLabel');
        if (icon) icon.className = isDark ? 'bi bi-sun' : 'bi bi-moon-stars';
        if (label) label.textContent = isDark ? 'Chế độ sáng' : 'Chế độ tối';
    }
    setTheme(getTheme());
    const btn = document.getElementById('dsProfileThemeToggle');
    if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); setTheme(getTheme() === 'dark' ? 'light' : 'dark'); });
})();

/* ══════════════════════════════════════════
   PROFILE MENU (client)
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('dsProfileTrigger');
    const dropdown = document.getElementById('dsProfileDropdown');
    if (trigger && dropdown) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.toggle('open');
            trigger.setAttribute('aria-expanded', isOpen);
        });
        document.addEventListener('click', (e) => {
            if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

/* ══════════════════════════════════════════
   FAQ ACCORDION

   ★ Cơ chế: click câu hỏi → mở/đóng bằng max-height animation
     (không dùng Bootstrap collapse vì cần transition mượt)
   ★ Click câu hỏi khác → đóng cái đang mở trước, mở cái mới
   ★ Chevron xoay 180° nhờ CSS: [aria-expanded="true"] i { transform: rotate(180deg) }
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.ds-faq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const body = btn.nextElementSibling;
            const isOpen = btn.getAttribute('aria-expanded') === 'true';
            // close all
            document.querySelectorAll('.ds-faq-btn').forEach(b => {
                b.setAttribute('aria-expanded', 'false');
                b.nextElementSibling.style.maxHeight = '0';
            });
            // open clicked
            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
});

/* ══════════════════════════════════════════
   TESTIMONIALS SWIPER

   ★ Xem HTML trong index.html section .ds-testi
   ★ breakpoints: mobile 1 → tablet 2 → desktop 3 item / slide
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const el = document.querySelector('.testi-swiper');
    if (el && typeof Swiper !== 'undefined') {
        new Swiper('.testi-swiper', {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            pagination: { el: '.testi-pagination', clickable: true },
            breakpoints: {
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }
});

/* ══════════════════════════════════════════
   PRODUCT CAROUSEL SWIPER

   ★ Mỗi card sản phẩm chứa nút .ds-add-cart (AJAX)
   ★ breakpoints: mobile 1 → tablet 2 → desktop 4 item / slide
   ★ Xem HTML trong index.html section .ds-product-carousel
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const el = document.querySelector('.product-swiper');
    if (el && typeof Swiper !== 'undefined') {
        new Swiper('.product-swiper', {
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            navigation: { nextEl: '.product-next', prevEl: '.product-prev' },
            breakpoints: {
                0: { slidesPerView: 1, spaceBetween: 16 },
                576: { slidesPerView: 2, spaceBetween: 16 },
                992: { slidesPerView: 4, spaceBetween: 20 }
            }
        });
    }
});
//khang
// ==========================================
// 1. ĐÓNG / MỞ POPUP (Yêu thích & Giỏ hàng)
// ==========================================
function togglePopup(popupId) {
    // Ẩn tất cả các popup khác trước khi mở
    document.querySelectorAll('.custom-popup').forEach(popup => {
        if(popup.id !== popupId) popup.style.display = 'none';
    });

    const popup = document.getElementById(popupId);
    if (popup.style.display === 'block') {
        popup.style.display = 'none';
    } else {
        popup.style.display = 'block';
    }
}

// Ẩn popup khi click ra ngoài vùng popup
document.addEventListener('click', function(event) {
    const btnWishlist = document.getElementById('btn-wishlist-toggle');
    const popupWishlist = document.getElementById('wishlist-popup');
    const btnCart = document.getElementById('btn-cart-toggle');
    const popupCart = document.getElementById('cart-popup');

    if (btnWishlist && popupWishlist) {
        const isClickInsideWishlist = btnWishlist.contains(event.target) || popupWishlist.contains(event.target);
        if (!isClickInsideWishlist) popupWishlist.style.display = 'none';
    }

    if (btnCart && popupCart) {
        const isClickInsideCart = btnCart.contains(event.target) || popupCart.contains(event.target);
        if (!isClickInsideCart) popupCart.style.display = 'none';
    }
});

// ==========================================
// 2. XÓA SẢN PHẨM KHỎI POPUP
// ==========================================
function removeWishlist(wishlistId) {
    const item = document.getElementById('wishlist-item-' + wishlistId);
    if (item) item.remove();
    // Sau này ghép code gọi API Spring Boot ở đây
}

function removeCartItem(cartItemId) {
    const item = document.getElementById('cart-item-' + cartItemId);
    if (item) item.remove();
    // Sau này ghép code gọi API Spring Boot ở đây
}

// ==========================================
// 3. XỬ LÝ CHUYỂN TỪ YÊU THÍCH SANG GIỎ HÀNG
// ==========================================
function addToCartFromWishlist(productId, variantId) {
    alert("Đã thêm sản phẩm vào giỏ hàng!");
    document.getElementById('wishlist-popup').style.display = 'none';
    document.getElementById('cart-popup').style.display = 'block';
    // Sau này ghép code gọi API Spring Boot ở đây
}

// ==========================================
// 4. XỬ LÝ CLICK THẢ TIM BẰNG FETCH API (Đã bỏ check Đăng nhập)
// ==========================================
function toggleWishlist(btnElement, productId) {
    const icon = btnElement.querySelector('i');
    const container = document.getElementById('wishlist-items-container');
    
    const card = btnElement.closest('.ds-product-card');
    const productName = card ? card.querySelector('.ds-product-name').innerText : 'Sản phẩm ' + productId;
    const productPrice = card ? card.querySelector('.ds-product-price').innerText : '';

    fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            if (btnElement.classList.contains('active')) {
                // Đang thích -> Hủy thích
                btnElement.classList.remove('active');
                icon.classList.remove('bi-heart-fill'); 
                icon.classList.add('bi-heart');         
                
                const itemToRemove = document.getElementById('wishlist-item-' + productId);
                if(itemToRemove) itemToRemove.remove();
            } else {
                // Chưa thích -> Thêm yêu thích
                btnElement.classList.add('active');
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill'); 

                const dummyItem = document.getElementById('wishlist-item-1'); 
                if(dummyItem && productId !== 1) dummyItem.remove(); 

                const html = `
                    <div class="popup-item" id="wishlist-item-${productId}">
                        <div style="width: 50px; height: 50px; background: #e5e5e5; border-radius: 4px; margin-right: 15px; display: flex; align-items: center; justify-content: center;"><i class="bi bi-box-seam text-secondary"></i></div>
                        <div class="popup-item-info">
                            <a href="/san-pham/${productId}">${productName}</a>
                            <div class="text-danger fw-semibold mt-1">${productPrice}</div>
                            <button class="btn btn-sm btn-outline-primary mt-2 w-100" onclick="addToCartFromWishlist(${productId}, null)">
                                <i class="bi bi-cart-plus"></i> Thêm vào giỏ
                            </button>
                        </div>
                        <button class="btn-delete-item" onclick="removeWishlist(${productId})" title="Xóa">
                            <i class="bi bi-x-circle"></i>
                        </button>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', html);
            }
        }
    })
    .catch(error => console.log("Lỗi: ", error));
}

// ==========================================
// 5. XỬ LÝ CLICK THÊM VÀO GIỎ BẰNG FETCH API (Đã bỏ check Đăng nhập)
// ==========================================
function addToCart(productId, variantId, quantity) {
    const container = document.getElementById('cart-items-container');
    const cartPopup = document.getElementById('cart-popup');

    const btnAdd = document.querySelector(`.ds-add-cart[data-id="${productId}"]`);
    const productName = btnAdd ? btnAdd.getAttribute('data-name') : 'Sản phẩm ' + productId;
    const card = btnAdd ? btnAdd.closest('.ds-product-card') : null;
    const productPrice = card ? card.querySelector('.ds-product-price').innerText : 'Đang cập nhật';
    
    fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            productId: productId, 
            variantId: variantId, 
            quantity: quantity 
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            let existingItem = document.getElementById('cart-item-' + productId);
            if(!existingItem) {
                const dummyCart = document.getElementById('cart-item-1');
                if(dummyCart && productId !== 1) dummyCart.remove();

                const html = `
                    <div class="popup-item" id="cart-item-${productId}">
                        <div style="width: 50px; height: 50px; background: #e5e5e5; border-radius: 4px; margin-right: 15px; display: flex; align-items: center; justify-content: center;"><i class="bi bi-box-seam text-secondary"></i></div>
                        <div class="popup-item-info">
                            <a href="/san-pham/${productId}" class="text-truncate d-block" style="max-width: 180px;">${productName}</a>
                            <div class="mt-1">Số lượng: ${quantity} x <span class="text-danger fw-semibold">${productPrice}</span></div>
                        </div>
                        <button class="btn-delete-item" onclick="removeCartItem(${productId})" title="Xóa khỏi giỏ">
                            <i class="bi bi-x-circle"></i>
                        </button>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', html);
            }

            alert("Đã thêm " + productName + " vào giỏ hàng!");
            
            if (cartPopup) {
                const wishlistPopup = document.getElementById('wishlist-popup');
                if(wishlistPopup) wishlistPopup.style.display = 'none';
                
                cartPopup.style.display = 'block';
                setTimeout(() => { cartPopup.style.display = 'none'; }, 3000);
            }
        }
    })
    .catch(error => console.log("Lỗi: ", error));
}

// Hàm hỗ trợ xóa (không thay đổi)
function removeWishlist(wishlistId) {
    const item = document.getElementById('wishlist-item-' + wishlistId);
    if (item) item.remove();
    
    const btnHeart = document.querySelector(`.btn-wishlist-card[onclick*="toggleWishlist(this, ${wishlistId})"]`);
    if(btnHeart) {
        btnHeart.classList.remove('active');
        btnHeart.querySelector('i').classList.replace('bi-heart-fill', 'bi-heart');
    }
}

function removeCartItem(cartItemId) {
    const item = document.getElementById('cart-item-' + cartItemId);
    if (item) item.remove();
}

function addToCartFromWishlist(productId, variantId) {
    addToCart(productId, variantId, 1);
}