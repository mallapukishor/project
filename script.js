
const products = [
    {
        id: 1,
        name: 'Tie-Dye Midi Dress',
        price: 89.99,
        image: 'images/tie-dye-dress.jpg'
    },
    {
        id: 2,
        name: 'Cropped Hoodie Set',
        price: 65.99,
        image: 'images/yellow-hoodie-set.jpg'
    },
    {
        id: 3,
        name: 'Retro Logo Tee',
        price: 45.99,
        image: 'images/retro-logo-tee.jpg'
    },
    {
        id: 4,
        name: 'Street Style Combo',
        price: 125.99,
        image: 'images/street-style-combo.jpg'
    },
    {
        id: 5,
        name: 'Casual Linen Set',
        price: 79.99,
        image: 'images/casual-linen-set.jpg'
    },
    {
        id: 6,
        name: 'Oversized Blazer',
        price: 149.99,
        image: 'images/oversized-blazer.jpg'
    }
];

// Global Variables
let selectedProducts = [];
const BUNDLE_THRESHOLD = 3;
const DISCOUNT_PERCENTAGE = 30;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const bundleStatus = document.getElementById('bundleStatus');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const selectedProductsContainer = document.getElementById('selectedProducts');
const pricingSummary = document.getElementById('pricingSummary');
const subtotalElement = document.getElementById('subtotal');
const discountRow = document.getElementById('discountRow');
const discountAmount = document.getElementById('discountAmount');
const totalPrice = document.getElementById('totalPrice');
const savingsText = document.getElementById('savingsText');
const addToCartBtn = document.getElementById('addToCartBtn');
const cartButtonText = document.getElementById('cartButtonText');

// Initialize Application
function init() {
    renderProducts();
    updateBundleDisplay();
    setupEventListeners();
}

