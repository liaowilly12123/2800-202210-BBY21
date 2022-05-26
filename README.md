## Tutorria

* [General info](#general-info)
* [Features](#features)
* [Development](#development)
* [Building](#building)
* [Technologies](#technologies)
* [Contents](#content)
* [Resources](#resources)
* [Acknowledgements](#acknowledgements)
* [Contact](#Contact)

## General Info
Tutorria is an app to help students find professional tutors while also allowing tutors to showcase their qualifications and tutor ratings.

## Features
- User
    - Edit Profile
    - Profile Image
- Student
    - View Tutors
    - Filter Tutors
        - Price 
        - Rating
        - Topic
    - Rate Tutors
    - Bookmark Tutors
    - View Tutor Posts
- Tutor
    - Make Post
        - Image
        - Heading
        - Description
    - Add Qualifications
        - Cost
        - Contact
        - Education
        - Topic
- Admin
    - Dashboard
    - Delete Users
    - Create Users
    - Edit Users

## Development
- Install NodeJS
- Install MongoDB
```
npm i
npm run dev
```

## Deploying
- Tutorria uses the `MONGODB_URI` environment variable for the MongoDB connection, so set it to your MongoDB Atlas URI while deploying. 
- Tutorria uses the `PORT` environment variable for the port on which express runs, so set it to the port which is exposed by your hosting provider.
```
npm i
node server.js
```

## Technologies
Technologies used for this project:
* node.js: v18.1.0
* MongoDB: v5.0.8
* HTML5
* CSS3
* JavaScript: ES6
* express: v4.18.1
* mongoose: v6.3.2
* multer: v1.4.4
* egg.js
* QuillJS: v1.3.7
	
## Content
Content of the project folder:

```
├── api // Backend API
│   ├── apiRoutes.js
│   ├── timeline
│   │   └── timelineRoutes.js
│   ├── tutor
│   │   └── tutorRoutes.js
│   └── user
│       └── userRoutes.js
├── LICENSE
├── middleware // Express Middleware
│   ├── responseMiddleware.js
│   └── sanitizeMiddleware.js
├── models // MongoDB Schemas
│   ├── Bookmark.js
│   ├── image.js
│   ├── profilePicture.js
│   ├── Timeline.js
│   ├── Tutor.js
│   └── User.js
├── package.json
├── package-lock.json
├── public // Public Assets
│   ├── css // Stylesheets
│   │   ├── animations.css
│   │   ├── colors.css
│   │   ├── dashboard.css
│   │   ├── error.css
│   │   ├── landing.css
│   │   ├── main.css
│   │   ├── nav.css
│   │   ├── profile.css
│   │   └── quillOverrides.css
│   ├── html // HTML Pages
│   │   ├── dashboard.html
│   │   ├── landing.html
│   │   ├── main.html
│   │   ├── profile.html
│   │   └── template
│   │       └── nav.html
│   ├── img // Image Assets and logo
│   │   ├── logo.png
│   │   └── tutor.avif
│   └── js // Frontend javascript
│       ├── dashboard.js
│       ├── easterEgg.js
│       ├── landing.js
│       ├── login.js
│       ├── logout.js
│       ├── main.js
│       ├── modal
│       │   ├── modalFactory.js
│       │   └── modal.js
│       ├── profile.js
│       ├── template.js
│       └── toast.js
├── README.md
├── server.js // Main NodeJS Express app
└── utils // Utility functions
    └── validationUtils.js
```

## Resources
- Logo from Iconify
- Tutor image from https://theconversation.com/5-things-to-consider-before-you-hire-a-tutor-for-your-child-113323

## Acknowledgements 
- [NodeJS](https://nodejs.org/en/)
- [Nodemon](https://github.com/remy/nodemon)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Express](https://expressjs.com/)
- [Multer](https://www.npmjs.com/package/multer)
- [EggJS](https://github.com/mikeflynn/egg.js)
- [QuillJS](https://quilljs.com/)
- [CSSnowflakes](https://pajasevi.github.io/CSSnowflakes/)
- [Nord](https://www.nordtheme.com/)
- http://expressjs.com/en/resources/middleware/multer.html 

## Contact
- [Simrat](mailto:simrats169169@gmail.com)
- [Willy](mailto:wliao.dev@gmail.com)
- [Aodhan](mailto:aodhancearnaigh@gmail.com)
- [Nimrat](mailto:nimratcheema03@gmail.com)
