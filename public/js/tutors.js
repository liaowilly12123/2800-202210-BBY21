'use strict';
const registerForm = document.getElementById('tutor');

registerForm.addEventListener('submit', async(e) => {
    console.log('bruh');
    e.preventDefault();
    const educationNode = document.getElementById('tutor-education');
    const experienceNode = document.getElementById('tutor-experience');
    const contact = document.getElementById('tutor-contact');
    const subject = document.getElementById('tutor-subject');
    const info = document.getElementById('tutor-info');


    const res = await fetch('/api/tutor/qualifications', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            higherEducation: educationNode.value,
            experience: experienceNode.value,
            contactNumber: contact.value,
            subject: subject.value,
            pay: info.value,
        }),
    });

    const responseJson = await res.json();
    if (responseJson.success) {
        console.log('Registered Succesfully');
        window.location.href = "/upload";
    } else {
        console.log(responseJson);
        console.error('problem in registering');
    }
});