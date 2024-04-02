document.addEventListener('DOMContentLoaded', (event) => {
    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
   
        const reviewText = document.getElementById('reviewText').value;

        // Using Axios to submit the review text to the server
        axios.post('/submit-review', {
            reviewText: reviewText
        })
        .then(function (response) {
            console.log('Success:', response.data);
            document.getElementById('reviewText').value = ''; // Clear the form
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
    });
});