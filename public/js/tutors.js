"use strict";
const registerForm = document.getElementById("tutor");
const submit = document.getElementById("Submit");
submit.onclick = function() {
    document.getElementById("tutor").submit();
    document.getElementById("form2").submit();
}
registerForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const educationNode = document.getElementById("tutor-education");
    const experienceNode = document.getElementById("tutor-experience");
    const subjectNode = document.getElementById("tutor-subject");
    const payNode = document.getElementById("tutor-pay");

    const res = await fetch("/api/qualifications/tutors", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            higherEducation: educationNode.value,
            experience: experienceNode.value,
            subject: subjectNode.value,
            hourlyPay: payNode.value,
        }),
    });

    const responseJson = await res.json();
    if (responseJson.success) {
        console.log("Registered Succesfully");

    } else {
        console.error("problem in registering");
    }

});