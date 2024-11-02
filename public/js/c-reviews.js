// js/c-reviews.js

// This file contains the JavaScript code that will be used to interact with the customer reviews page.

document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".carousel-item");
    const track = document.querySelector(".carousel-track");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const dotsContainer = document.querySelector(".carousel-dots");
  
    let currentIndex = 0;
  
    function updateCarousel() {
        const offset = -100 * currentIndex; // Shift by 100% for each item
        track.style.transform = `translateX(${offset}%)`;
        updateDots();
    }
  
    function updateDots() {
        // Remove "active" class from all dots
        dotsContainer.querySelectorAll(".carousel-dot").forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }
  
    function showNextItem() {
        if (currentIndex < items.length - 1) {
            currentIndex += 1;
        } else {
            currentIndex = 0; // Loop back to the first item
        }
        updateCarousel();
    }
  
    function showPrevItem() {
        if (currentIndex > 0) {
            currentIndex -= 1;
        } else {
            currentIndex = items.length - 1; // Loop to the last item
        }
        updateCarousel();
    }
  
    // Create dots dynamically based on the number of items
    items.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("carousel-dot");
        if (index === currentIndex) dot.classList.add("active");
        dot.dataset.index = index;
        dot.addEventListener("click", () => {
            currentIndex = index;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    });
  
    // Event listeners for navigation buttons
    nextBtn.addEventListener("click", showNextItem);
    prevBtn.addEventListener("click", showPrevItem);
  
    // Initial display
    updateCarousel();
});


  