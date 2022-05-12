'use strict';
const router = require('express').Router();
const TutorQualification = require('../../models/tutorQualifications.js');

// Checks if data is undefined and sends a fail message back to the client if it
// is.
// Returns true if data is undefined, else false
function validate(res, data, msg) {
    if (typeof data === 'undefined') {
        res.fail(msg);
        return true;
    }
    return false;
}

router.post('/qualifications', async function(req, res) {
    if (!req.session.loggedIn) {
        return res.fail('User not logged in');
    } else {
        if (req.session.userType !== 'tutor') {
            return res.fail('User is not a tutor');
        }
    }

    const body = req.body;

    const higherEducation = body.higherEducation;
    if (validate(res, higherEducation, 'Higher Education is undefined')) return;

    const experience = body.experience;
    if (validate(res, experience, 'Experience is undefined')) return;

    const contactNumber = body.contactNumber;
    if (validate(res, contactNumber, 'contact Number is undefined')) return;

    const subject = body.subject;
    if (validate(res, subject, 'subject is undefined')) return;

    const pay = body.pay;
    if (validate(res, pay, 'pay is undefined')) return;

    const newDoc = new TutorQualification({
        user_id: req.session.userId,
        higherEducation: higherEducation,
        experience: experience,
        contactNumber: contactNumber,
        subject: subject,
        pay: pay,
    });
    await newDoc.save();

    res.success();
});

module.exports = router;