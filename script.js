// Track page views and load stats
document.addEventListener('DOMContentLoaded', function() {
    // Update stats from server
    fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            const viewsElement = document.getElementById('viewsCount');
            const totalViewsElement = document.getElementById('totalViews');
            const submissionsElement = document.getElementById('totalInquiries');
            const studentsCountElement = document.getElementById('studentsCount');
            const activeStudentsElement = document.getElementById('activeStudents');

            if (viewsElement) viewsElement.textContent = data.views + '+';
            if (totalViewsElement) totalViewsElement.textContent = data.views + '+';
            if (submissionsElement) submissionsElement.textContent = data.submissions + '+';
            
            // Generate random active students count between 400-600
            const activeStudents = Math.floor(Math.random() * 200) + 400;
            if (studentsCountElement) studentsCountElement.textContent = activeStudents + '+';
            if (activeStudentsElement) activeStudentsElement.textContent = activeStudents + '+';
        });

    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                country: document.getElementById('country').value,
                program: document.getElementById('program').value,
                message: document.getElementById('message').value
            };

            // Submit to server
            fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('contactForm').reset();
                    document.getElementById('formSuccess').classList.remove('hidden');
                    document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth' });
                    
                    // Update submissions count
                    const submissionsElement = document.getElementById('totalInquiries');
                    if (submissionsElement) {
                        const current = parseInt(submissionsElement.textContent);
                        submissionsElement.textContent = (current + 1) + '+';
                    }
                }
            });
        });
    }
});