## Tutorria

* [General info](#general-info)
* [Development](#development)
* [Building](#building)
* [Technologies](#technologies)
* [Contents](#content)
* [Resources](#resources)
* [Acknowledgements](#acknowledgements)

## General Info
Tutorria is an app to help students find professional tutors while also allowing tutors to showcase their qualifications and tutor ratings.

## Development
```
npm i
npm run dev
```

## Deploying
```
npm i
node server.js
```

## Technologies
Technologies used for this project:
* node.js
* MongoDB
* HTML, CSS
* JavaScript
* express
* multer
* egg.js
	
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
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Multer](https://www.npmjs.com/package/multer)
- [EggJS](https://github.com/mikeflynn/egg.js)
- [CSSnowflakes](https://pajasevi.github.io/CSSnowflakes/)