// Render Products Grid
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card Element
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const isSelected = selectedProducts.some(p => p.id === product.id);
    if (isSelected) {
        card.classList.add('selected');
    }
    
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <button class="quick-add-btn ${isSelected ? 'selected' : ''}" onclick="toggleProduct(${product.id})">
                ${isSelected ? '✓' : '+'}
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-bundle-btn ${isSelected ? 'selected' : ''}" onclick="toggleProduct(${product.id})">
                <span>${isSelected ? '✓' : '+'}</span>
                <span>${isSelected ? 'Added to Bundle' : 'Add to Bundle'}</span>
            </button>
        </div>
    `;
    
    return card;
}

// Toggle Product Selection
function toggleProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = selectedProducts.findIndex(p => p.id === productId);
    
    if (existingIndex >= 0) {
        // Remove product
        selectedProducts.splice(existingIndex, 1);
    } else {
        // Add product
        selectedProducts.push(product);
    }
    
    // Re-render products to update UI
    renderProducts();
    updateBundleDisplay();
    
    // Add visual feedback
    animateButton(productId);
}

// Add visual feedback to button clicks
function animateButton(productId) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const quickBtn = card.querySelector('.quick-add-btn');
        const bundleBtn = card.querySelector('.add-to-bundle-btn');
        
        if (quickBtn && quickBtn.onclick && quickBtn.onclick.toString().includes(productId)) {
            quickBtn.style.transform = 'scale(0.9)';
            bundleBtn.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                quickBtn.style.transform = '';
                bundleBtn.style.transform = '';
            }, 150);
        }
    });
}

// Remove product from bundle
function removeProduct(productId) {
    selectedProducts = selectedProducts.filter(p => p.id !== productId);
    renderProducts();
    updateBundleDisplay();
}

// Update Bundle Display
function updateBundleDisplay() {
    updateBundleStatus();
    updateProgressBar();
    updateSelectedProductsList();
    updatePricingSummary();
    updateAddToCartButton();
}

// Update Bundle Status
function updateBundleStatus() {
    const count = selectedProducts.length;
    bundleStatus.textContent = `${count} of ${BUNDLE_THRESHOLD} items${count >= BUNDLE_THRESHOLD ? ' - 30% off unlocked!' : ''}`;
    
    // Add visual feedback for completed bundle
    if (count >= BUNDLE_THRESHOLD) {
        bundleStatus.style.color = 'var(--color-success)';
    } else {
        bundleStatus.style.color = 'var(--color-muted)';
    }
}

// Update Progress Bar
function updateProgressBar() {
    const count = selectedProducts.length;
    const percentage = Math.min((count / BUNDLE_THRESHOLD) * 100, 100);
    
    progressFill.style.width = `${percentage}%`;
    
    if (count < BUNDLE_THRESHOLD) {
        const remaining = BUNDLE_THRESHOLD - count;
        progressText.textContent = `Add ${remaining} more item${remaining !== 1 ? 's' : ''} for 30% off`;
        progressText.style.color = 'var(--color-muted)';
    } else {
        progressText.textContent = 'Bundle discount applied!';
        progressText.style.color = 'var(--color-success)';
    }
}

// Update Selected Products List
function updateSelectedProductsList() {
    if (selectedProducts.length === 0) {
        selectedProductsContainer.innerHTML = `
            <div class="empty-state">
                <div class="cart-icon">🛒</div>
                <p>No items in your bundle</p>
                <p class="empty-subtext">Start adding products to build your bundle</p>
            </div>
        `;
        return;
    }
    
    selectedProductsContainer.innerHTML = selectedProducts.map(product => `
        <div class="selected-item">
            <img src="${product.image}" alt="${product.name}" class="selected-item-image">
            <div class="selected-item-info">
                <div class="selected-item-name">${product.name}</div>
                <div class="selected-item-price">$${product.price.toFixed(2)}</div>
            </div>
            <button class="remove-btn" onclick="removeProduct(${product.id})" title="Remove item">
                🗑️
            </button>
        </div>
    `).join('');
}

// Update Pricing Summary
function updatePricingSummary() {
    if (selectedProducts.length === 0) {
        pricingSummary.style.display = 'none';
        return;
    }
    
    pricingSummary.style.display = 'block';
    
    const subtotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
    const hasDiscount = selectedProducts.length >= BUNDLE_THRESHOLD;
    const discount = hasDiscount ? subtotal * (DISCOUNT_PERCENTAGE / 100) : 0;
    const total = subtotal - discount;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalPrice.textContent = `$${total.toFixed(2)}`;
    
    if (hasDiscount) {
        discountRow.style.display = 'flex';
        discountAmount.textContent = `-$${discount.toFixed(2)}`;
        savingsText.style.display = 'block';
        savingsText.textContent = `You saved $${discount.toFixed(2)}!`;
    } else {
        discountRow.style.display = 'none';
        savingsText.style.display = 'none';
    }
}

// Update Add to Cart Button
function updateAddToCartButton() {
    const count = selectedProducts.length;
    const hasDiscount = count >= BUNDLE_THRESHOLD;
    
    addToCartBtn.disabled = !hasDiscount;
    
    if (hasDiscount) {
        const total = calculateTotal();
        cartButtonText.textContent = `Add Bundle to Cart - $${total.toFixed(2)}`;
        addToCartBtn.classList.remove('disabled');
    } else {
        cartButtonText.textContent = 'Add 3+ Items to Continue';
        addToCartBtn.classList.add('disabled');
    }
}

// Calculate Total Price
function calculateTotal() {
    const subtotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
    const hasDiscount = selectedProducts.length >= BUNDLE_THRESHOLD;
    const discount = hasDiscount ? subtotal * (DISCOUNT_PERCENTAGE / 100) : 0;
    return subtotal - discount;
}

// Handle Add to Cart
function handleAddToCart() {
    if (selectedProducts.length >= BUNDLE_THRESHOLD) {
        console.log('Bundle added to cart:', {
            products: selectedProducts,
            subtotal: selectedProducts.reduce((sum, product) => sum + product.price, 0),
            discount: selectedProducts.reduce((sum, product) => sum + product.price, 0) * (DISCOUNT_PERCENTAGE / 100),
            total: calculateTotal(),
            discountPercentage: DISCOUNT_PERCENTAGE
        });
        
        // Show success toast
        showToast('Bundle Added to Cart!', `${selectedProducts.length} items added with 30% off discount`);
        
        // Reset bundle
        selectedProducts = [];
        updateBundleDisplay();
        renderProducts();
    }
}

// Show Toast Notification
function showToast(title, message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Add to cart button
    addToCartBtn.addEventListener('click', handleAddToCart);
    
    // Image error handling
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.style.display = 'none';
            console.warn('Image failed to load:', e.target.src);
        }
    }, true);
    
    // Keyboard shortcuts (1-6 for products)
    document.addEventListener('keydown', function(e) {
        if (e.key >= '1' && e.key <= '6') {
            const productIndex = parseInt(e.key) - 1;
            if (products[productIndex]) {
                toggleProduct(products[productIndex].id);
            }
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);