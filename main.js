async function loadMenu(categoryName = "Burger") {
    const grid = document.getElementById('product-grid');
    
    try {
        const response = await fetch('data/products.json');
        const text = await response.text();

        if (!text) {
            showPlaceholders(grid);
            return;
        }

        const data = JSON.parse(text);

        if (!data.restaurant || !data.restaurant.menu) {
            showPlaceholders(grid);
            return;
        }

        const categoryData = data.restaurant.menu.find(
            cat => cat.category === categoryName
        );

        if (!categoryData || !categoryData.items || categoryData.items.length !== 3) {
            console.warn(`Category "${categoryName}" must have exactly 3 items.`);
            showPlaceholders(grid);
            return;
        }

        grid.innerHTML = '';

        categoryData.items.forEach(item => {
            const card = document.createElement('article');
            card.className = 'product-card';

            card.innerHTML = `
                <div class="card-tags">
                    ${item.available ? '<span class="tag new">Available</span>' : ''}
                </div>
                <img src="${item.image || 'assets/images/placeholder.png'}" alt="${item.name}" class="product-img">
                <h3 class="product-title">${item.name.toUpperCase()}</h3>
                <p class="product-desc">${item.description}</p>
                <div class="card-footer">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="btn-select">SELECT</button>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading JSON:", error);
        showPlaceholders(grid);
    }
}

// 🔹 Placeholder generator (always 3)
function showPlaceholders(grid) {
    grid.innerHTML = '';

    for (let i = 0; i < 3; i++) {
        const card = document.createElement('article');
        card.className = 'product-card';

        card.innerHTML = `
            <div class="card-tags"></div>
            <img src="assets/images/placeholder.png" class="product-img">
            <h3 class="product-title">Coming Soon</h3>
            <p class="product-desc">This item will be added later.</p>
            <div class="card-footer">
                <span class="price">--</span>
                <button class="btn-select" disabled>SELECT</button>
            </div>
        `;

        grid.appendChild(card);
    }
}

// Tabs (single clean version)
document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', (e) => {
        const activeTab = document.querySelector('.tab.active');
        if (activeTab) activeTab.classList.remove('active');

        e.target.classList.add('active');
        loadMenu(e.target.innerText);
    });
});

// Initial load
loadMenu();


// ================= REVIEWS =================

async function loadReviews() {
    const reviewGrid = document.getElementById('reviews-grid');
    
    try {
        const response = await fetch('data/products.json');
        const text = await response.text();

        if (!text) {
            showReviewPlaceholders(reviewGrid);
            return;
        }

        const data = JSON.parse(text);

        if (!data.reviews || data.reviews.length === 0) {
            showReviewPlaceholders(reviewGrid);
            return;
        }

        reviewGrid.innerHTML = '';

        data.reviews.forEach(rev => {
            const card = document.createElement('div');
            card.className = 'review-card';

            card.innerHTML = `
                <div class="review-header">
                    <span class="review-category">${rev.category}</span>
                    <div class="stars">${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}</div>
                </div>
                <p class="review-text">"${rev.comment}"</p>
                <p class="reviewer-name">- ${rev.user}</p>
            `;

            reviewGrid.appendChild(card);
        });

    } catch (error) {
        console.warn("No reviews found, showing placeholder.");
        showReviewPlaceholders(reviewGrid);
    }
}

function showReviewPlaceholders(grid) {
    grid.innerHTML = `
        <div class="review-card" style="grid-column: 1 / -1; text-align: center;">
            <div class="review-header" style="justify-content: center;">
                <span class="review-category">Reviews Pending</span>
            </div>
            <p class="review-text">"Customer feedback will appear here once the data is provided."</p>
            <p class="reviewer-name">- System</p>
        </div>
    `;
}

// Initial reviews load
loadReviews();