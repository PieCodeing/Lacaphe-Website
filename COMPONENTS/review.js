document.addEventListener('DOMContentLoaded', (event) => {
    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
   
        const reviewText = document.getElementById('reviewText').value;
        console.log('Review Submitted:', reviewText);
        document.getElementById('reviewText').value = '';
    });
});
